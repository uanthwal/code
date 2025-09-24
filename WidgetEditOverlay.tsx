
import React from 'react';
import './WidgetEditOverlay.css';

const directions = {
  n: { style: { top: 0, left: '50%', transform: 'translate(-50%,-50%)' }, icon: '●' },
  s: { style: { bottom: 0, left: '50%', transform: 'translate(-50%,50%)' }, icon: '●' },
  e: { style: { right: 0, top: '50%', transform: 'translate(50%,-50%)' }, icon: '●' },
  w: { style: { left: 0, top: '50%', transform: 'translate(-50%,-50%)' }, icon: '●' },
  ne: { style: { top: 0, right: 0 }, icon: '●' },
  nw: { style: { top: 0, left: 0 }, icon: '●' },
  se: { style: { bottom: 0, right: 0 }, icon: '●' },
  sw: { style: { bottom: 0, left: 0 }, icon: '●' },
};

interface WidgetEditOverlayProps {
  resizeHandles?: string;
  draggable?: boolean;
  removable?: boolean;
  onDelete?: () => void;
}

const WidgetEditOverlay: React.FC<WidgetEditOverlayProps> = ({ resizeHandles = '', draggable = false, removable = false, onDelete }) => {
  const handlesArr = resizeHandles.split(',').map(h => h.trim()).filter(Boolean);

  return (
    <div className="widget-edit-overlay">
      {handlesArr.map(dir =>
        directions[dir] ? (
          <span
            key={dir}
            className={`resize-handle-indicator resize-${dir}`}
            style={directions[dir].style}
          >
            {directions[dir].icon}
          </span>
        ) : null
      )}
      {draggable && (
        <div className="drag-handle-indicator" title="Drag to move">
          <span>↕️↔️</span>
        </div>
      )}
      {removable && (
        <button className="remove-widget-button" onClick={onDelete} title="Remove Widget">
          🗑️
        </button>
      )}
    </div>
  );
};

export default WidgetEditOverlay;
