import { useState, useEffect } from 'react';
import Inventory from './Inventory';
import RecipeStackArea from './RecipeStackArea';
import RecipeList from './RecipeList';
import './CraftingInterface.css';

export interface Item {
  itemGuid: string;
  name: string;
  maxStack: number;
  iconPath?: string;
}

export interface InventoryItem {
  item: Item;
  count: number;
}

export interface CraftRecipe {
  craftRecipeGuid: string;
  craftResultItemGuid: string;
  craftResultCount: number;
  requiredItems: { itemGuid: string; count: number; }[];
  craftTime: number;
}

function CraftingInterface() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [recipes, setRecipes] = useState<CraftRecipe[]>([]);
  const [recipeStack, setRecipeStack] = useState<CraftRecipe[]>([]);

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL;
    
    fetch(`${basePath}mod/master/items.json`)
      .then(res => res.json())
      .then(data => {
        setItems(data.data);
        const initialInventory: InventoryItem[] = [];
        setInventory(initialInventory);
      })
      .catch(err => console.error('Failed to load items:', err));

    fetch(`${basePath}mod/master/craftRecipes.json`)
      .then(res => res.json())
      .then(data => {
        setRecipes(data.data);
      })
      .catch(err => console.error('Failed to load recipes:', err));
  }, []);

  const handleAddItem = (item: Item, count: number) => {
    const newInventory = [...inventory];
    const existingItem = newInventory.find(inv => inv.item.itemGuid === item.itemGuid);
    
    if (existingItem) {
      existingItem.count = Math.min(existingItem.count + count, item.maxStack);
    } else {
      newInventory.push({ item, count: Math.min(count, item.maxStack) });
    }
    
    setInventory(newInventory);
  };

  const handleAddToStack = (recipe: CraftRecipe) => {
    setRecipeStack(prev => [...prev, recipe]);
  };

  const handleAddToStackAtPosition = (recipe: CraftRecipe, insertAfterIndex: number) => {
    setRecipeStack(prev => {
      const newStack = [...prev];
      newStack.splice(insertAfterIndex + 1, 0, recipe);
      return newStack;
    });
  };

  const handleRemoveFromStack = (index: number) => {
    setRecipeStack(prev => prev.filter((_, i) => i !== index));
  };

  const handleCraft = (recipe: CraftRecipe) => {
    if (!recipe) return;

    const hasAllMaterials = recipe.requiredItems.every(req => {
      const invItem = inventory.find(inv => inv.item.itemGuid === req.itemGuid);
      return invItem && invItem.count >= req.count;
    });

    if (!hasAllMaterials) {
      alert('材料が足りません');
      return;
    }

    const newInventory = [...inventory];
    recipe.requiredItems.forEach(req => {
      const invItem = newInventory.find(inv => inv.item.itemGuid === req.itemGuid);
      if (invItem) {
        invItem.count -= req.count;
      }
    });

    const resultItem = items.find(item => item.itemGuid === recipe.craftResultItemGuid);
    if (resultItem) {
      const existingItem = newInventory.find(inv => inv.item.itemGuid === resultItem.itemGuid);
      if (existingItem) {
        existingItem.count += recipe.craftResultCount;
      } else {
        newInventory.push({ item: resultItem, count: recipe.craftResultCount });
      }
    }

    setInventory(newInventory.filter(inv => inv.count > 0));
  };

  return (
    <div className="crafting-interface">
      <div className="column inventory-column">
        <h2>持ち物</h2>
        <Inventory inventory={inventory} items={items} onAddItem={handleAddItem} />
      </div>
      <div className="column crafting-column">
        <h2>クラフト</h2>
        <RecipeStackArea 
          recipeStack={recipeStack}
          items={items}
          inventory={inventory}
          onCraft={handleCraft}
          onSelectRecipe={handleAddToStack}
          onSelectRecipeFromMaterial={handleAddToStackAtPosition}
          onRemoveFromStack={handleRemoveFromStack}
          recipes={recipes}
        />
      </div>
      <div className="column recipe-column">
        <h2>CRAFT RECIPE</h2>
        <RecipeList 
          recipes={recipes}
          items={items}
          onSelectRecipe={handleAddToStack}
          selectedRecipe={null}
        />
      </div>
    </div>
  );
}

export default CraftingInterface;