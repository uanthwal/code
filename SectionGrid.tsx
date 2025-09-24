
import React, { useEffect, useRef, useState } from 'react';
import GridStack from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import 'gridstack/dist/gridstack.min.css';
import { SectionConfig, WidgetConfig, WidgetData } from './types';
import WidgetEditOverlay from './WidgetEditOverlay';

interface SectionGridProps {
  section: SectionConfig;
  isEditMode: boolean;
  onSaveWidgets: (widgetsData: WidgetData[], sectionId: string) => void;
}

const SectionGrid: React.FC<SectionGridProps> = ({ section, isEditMode, onSaveWidgets }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstance = useRef<GridStack | null>(null);
  const [widgetElements, setWidgetElements] = useState<Record<string, HTMLElement>>({});

  useEffect(() => {
    if (gridInstance.current) {
      gridInstance.current.destroy();
      setWidgetElements({});
      gridInstance.current = null;
    }
    if (!section) return;

    gridInstance.current = GridStack.init({
      float: true,
      resizable: true,
      draggable: false,
      handle: '.grid-stack-item-content',
      cellHeight: section.cellHeightPx ?? 100,
      column: 12,
    }, gridRef.current ?? undefined);

    const els: Record<string, HTMLElement> = {};

    section.widgets.forEach(widget => {
      if (widget.removable === false) return;

      const el = document.createElement('div');
      el.classList.add('grid-stack-item');

      el.setAttribute('gs-x', (widget.x ?? 0).toString());
      el.setAttribute('gs-y', (widget.y ?? 0).toString());
      el.setAttribute('gs-w', (widget.w ?? 1).toString());
      el.setAttribute('gs-h', (widget.h ?? 1).toString());
      el.setAttribute('data-widget-instance-id', widget.widgetInstanceId);

      const content = document.createElement('div');
      content.classList.add('grid-stack-item-content');
      content.innerHTML = `<strong>${widget.name}</strong>`;
      el.appendChild(content);

      gridInstance.current!.addWidget(el);

      els[widget.widgetInstanceId] = el;

      toggleWidgetInteractivity(gridInstance.current!, el, isEditMode, section.isCustomizable, widget.resizeHandles);
    });

    setWidgetElements(els);
  }, [section, isEditMode]);

  const saveLayout = () => {
    if (!gridInstance.current) return;

    const widgetsData: WidgetData[] = [];
    gridInstance.current.engine.nodes.forEach(node => {
      const el = node.el as HTMLElement;
      const widgetInstanceId = el.getAttribute('data-widget-instance-id');
      if (!widgetInstanceId) return;
      widgetsData.push({
        widgetInstanceId,
        x: node.x,
        y: node.y,
        w: node.w,
        h: node.h,
      });
    });
    onSaveWidgets(widgetsData, section.sectionId);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 8, height: '100%' }}>
      <h4>{section.name}</h4>
      <div ref={gridRef} className="grid-stack" style={{ minHeight: 150, height: 'calc(100% - 30px)' }}></div>
      {isEditMode && section.isCustomizable && (
        <button onClick={saveLayout}>Save Section Layout</button>
      )}
    </div>
  );
};

function toggleWidgetInteractivity(
  grid: GridStack,
  el: HTMLElement,
  editMode: boolean,
  customizable: boolean,
  resizeHandles?: string
) {
  if (editMode && customizable) {
    grid.enableMove(el, true);
    if (resizeHandles) {
      grid.makeResizable(el, { handles: resizeHandles });
    } else {
      grid.makeResizable(el, { handles: '' });
    }
  } else {
    grid.enableMove(el, false);
    grid.makeResizable(el, { handles: '' });
  }
}

export default SectionGrid;
