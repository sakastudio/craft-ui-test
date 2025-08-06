import React from 'react';
import './ItemSlot.css';

interface ItemSlotProps {
  itemName?: string;
  count?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'insufficient' | 'result' | 'recipe';
  onClick?: () => void;
  className?: string;
}

const ItemSlot: React.FC<ItemSlotProps> = ({
  itemName,
  count,
  size = 'medium',
  variant = 'default',
  onClick,
  className = ''
}) => {
  const getItemIcon = (name: string) => {
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
    return `/mod/assets/item/${iconMap[name] || 'default.png'}`;
  };

  return (
    <div 
      className={`item-slot item-slot--${size} item-slot--${variant} ${className}`}
      onClick={onClick}
    >
      {itemName && (
        <>
          <img 
            src={getItemIcon(itemName)} 
            alt={itemName}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {count !== undefined && count > 0 && (
            <span className="item-slot__count">{count}</span>
          )}
        </>
      )}
    </div>
  );
};

export default ItemSlot;