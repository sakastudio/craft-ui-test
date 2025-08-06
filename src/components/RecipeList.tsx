import type { CraftRecipe, Item } from './CraftingInterface';
import './RecipeList.css';
import ItemSlot from './ItemSlot';

interface RecipeListProps {
  recipes: CraftRecipe[];
  items: Item[];
  onSelectRecipe: (recipe: CraftRecipe) => void;
  selectedRecipe: CraftRecipe | null;
}

function RecipeList({ recipes, items, onSelectRecipe, selectedRecipe }: RecipeListProps) {
  const getItemById = (itemGuid: string) => {
    return items.find(item => item.itemGuid === itemGuid);
  };

  return (
    <div className="recipe-list">
      <div className="recipe-grid">
        {recipes.map(recipe => {
          const resultItem = getItemById(recipe.craftResultItemGuid);
          if (!resultItem) return null;
          
          return (
            <ItemSlot
              key={recipe.craftRecipeGuid}
              itemName={resultItem.name}
              count={recipe.craftResultCount}
              variant="recipe"
              className={selectedRecipe?.craftRecipeGuid === recipe.craftRecipeGuid ? 'selected' : ''}
              onClick={() => onSelectRecipe(recipe)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default RecipeList;