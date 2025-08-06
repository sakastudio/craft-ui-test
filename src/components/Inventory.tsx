import './Inventory.css';
import type {InventoryItem} from "./CraftingInterface.tsx";
import ItemSlot from './ItemSlot';

interface InventoryProps {
  inventory: InventoryItem[];
}

function Inventory({ inventory }: InventoryProps) {
  const slots = 36;
  const inventorySlots = Array(slots).fill(null);
  
  inventory.forEach((item, index) => {
    if (index < slots) {
      inventorySlots[index] = item;
    }
  });

  return (
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
  );
}

export default Inventory;