
import React from 'react';
import { EditControlsProps } from './types';

const EditControls: React.FC<EditControlsProps> = ({ isEditMode, onToggleEdit, onSave, canSave }) => (
  <div style={{ marginBottom: 8 }}>
    <button onClick={onToggleEdit}>
      {isEditMode ? 'Exit Edit Mode' : 'Edit Layout'}
    </button>
    {canSave && (
      <button onClick={onSave} style={{ marginLeft: 10 }}>
        Save My Layout
      </button>
    )}
  </div>
);

export default EditControls;
