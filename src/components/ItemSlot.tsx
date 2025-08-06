import React, { useState } from 'react';
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const getItemIcon = (name: string) => {
    return `/mod/assets/item/${name + '.png'}`;
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (itemName) {
      setShowTooltip(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (showTooltip && itemName) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  return (
    <>
      <div 
        className={`item-slot item-slot--${size} item-slot--${variant} ${className}`}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {itemName && (
          <>
            <img 
              src={getItemIcon(itemName)} 
              alt={itemName}
            />
            {count !== undefined && count > 0 && (
              <span className="item-slot__count">{count}</span>
            )}
          </>
        )}
      </div>
      {showTooltip && itemName && (
        <div 
          className="item-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {itemName}
        </div>
      )}
    </>
  );
};

export default ItemSlot;