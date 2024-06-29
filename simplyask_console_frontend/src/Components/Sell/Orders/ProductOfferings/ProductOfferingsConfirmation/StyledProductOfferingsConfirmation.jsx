import styled from '@emotion/styled';

import { StyledAccordion } from '../../../../shared/styles/styled';

export const StyledConfirmationAccordion = styled(StyledAccordion)`
  
  &.MuiPaper-root {
    margin: 0;
    padding: 0 0 30px 0;
    background-color: ${({ theme }) => theme.colors.water};
    border-radius: 15px;
    box-shadow: ${({ theme }) => theme.boxShadows.productCheckout};
  }
`;
