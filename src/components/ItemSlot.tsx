import React, { useState } from 'react';
import './ItemSlot.css';
import { getItemIcon } from '../utils/assetPath';
import type { MaterialRequirement } from '../utils/recipeCalculator';

interface ItemSlotProps {
  itemName?: string;
  count?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'insufficient' | 'result' | 'recipe';
  onClick?: () => void;
  className?: string;
  rawMaterials?: MaterialRequirement[];
  getItemName?: (itemGuid: string) => string;
}

const ItemSlot: React.FC<ItemSlotProps> = ({
  itemName,
  count,
  size = 'medium',
  variant = 'default',
  onClick,
  className = '',
  rawMaterials,
  getItemName
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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
          <div className="tooltip-title">{itemName}</div>
          {rawMaterials && rawMaterials.length > 0 && (
            <div className="tooltip-materials">
              <div className="tooltip-materials-title">原材料トータル:</div>
              <div className="tooltip-materials-list">
                {rawMaterials.map((material, index) => (
                  <div key={index} className="tooltip-material-item">
                    {getItemName ? getItemName(material.itemGuid) : material.itemGuid} × {material.count}
                  </div>
                ))}
              </div>
              <div className="tooltip-total">
                合計: {rawMaterials.reduce((total, material) => total + material.count, 0)}個
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ItemSlot;