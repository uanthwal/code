
import React, { useEffect, useState, useRef } from 'react';
import { PageConfig, WidgetData } from './types';
import { PageHandler } from './pageHandler';
import PageGrid from './PageGrid';
import EditControls from './EditControls';

interface GpfWidgetProps {
  name: string;
  userId: string;
}

const GpfWidget: React.FC<GpfWidgetProps> = ({ name, userId }) => {
  const [layout, setLayout] = useState<PageConfig | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const pageHandler = useRef(new PageHandler(name, userId));

  useEffect(() => {
    setLoading(true);
    pageHandler.current
      .loadPage()
      .then(page => setLayout(page))
      .finally(() => setLoading(false))
      .catch(console.error);
  }, [name]);

  const toggleEditMode = (): void => setIsEditMode(prev => !prev);

  const handleSave = async (widgetsData: WidgetData[], sectionId?: string): Promise<void> => {
    if (!layout) return;

    try {
      await pageHandler.current.saveUserOverrides({
        pageId: layout.pageId,
        sections: layout.sections.map(section => {
          if (sectionId && section.sectionId !== sectionId) return section;
          return {
            sectionId: section.sectionId,
            widgets: widgetsData.filter(w => section.widgets.some(sw => sw.widgetInstanceId === w.widgetInstanceId)),
          };
        }),
      });
      alert('Layout saved!');
      setIsEditMode(false);
    } catch {
      alert('Failed to save layout');
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      <EditControls isEditMode={isEditMode} onToggleEdit={toggleEditMode} canSave={isEditMode} onSave={() => {}} />
      {layout && (
        <PageGrid layout={layout} isEditMode={isEditMode} onSaveLayout={handleSave} />
      )}
    </div>
  );
};

export default GpfWidget;
