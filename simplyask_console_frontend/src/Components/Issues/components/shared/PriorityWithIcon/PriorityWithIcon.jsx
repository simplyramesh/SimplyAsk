import React from 'react';

import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { ISSUE_PRIORITIES, ISSUE_PRIORITY_DATA_MAP } from '../../../constants/core';

const PriorityWithIcon = ({ value }) => {
  const { Icon, label } = value
    ? ISSUE_PRIORITY_DATA_MAP[value]
    : ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.NONE];

  return (
    <StyledFlex display="inline-flex" direction="row" gap="12px" alignItems="center">
      <Icon />
      <StyledText size={16}>{label}</StyledText>
    </StyledFlex>
  );
};

export default PriorityWithIcon;
