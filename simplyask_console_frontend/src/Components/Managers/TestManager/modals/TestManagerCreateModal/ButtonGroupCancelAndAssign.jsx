import React from 'react';

import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex } from '../../../../shared/styles/styled';

const ButtonGroupCancelAndAssign = ({ cancelTestType, disableAssignButton, assignTestType, confirmText = '' }) => (
  <StyledFlex direction="row" justifyContent="flex-end" mt={1} gap={1.5}>
    <StyledButton variant="contained" tertiary disableRipple onClick={cancelTestType}>
      Cancel
    </StyledButton>
    <StyledButton variant="contained" secondary disabled={disableAssignButton} disableRipple onClick={assignTestType}>
      {confirmText || 'Assign'}
    </StyledButton>
  </StyledFlex>
);

export default ButtonGroupCancelAndAssign;
