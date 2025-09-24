
import React, { useEffect, useRef } from 'react';
import GridStack from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import 'gridstack/dist/gridstack.min.css';
import { PageConfig, SectionConfig, WidgetData } from './types';
import SectionGrid from './SectionGrid';

interface PageGridProps {
  layout: PageConfig;
  isEditMode: boolean;
  onSaveLayout: (widgetData: WidgetData[], sectionId: string) => void;
}

const PageGrid: React.FC<PageGridProps> = ({ layout, isEditMode, onSaveLayout }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstance = useRef<GridStack | null>(null);

  useEffect(() => {
    if (gridInstance.current) {
      gridInstance.current.destroy();
      gridInstance.current = null;
    }

    if (!layout) return;

    gridInstance.current = GridStack.init({
      float: false,
      resizable: false,
      draggable: false,
      column: 12,
    }, gridRef.current ?? undefined);

    layout.sections.forEach(section => {
      const el = document.createElement('div');
      el.classList.add('grid-stack-item');

      el.setAttribute('gs-x', (section.x ?? 0).toString());
      el.setAttribute('gs-y', (section.y ?? 0).toString());
      el.setAttribute('gs-w', (section.w ?? 6).toString());
      el.setAttribute('gs-h', (section.h ?? 4).toString());

      el.style.position = 'relative';

      const container = document.createElement('div');
      container.id = `section-${section.sectionId}`;
      container.style.width = '100%';
      container.style.height = '100%';

      el.appendChild(container);

      gridInstance.current!.addWidget(el);
    });
  }, [layout]);

  return (
    <div ref={gridRef} className="grid-stack" style={{ minHeight: 800, border: '2px solid #333' }}>
      {layout.sections.map(section => (
        <SectionGrid
          key={section.sectionId}
          section={section}
          isEditMode={isEditMode}
          onSaveWidgets={(widgetData, sectionId) => onSaveLayout(widgetData, sectionId)}
        />
      ))}
    </div>
  );
};

export default PageGrid;
