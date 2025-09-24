
import React, { useEffect, useState, useRef } from 'react';
import GridstackWrapper from './GridstackWrapper';
import EditControls from './EditControls';
import { PageConfig, WidgetData } from './types';
import { PageHandler } from './pageHandler';

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
    pageHandler.current.loadPage()
      .then(page => setLayout(page))
      .finally(() => setLoading(false))
      .catch(console.error);
  }, [name]);

  const toggleEditMode = () => setIsEditMode(prev => !prev);

  const handleSave = async (widgetsData: WidgetData[]) => {
    if (!layout) return;
    try {
      await pageHandler.current.saveUserOverrides({
        pageId: layout.pageId,
        sections: layout.sections.map(section => ({
          sectionId: section.sectionId,
          widgets: widgetsData.filter(w =>
            section.widgets.some(sw => sw.widgetInstanceId === w.widgetInstanceId)
          )
        }))
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
      <EditControls isEditMode={isEditMode} onToggleEdit={toggleEditMode} canSave={isEditMode} />
      {layout && <GridstackWrapper layout={layout} isEditMode={isEditMode} onSaveLayout={handleSave} />}
    </div>
  );
};

export default GpfWidget;
