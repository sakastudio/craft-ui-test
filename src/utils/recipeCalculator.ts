import type { CraftRecipe, Item } from '../types';

export interface MaterialRequirement {
  itemGuid: string;
  count: number;
}

export interface RecipeCalculationResult {
  rawMaterials: MaterialRequirement[];
  totalItems: number;
  hasCircularDependency: boolean;
}

export class RecipeCalculator {
  private recipes: CraftRecipe[];
  private items: Item[];
  private craftableItemGuids: Set<string>;

  constructor(recipes: CraftRecipe[], items: Item[]) {
    this.recipes = recipes;
    this.items = items;
    this.craftableItemGuids = new Set(recipes.map(recipe => recipe.craftResultItemGuid));
  }

  calculateRawMaterials(recipeGuid: string): RecipeCalculationResult {
    const recipe = this.recipes.find(r => r.craftRecipeGuid === recipeGuid);
    if (!recipe) {
      return {
        rawMaterials: [],
        totalItems: 0,
        hasCircularDependency: false
      };
    }

    const materialMap = new Map<string, number>();
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCircularDep = this.calculateRecursive(
      recipe,
      materialMap,
      visited,
      recursionStack,
      1 // 1つのレシピを作るのに必要な材料
    );

    const rawMaterials: MaterialRequirement[] = Array.from(materialMap.entries())
      .map(([itemGuid, count]) => ({ itemGuid, count }))
      .sort((a, b) => {
        const itemA = this.items.find(item => item.itemGuid === a.itemGuid);
        const itemB = this.items.find(item => item.itemGuid === b.itemGuid);
        return (itemA?.name || a.itemGuid).localeCompare(itemB?.name || b.itemGuid);
      });

    const totalItems = rawMaterials.reduce((total, material) => total + material.count, 0);

    return {
      rawMaterials,
      totalItems,
      hasCircularDependency: hasCircularDep
    };
  }

  private calculateRecursive(
    recipe: CraftRecipe,
    materialMap: Map<string, number>,
    visited: Set<string>,
    recursionStack: Set<string>,
    multiplier: number
  ): boolean {
    if (recursionStack.has(recipe.craftRecipeGuid)) {
      return true; // 循環参照を検出
    }

    recursionStack.add(recipe.craftRecipeGuid);
    visited.add(recipe.craftRecipeGuid);

    for (const requirement of recipe.requiredItems) {
      // isRemainがtrueの場合は消費されないのでスキップ
      if (requirement.isRemain) {
        continue;
      }

      const requiredCount = requirement.count * multiplier;

      // このアイテムがクラフト可能かチェック
      const itemRecipe = this.recipes.find(r => r.craftResultItemGuid === requirement.itemGuid);
      
      if (itemRecipe && this.craftableItemGuids.has(requirement.itemGuid)) {
        // クラフト可能なアイテムの場合、再帰的に計算
        const recipeMultiplier = Math.ceil(requiredCount / itemRecipe.craftResultCount);
        const circularDep = this.calculateRecursive(
          itemRecipe,
          materialMap,
          visited,
          recursionStack,
          recipeMultiplier
        );
        
        if (circularDep) {
          recursionStack.delete(recipe.craftRecipeGuid);
          return true;
        }
      } else {
        // 基本素材の場合、マップに追加
        const currentCount = materialMap.get(requirement.itemGuid) || 0;
        materialMap.set(requirement.itemGuid, currentCount + requiredCount);
      }
    }

    recursionStack.delete(recipe.craftRecipeGuid);
    return false;
  }

  getItemName(itemGuid: string): string {
    const item = this.items.find(item => item.itemGuid === itemGuid);
    return item?.name || itemGuid;
  }
}