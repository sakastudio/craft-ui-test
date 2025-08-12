import './CraftingArea.css';
import type {CraftRecipe, InventoryItem, Item} from "./CraftingInterface.tsx";
import ItemSlot from './ItemSlot';
import { useState, useEffect, useRef } from 'react';

interface CraftingAreaProps {
  selectedRecipe: CraftRecipe | null;
  items: Item[];
  inventory: InventoryItem[];
  onCraft: () => void;
  onSelectRecipe: (recipe: CraftRecipe) => void;
  recipes: CraftRecipe[];
}

function CraftingArea({ selectedRecipe, items, inventory, onCraft, onSelectRecipe, recipes }: CraftingAreaProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const CRAFT_DURATION = 1000; // 1秒
  const PROGRESS_UPDATE_INTERVAL = 10; // 10msごとに更新

  const getItemById = (itemGuid: string) => {
    return items.find(item => item.itemGuid === itemGuid);
  };

  const canCraft = () => {
    if (!selectedRecipe) return false;
    return selectedRecipe.requiredItems.every(req => {
      const invItem = inventory.find(inv => inv.item.itemGuid === req.itemGuid);
      return invItem && invItem.count >= req.count;
    });
  };

  const handleMaterialClick = (itemGuid: string) => {
    const recipe = recipes.find(r => r.craftResultItemGuid === itemGuid);
    if (recipe) {
      onSelectRecipe(recipe);
    }
  };

  const startCrafting = () => {
    if (!canCraft()) return;
    
    setIsHolding(true);
    setProgress(0);
    
    // プログレスバーの更新
    let elapsed = 0;
    progressIntervalRef.current = setInterval(() => {
      elapsed += PROGRESS_UPDATE_INTERVAL;
      const newProgress = Math.min((elapsed / CRAFT_DURATION) * 100, 100);
      setProgress(newProgress);
    }, PROGRESS_UPDATE_INTERVAL);
    
    // クラフト実行タイマー
    holdTimerRef.current = setTimeout(() => {
      onCraft();
      stopCrafting();
    }, CRAFT_DURATION);
  };

  const stopCrafting = () => {
    setIsHolding(false);
    setProgress(0);
    
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // コンポーネントがアンマウントされた時のクリーンアップ
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  if (!selectedRecipe) {
    return (
      <div className="crafting-area">
        <div className="recipe-display">
          <div className="recipe-placeholder">
            レシピを選択してください
          </div>
        </div>
        <div className="craft-controls">
          <button className="craft-button" disabled>
            CRAFT
          </button>
        </div>
      </div>
    );
  }

  const resultItem = getItemById(selectedRecipe.craftResultItemGuid);

  return (
    <div className="crafting-area">
      <div className="recipe-display">
        <div className="recipe-materials">
          {selectedRecipe.requiredItems.map((req, index) => {
            const item = getItemById(req.itemGuid);
            const invItem = inventory.find(inv => inv.item.itemGuid === req.itemGuid);
            const hasEnough = invItem && invItem.count >= req.count;
            
            return (
              <div 
                key={index} 
                onClick={() => handleMaterialClick(req.itemGuid)}
                style={{ cursor: 'pointer' }}
              >
                <ItemSlot
                  itemName={item?.name}
                  count={req.count}
                  size="large"
                  variant={hasEnough ? 'default' : 'insufficient'}
                />
              </div>
            );
          })}
        </div>
        <div className="recipe-arrow">→</div>
        <ItemSlot
          itemName={resultItem?.name}
          count={selectedRecipe.craftResultCount}
          variant="result"
        />
      </div>
      <div className="craft-time">1秒</div>
      <div className="craft-controls">
        {isHolding && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <button 
          className="craft-button" 
          onMouseDown={startCrafting}
          onMouseUp={stopCrafting}
          onMouseLeave={stopCrafting}
          onTouchStart={startCrafting}
          onTouchEnd={stopCrafting}
          onTouchCancel={stopCrafting}
          disabled={!canCraft()}
        >
          {isHolding ? 'CRAFTING...' : 'CRAFT'}
        </button>
      </div>
    </div>
  );
}

export default CraftingArea;