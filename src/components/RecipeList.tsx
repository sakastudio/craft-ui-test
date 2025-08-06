import type { CraftRecipe, Item } from './CraftingInterface';
import './RecipeList.css';

interface RecipeListProps {
  recipes: CraftRecipe[];
  items: Item[];
  onSelectRecipe: (recipe: CraftRecipe) => void;
  selectedRecipe: CraftRecipe | null;
}

function RecipeList({ recipes, items, onSelectRecipe, selectedRecipe }: RecipeListProps) {
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

  return (
    <div className="recipe-list">
      <div className="recipe-grid">
        {recipes.map(recipe => {
          const resultItem = getItemById(recipe.craftResultItemGuid);
          if (!resultItem) return null;
          
          return (
            <div 
              key={recipe.craftRecipeGuid}
              className={`recipe-item ${selectedRecipe?.craftRecipeGuid === recipe.craftRecipeGuid ? 'selected' : ''}`}
              onClick={() => onSelectRecipe(recipe)}
            >
              <img 
                src={getItemIcon(resultItem.name)} 
                alt={resultItem.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="recipe-count">{recipe.craftResultCount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecipeList;