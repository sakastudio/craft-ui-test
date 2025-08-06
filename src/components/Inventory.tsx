import './Inventory.css';
import type {InventoryItem, Item} from "./CraftingInterface.tsx";
import ItemSlot from './ItemSlot';
import ItemList from './ItemList';

interface InventoryProps {
  inventory: InventoryItem[];
  items: Item[];
  onAddItem: (item: Item, count: number) => void;
}

function Inventory({ inventory, items, onAddItem }: InventoryProps) {
  const slots = 36;
  const inventorySlots = Array(slots).fill(null);
  
  inventory.forEach((item, index) => {
    if (index < slots) {
      inventorySlots[index] = item;
    }
  });

  return (
    <div className="inventory-container">
      <div className="inventory-grid">
        {inventorySlots.map((slot, index) => (
          <ItemSlot
            key={index}
            itemName={slot?.item.name}
            count={slot?.count}
            size="medium"
            variant="default"
          />
        ))}
      </div>
      <ItemList items={items} onAddItem={onAddItem} />
    </div>
  );
}

export default Inventory;