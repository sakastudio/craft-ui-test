import './CraftingArea.css';
import type {CraftRecipe, InventoryItem, Item} from "./CraftingInterface.tsx";
import ItemSlot from './ItemSlot';

interface CraftingAreaProps {
  selectedRecipe: CraftRecipe | null;
  items: Item[];
  inventory: InventoryItem[];
  onCraft: () => void;
  onSelectRecipe: (recipe: CraftRecipe) => void;
  recipes: CraftRecipe[];
}

function CraftingArea({ selectedRecipe, items, inventory, onCraft, onSelectRecipe, recipes }: CraftingAreaProps) {
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