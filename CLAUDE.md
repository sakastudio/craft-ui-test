# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

### 基本コマンド
- `npm run dev` - 開発サーバーを起動（Vite）
- `npm run build` - TypeScriptのチェックとビルドを実行
- `npm run lint` - ESLintでコードをチェック
- `npm run preview` - ビルド後のアプリケーションをプレビュー

### 重要な注意事項
**実装終了後は必ず `npm run build` を実行してビルドが成功することを確認すること**

## プロジェクト構造とアーキテクチャ

このプロジェクトは、ゲーム内のインベントリとクラフティングシステムを実装したReact + TypeScript + Viteアプリケーションです。

### 主要コンポーネント

1. **CraftingInterface** (`src/components/CraftingInterface.tsx`)
   - メインコンポーネント
   - アイテムとレシピデータを`/mod/master/`からフェッチ
   - インベントリ、クラフティング、レシピリストの3つのセクションを管理

2. **Inventory** (`src/components/Inventory.tsx`)
   - アイテムインベントリの表示と管理
   - アイテムの追加機能

3. **CraftingArea** (`src/components/CraftingArea.tsx`)
   - クラフティングUIの実装
   - 選択されたレシピの表示とクラフト実行

4. **RecipeList** (`src/components/RecipeList.tsx`)
   - 利用可能なレシピの一覧表示
   - レシピ選択機能

5. **ItemList** (`src/components/ItemList.tsx`)
   - アイテム一覧の表示
   - アンロック状態の管理

6. **ItemSlot** (`src/components/ItemSlot.tsx`)
   - 個別アイテムスロットの表示コンポーネント

### データ構造

主要な型定義は`src/types/index.ts`に定義：
- `Item`: アイテムの基本情報
- `InventoryItem`: インベントリ内のアイテム（個数含む）
- `CraftRecipe`: クラフトレシピ情報

### アセット構成

- `/public/mod/master/`: ゲームデータJSON
  - `items.json`: アイテム定義
  - `craftRecipes.json`: クラフトレシピ定義
  - その他のゲームデータ
- `/public/mod/assets/`: 画像アセット
  - `item/`: アイテムアイコン画像
  - `block/`: ブロック3Dモデル（.glb）

### アセットパス処理

`src/utils/assetPath.ts`でアイテムアイコンのパスを生成。アイコンが存在しない場合はデフォルト画像を使用。

### スタイリング

各コンポーネントには対応するCSSファイルが存在（例: `ItemList.tsx` → `ItemList.css`）