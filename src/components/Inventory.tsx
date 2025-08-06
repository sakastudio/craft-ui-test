import './Inventory.css';
import type {InventoryItem} from "./CraftingInterface.tsx";

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

  return (
    <div className="inventory-grid">
      {inventorySlots.map((slot, index) => (
        <div key={index} className="inventory-slot">
          {slot && (
            <>
              <img 
                src={getItemIcon(slot.item.name)} 
                alt={slot.item.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="item-count">{slot.count}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Inventory;