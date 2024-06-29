import React from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

const InputVisibilityToggle = ({ isTextHidden, onTextHidden, buttonRef }) => {
  return (
    <InputAdornment position="end">
      <IconButton
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTextHidden(!isTextHidden);
        }}
        ref={buttonRef}
      >
        {isTextHidden ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
      </IconButton>
    </InputAdornment>
  );
};

export default InputVisibilityToggle;
