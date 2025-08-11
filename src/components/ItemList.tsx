import { useState } from 'react';
import type { Item } from './CraftingInterface';
import ItemSlot from './ItemSlot';
import './ItemList.css';

interface ItemListProps {
  items: Item[];
  onAddItem: (item: Item, count: number) => void;
}

function ItemList({ items, onAddItem }: ItemListProps) {
  const [quantity, setQuantity] = useState(20);

  const handleItemClick = (item: Item) => {
    onAddItem(item, quantity);
  };

  return (
    <div className="item-list-container">
      <div className="quantity-control">
        <label htmlFor="quantity">追加個数: </label>
        <input
          id="quantity"
          type="number"
          min="1"
          max="999"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
        />
      </div>
      <div className="item-list-grid">
        {items.map((item) => (
          <div
            key={item.itemGuid}
            onClick={() => handleItemClick(item)}
            title={`${item.name} (最大スタック: ${item.maxStack})`}
          >
            <ItemSlot
              itemName={item.name}
              count={1}
              size="medium"
              variant="default"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemList;