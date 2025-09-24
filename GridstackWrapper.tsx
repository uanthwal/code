
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import GridStack from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import 'gridstack/dist/gridstack.min.css';
import { GridstackWrapperProps, WidgetConfig, WidgetData } from './types';
import WidgetEditOverlay from './WidgetEditOverlay';

type WidgetElement = {
  el: HTMLElement;
  widget: WidgetConfig;
  isSectionCustomizable: boolean;
};

const GridstackWrapper = forwardRef<HTMLDivElement, GridstackWrapperProps>(
  ({ layout, isEditMode, onSaveLayout }, ref) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const gridInstance = useRef<GridStack | null>(null);
    const [widgetElements, setWidgetElements] = useState<Record<string, WidgetElement>>({});

    useImperativeHandle(ref, () => ({
      saveLayout: () => {
        if (!gridInstance.current) return;

        const widgetsData: WidgetData[] = [];
        gridInstance.current.engine.nodes.forEach(node => {
          const el = node.el as HTMLElement;
          const widgetId = el.getAttribute('data-widget-instance-id');
          if (!widgetId) return;
          widgetsData.push({
            widgetInstanceId: widgetId,
            x: node.x,
            y: node.y,
            w: node.w,
            h: node.h,
          });
        });

        onSaveLayout(widgetsData);
      },
    }));

    useEffect(() => {
      if (!layout) return;

      if (gridInstance.current) {
        gridInstance.current.destroy();
        setWidgetElements({});
        gridInstance.current = null;
      }

      gridInstance.current = GridStack.init(
        {
          float: true,
          resizable: true,
          draggable: false,
          handle: '.grid-stack-item-content',
        },
        gridRef.current ?? undefined
      );

      const els: Record<string, WidgetElement> = {};

      layout.sections.forEach(section => {
        const isCustomizable = section.isCustomizable;

        section.widgets.forEach(widget => {
          if (widget.removable === false) return;

          const el = document.createElement('div');
          el.classList.add('grid-stack-item');

          el.setAttribute('gs-x', (widget.x ?? 0).toString());
          el.setAttribute('gs-y', (widget.y ?? 0).toString());
          el.setAttribute('gs-w', (widget.w ?? 1).toString());
          el.setAttribute('gs-h', (widget.h ?? 1).toString());
          el.setAttribute('data-widget-instance-id', widget.widgetInstanceId);
          el.style.position = 'relative';

          const content = document.createElement('div');
          content.classList.add('grid-stack-item-content');
          content.innerHTML = `<strong>${widget.name}</strong><br>Type: ${
            widget.id ?? 'generic'
          }`;
          el.appendChild(content);

          gridInstance.current!.addWidget(el);

          els[widget.widgetInstanceId] = { el, widget, isSectionCustomizable: isCustomizable };

          toggleWidgetInteractivity(gridInstance.current!, el, isEditMode, isCustomizable, widget.resizeHandles);
        });
      });

      setWidgetElements(els);
    }, [layout]);

    useEffect(() => {
      if (!gridInstance.current || !layout) return;
      Object.values(widgetElements).forEach(({ el, widget, isSectionCustomizable }) => {
        toggleWidgetInteractivity(gridInstance.current!, el, isEditMode, isSectionCustomizable, widget.resizeHandles);
      });
    }, [isEditMode, widgetElements]);

    const toggleWidgetInteractivity = (
      grid: GridStack,
      el: HTMLElement,
      editMode: boolean,
      customizable: boolean,
      resizeHandles?: string
    ): void => {
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
    };

    // For deletion
    const handleDelete = (widgetInstanceId: string): void => {
      if (!window.confirm('Remove this widget?')) return;
      // You may want to emit an event or call a prop to update parent state which removes widget logically
      alert('Delete widget functionality to implement in parent component: ' + widgetInstanceId);
    };

    return (
      <div style={{ position: 'relative' }}>
        <div
          ref={gridRef}
          className="grid-stack"
          style={{ minHeight: 400, border: '1px solid #ccc' }}
        ></div>
        {Object.values(widgetElements).map(({ el, widget, isSectionCustomizable }) => {
          if (!isEditMode || !isSectionCustomizable) return null;
          const rect = el.getBoundingClientRect();
          const containerRect = gridRef.current?.getBoundingClientRect();
          if (!containerRect) return null;

          const style: React.CSSProperties = {
            position: 'absolute',
            top: rect.top - containerRect.top + (gridRef.current?.scrollTop ?? 0),
            left: rect.left - containerRect.left + (gridRef.current?.scrollLeft ?? 0),
            width: rect.width,
            height: rect.height,
            pointerEvents: 'none',
            zIndex: 9999,
          };

          return (
            <div key={widget.widgetInstanceId} style={style}>
              <WidgetEditOverlay
                resizeHandles={widget.resizeHandles}
                draggable
                removable={widget.removable}
                onDelete={() => handleDelete(widget.widgetInstanceId)}
              />
            </div>
          );
        })}
      </div>
    );
  }
);

export default GridstackWrapper;
