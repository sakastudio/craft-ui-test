import type { CraftRecipe, Item } from '../types';
import './RecipeList.css';
import ItemSlot from './ItemSlot';
import { RecipeCalculator } from '../utils/recipeCalculator';
import { useMemo } from 'react';

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

  const calculator = useMemo(() => {
    return new RecipeCalculator(recipes, items);
  }, [recipes, items]);

  return (
    <div className="recipe-list">
      <div className="recipe-grid">
        {recipes.map(recipe => {
          const resultItem = getItemById(recipe.craftResultItemGuid);
          if (!resultItem) return null;
          
          const calculationResult = calculator.calculateRawMaterials(recipe.craftRecipeGuid);
          
          return (
            <ItemSlot
              key={recipe.craftRecipeGuid}
              itemName={resultItem.name}
              count={recipe.craftResultCount}
              variant="recipe"
              className={selectedRecipe?.craftRecipeGuid === recipe.craftRecipeGuid ? 'selected' : ''}
              onClick={() => onSelectRecipe(recipe)}
              rawMaterials={calculationResult.rawMaterials}
              getItemName={(itemGuid) => calculator.getItemName(itemGuid)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default RecipeList;