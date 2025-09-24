
export interface SizeConfig {
  h: number;
  w: number;
  minH: number;
  minW: number;
  maxH: number;
  maxW: number;
}

export interface WidgetConfig {
  widgetInstanceId: string;
  id: string;
  name: string;
  rank: number;
  defaultSize: SizeConfig;
  sizeOverrides?: Partial<Record<'lg' | 'md' | 'sm' | 'xs', Partial<SizeConfig>>>;
  resizeHandles?: string;
  removable?: boolean;
}

export interface SectionConfig {
  sectionId: string;
  name: string;
  type: 'homogenous' | 'heterogenous';
  rank: number;
  isCustomizable: boolean;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  cellHeightPx?: number;
  cellWidthPx?: number;
  widgets: WidgetConfig[];
}

export interface PageConfig {
  pageId: string;
  name: string;
  sections: SectionConfig[];
}

export interface EditControlsProps {
  isEditMode: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  canSave: boolean;
}

export interface WidgetData {
  widgetInstanceId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
