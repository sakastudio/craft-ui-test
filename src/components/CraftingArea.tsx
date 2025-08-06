import './CraftingArea.css';
import type {CraftRecipe, InventoryItem, Item} from "./CraftingInterface.tsx";

interface CraftingAreaProps {
  selectedRecipe: CraftRecipe | null;
  items: Item[];
  inventory: InventoryItem[];
  onCraft: () => void;
}

function CraftingArea({ selectedRecipe, items, inventory, onCraft }: CraftingAreaProps) {
  const getItemIcon = (itemName: string) => {
    const iconMap: { [key: string]: string } = {
      '小石': '小石.png',
      '石器': '石器.png',
      '木の枝': '木の枝.png',
      '麻': '麻.png',
      '麻縄': '麻縄.png',
      '石の斧': '石の斧.png',
      '石のツルハシ': '石のツルハシ.png',
      '原木': '原木.png',
      '木材': '木材.png',
      '砂': '砂.png',
      '石炭': '石炭.png',
      '鉄鉱石': '鉄鉱石.png',
    };
    return `/mod/assets/item/${iconMap[itemName] || 'default.png'}`;
  };

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

  if (!selectedRecipe) {
    return (
      <div className="crafting-area">
        <div className="recipe-display">
          <div className="recipe-placeholder">
            レシピを選択してください
          </div>
        </div>
        <button className="craft-button" disabled>
          CRAFT
        </button>
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
              <div key={index} className={`material-slot ${!hasEnough ? 'insufficient' : ''}`}>
                {item && (
                  <>
                    <img 
                      src={getItemIcon(item.name)} 
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="material-count">{req.count}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="recipe-arrow">→</div>
        <div className="recipe-result">
          {resultItem && (
            <>
              <img 
                src={getItemIcon(resultItem.name)} 
                alt={resultItem.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="result-count">{selectedRecipe.craftResultCount}</span>
            </>
          )}
        </div>
      </div>
      <div className="craft-time">1秒</div>
      <button 
        className="craft-button" 
        onClick={onCraft}
        disabled={!canCraft()}
      >
        CRAFT
      </button>
    </div>
  );
}

export default CraftingArea;