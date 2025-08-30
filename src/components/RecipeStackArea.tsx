import './RecipeStackArea.css';
import type {CraftRecipe, InventoryItem, Item} from "./CraftingInterface.tsx";
import StackedRecipeItem from './StackedRecipeItem';

interface RecipeStackAreaProps {
  recipeStack: CraftRecipe[];
  items: Item[];
  inventory: InventoryItem[];
  onCraft: (recipe: CraftRecipe) => void;
  onSelectRecipe: (recipe: CraftRecipe) => void;
  onSelectRecipeFromMaterial: (recipe: CraftRecipe, insertAfterIndex: number) => void;
  onRemoveFromStack: (index: number) => void;
  recipes: CraftRecipe[];
}

function RecipeStackArea({ 
  recipeStack, 
  items, 
  inventory, 
  onCraft, 
  onSelectRecipe,
  onSelectRecipeFromMaterial,
  onRemoveFromStack,
  recipes
}: RecipeStackAreaProps) {
  
  if (recipeStack.length === 0) {
    return (
      <div className="recipe-stack-area">
        <div className="stack-placeholder">
          <div className="placeholder-icon">📋</div>
          <div className="placeholder-text">
            レシピを選択してスタックに追加してください
          </div>
          <div className="placeholder-subtext">
            左のレシピリストからクラフトしたいレシピをクリック
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-stack-area">
      <div className="stack-header">
        <h3>クラフトスタック ({recipeStack.length})</h3>
        <button 
          className="clear-stack-button"
          onClick={() => {
            // Clear all items from stack
            for (let i = recipeStack.length - 1; i >= 0; i--) {
              onRemoveFromStack(i);
            }
          }}
          title="スタックをクリア"
        >
          全削除
        </button>
      </div>
      
      <div className="recipe-stack">
        {recipeStack.map((recipe, index) => (
          <StackedRecipeItem
            key={`${recipe.craftRecipeGuid}-${index}`}
            recipe={recipe}
            items={items}
            inventory={inventory}
            onCraft={onCraft}
            onSelectRecipe={onSelectRecipe}
            onSelectRecipeFromMaterial={onSelectRecipeFromMaterial}
            recipes={recipes}
            onRemove={() => onRemoveFromStack(index)}
            stackIndex={index}
          />
        ))}
      </div>
      
      <div className="stack-footer">
        <div className="stack-info">
          スタック内のレシピは個別にクラフト可能です
        </div>
      </div>
    </div>
  );
}

export default RecipeStackArea;