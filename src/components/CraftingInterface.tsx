import { useState, useEffect } from 'react';
import Inventory from './Inventory';
import CraftingArea from './CraftingArea';
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
  const [selectedRecipe, setSelectedRecipe] = useState<CraftRecipe | null>(null);

  useEffect(() => {
    fetch('/mod/master/items.json')
      .then(res => res.json())
      .then(data => {
        setItems(data.data);
        const initialInventory: InventoryItem[] = [];
        setInventory(initialInventory);
      });

    fetch('/mod/master/craftRecipes.json')
      .then(res => res.json())
      .then(data => {
        setRecipes(data.data);
      });
  }, []);

  const handleCraft = () => {
    if (!selectedRecipe) return;

    const hasAllMaterials = selectedRecipe.requiredItems.every(req => {
      const invItem = inventory.find(inv => inv.item.itemGuid === req.itemGuid);
      return invItem && invItem.count >= req.count;
    });

    if (!hasAllMaterials) {
      alert('材料が足りません');
      return;
    }

    const newInventory = [...inventory];
    selectedRecipe.requiredItems.forEach(req => {
      const invItem = newInventory.find(inv => inv.item.itemGuid === req.itemGuid);
      if (invItem) {
        invItem.count -= req.count;
      }
    });

    const resultItem = items.find(item => item.itemGuid === selectedRecipe.craftResultItemGuid);
    if (resultItem) {
      const existingItem = newInventory.find(inv => inv.item.itemGuid === resultItem.itemGuid);
      if (existingItem) {
        existingItem.count += selectedRecipe.craftResultCount;
      } else {
        newInventory.push({ item: resultItem, count: selectedRecipe.craftResultCount });
      }
    }

    setInventory(newInventory.filter(inv => inv.count > 0));
  };

  return (
    <div className="crafting-interface">
      <div className="column inventory-column">
        <h2>持ち物</h2>
        <Inventory inventory={inventory} />
      </div>
      <div className="column crafting-column">
        <h2>木材</h2>
        <CraftingArea 
          selectedRecipe={selectedRecipe}
          items={items}
          inventory={inventory}
          onCraft={handleCraft}
        />
      </div>
      <div className="column recipe-column">
        <h2>CRAFT RECIPE</h2>
        <RecipeList 
          recipes={recipes}
          items={items}
          onSelectRecipe={setSelectedRecipe}
          selectedRecipe={selectedRecipe}
        />
      </div>
    </div>
  );
}

export default CraftingInterface;