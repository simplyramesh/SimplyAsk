import React from 'react';
import { StyledFlex } from '../../../../../../../../shared/styles/styled';
import { INTENT_PARAMETER_COLORS } from '../../../../../constants/common';

const ParamColorIndicator = ({ id, bgColor }) => {
  const borderColor = INTENT_PARAMETER_COLORS.find((color) => color.BG_COLOR === bgColor)?.BORDER_COLOR;

  return (
    <StyledFlex
      key={id}
      direction="row"
      flexShrink="0"
      width="18px"
      height="18px"
      border="2px solid"
      backgroundColor={bgColor}
      borderColor={borderColor}
      borderRadius="3px"
    >
    </StyledFlex>
  );
};

export default ParamColorIndicator;
