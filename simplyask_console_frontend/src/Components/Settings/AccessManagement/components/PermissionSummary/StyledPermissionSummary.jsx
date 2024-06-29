import styled from '@emotion/styled';
import { Stack } from '@mui/material';

import { StyledAccordion } from '../../../../shared/styles/styled';

export const StyledPermissionSummaryItem = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0px;
`;

export const StyledPermissionSummaryAccordion = styled(StyledAccordion)`
  & .MuiAccordionSummary-root {
    padding-left: 10px;
    padding-right: 2px;
  }

  & .MuiAccordionDetails-root {
    padding-left: 10px;
    padding-right: 8px;
  }
`;
