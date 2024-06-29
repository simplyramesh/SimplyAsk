import styled from '@emotion/styled';

import { StyledAccordion } from '../../../../shared/styles/styled';

export const StyledCheckoutAccordion = styled(StyledAccordion)`
  
  &.MuiPaper-root {
    margin: 0;
    padding: 30px 0 30px 0;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 15px;
    box-shadow: ${({ theme }) => theme.boxShadows.productCheckout};
  }
`;
