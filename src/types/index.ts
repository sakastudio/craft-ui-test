export interface Item {
  itemGuid: string;
  name: string;
  maxStack: number;
  iconPath?: string;
  initialUnlocked?: boolean;
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
  initialUnlocked?: boolean;
}