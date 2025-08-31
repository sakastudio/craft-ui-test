import './StackedRecipeItem.css';
import type {CraftRecipe, InventoryItem, Item} from "../types";
import ItemSlot from './ItemSlot';
import { useState, useEffect, useRef, useMemo } from 'react';
import { RecipeCalculator } from '../utils/recipeCalculator';

interface StackedRecipeItemProps {
  recipe: CraftRecipe;
  items: Item[];
  inventory: InventoryItem[];
  onCraft: (recipe: CraftRecipe) => void;
  onSelectRecipe: (recipe: CraftRecipe) => void;
  onSelectRecipeFromMaterial: (recipe: CraftRecipe, insertAfterIndex: number) => void;
  recipes: CraftRecipe[];
  onRemove: () => void;
  stackIndex: number;
}

function StackedRecipeItem({ 
  recipe, 
  items, 
  inventory, 
  onCraft, 
  onSelectRecipe: _onSelectRecipe, 
  onSelectRecipeFromMaterial,
  recipes,
  onRemove,
  stackIndex
}: StackedRecipeItemProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const CRAFT_DURATION = 1000;
  const PROGRESS_UPDATE_INTERVAL = 10;

  const getItemById = (itemGuid: string) => {
    return items.find(item => item.itemGuid === itemGuid);
  };

  const calculator = useMemo(() => {
    return new RecipeCalculator(recipes, items);
  }, [recipes, items]);

  const canCraft = () => {
    if (!recipe) return false;
    return recipe.requiredItems.every(req => {
      const invItem = inventory.find(inv => inv.item.itemGuid === req.itemGuid);
      return invItem && invItem.count >= req.count;
    });
  };

  const handleMaterialClick = (itemGuid: string) => {
    const recipeForItem = recipes.find(r => r.craftResultItemGuid === itemGuid);
    if (recipeForItem) {
      onSelectRecipeFromMaterial(recipeForItem, stackIndex);
    }
  };

  const startCrafting = () => {
    if (!canCraft()) return;
    
    setIsHolding(true);
    setProgress(0);
    
    let elapsed = 0;
    progressIntervalRef.current = setInterval(() => {
      elapsed += PROGRESS_UPDATE_INTERVAL;
      const newProgress = Math.min((elapsed / CRAFT_DURATION) * 100, 100);
      setProgress(newProgress);
    }, PROGRESS_UPDATE_INTERVAL);
    
    holdTimerRef.current = setTimeout(() => {
      onCraft(recipe);
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

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const resultItem = getItemById(recipe.craftResultItemGuid);
  const recipeCalculation = calculator.calculateRawMaterials(recipe.craftRecipeGuid);

  return (
    <div className="stacked-recipe-item">
      <div className="recipe-header">
        <span className="recipe-title">{resultItem?.name}</span>
        <button className="remove-button" onClick={onRemove} title="スタックから削除">
          ×
        </button>
      </div>
      
      <div className="recipe-content">
        <div className="recipe-materials">
          {recipe.requiredItems.map((req, index) => {
            const item = getItemById(req.itemGuid);
            const invItem = inventory.find(inv => inv.item.itemGuid === req.itemGuid);
            const hasEnough = invItem && invItem.count >= req.count;
            
            // その材料アイテムのレシピがある場合、原材料を計算
            const materialRecipe = recipes.find(r => r.craftResultItemGuid === req.itemGuid);
            const materialCalculation = materialRecipe ? 
              calculator.calculateRawMaterials(materialRecipe.craftRecipeGuid) : 
              null;
            
            return (
              <div 
                key={index} 
                onClick={() => handleMaterialClick(req.itemGuid)}
                className="material-slot"
              >
                <ItemSlot
                  itemName={item?.name}
                  count={req.count}
                  size="medium"
                  variant={hasEnough ? 'default' : 'insufficient'}
                  rawMaterials={materialCalculation?.rawMaterials}
                  getItemName={(itemGuid) => calculator.getItemName(itemGuid)}
                />
              </div>
            );
          })}
        </div>
        
        <div className="recipe-arrow">→</div>
        
        <div className="recipe-result">
          <ItemSlot
            itemName={resultItem?.name}
            count={recipe.craftResultCount}
            variant="result"
            size="medium"
            rawMaterials={recipeCalculation.rawMaterials}
            getItemName={(itemGuid) => calculator.getItemName(itemGuid)}
          />
        </div>
      </div>

      {recipeCalculation.rawMaterials.length > 0 && (
        <div className="raw-materials-section">
          <div className="raw-materials-header">原材料</div>
          <div className="raw-materials-list">
            {recipeCalculation.rawMaterials.map((material, index) => {
              const item = getItemById(material.itemGuid);
              return (
                <div key={index} className="raw-material-item">
                  <ItemSlot
                    itemName={item?.name}
                    count={material.count}
                    size="small"
                    variant="default"
                    getItemName={(itemGuid) => calculator.getItemName(itemGuid)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      
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
          className={`craft-button ${canCraft() ? 'craftable' : 'disabled'}`}
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

export default StackedRecipeItem;