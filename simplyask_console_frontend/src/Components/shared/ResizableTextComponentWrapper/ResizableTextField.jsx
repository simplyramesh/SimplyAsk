import React, { useState } from 'react';
import { StyledFlex } from '../styles/styled';

const ResizableTextField = ({ children,
  enableVerticalResize,
  enableHorizontalResize,
  minHeight,
  minWidth
}) => {
  const [height, setHeight] = useState(minHeight || 'auto');
  const [width, setWidth] = useState(minWidth || 'auto');

  const handleResize = (e) => {
    if (enableVerticalResize) {
      setHeight(e.target.offsetHeight);
    }
    if (enableHorizontalResize) {
      setWidth(e.target.offsetWidth);
    }
  };

  const isVerticalOrHorizontalResizeEnable = enableVerticalResize ? 'vertical' :
    enableHorizontalResize ? 'horizontal' : 'none';

  const resizableStyle = {
    width: enableHorizontalResize ? width : 'auto',
    height: enableVerticalResize ? height : 'auto',
    resize: enableVerticalResize && enableHorizontalResize ? 'both' : isVerticalOrHorizontalResizeEnable,
    overflow: 'auto',
  };

  return (
    <StyledFlex style={resizableStyle} onResize={handleResize}>
      {children}
    </StyledFlex>
  );
};

export default ResizableTextField;
