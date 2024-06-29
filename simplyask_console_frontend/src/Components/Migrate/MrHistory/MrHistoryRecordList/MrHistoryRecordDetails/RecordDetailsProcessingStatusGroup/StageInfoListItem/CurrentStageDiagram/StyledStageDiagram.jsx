import styled from '@emotion/styled';

import { StyledFlex } from '../../../../../../../shared/styles/styled';

const StyledStartEndIcons = styled(StyledFlex, {
  shouldForwardProp: (prop) => prop !== 'as',
})`
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.information};
  border-radius: 50%;
  padding: 6px 6px 4px 6px;
  pointer-events: 'inherit';
  font-size: 13px;
  align-items: center;
  justify-content: center;
  text-align: center;
  vertical-align: middle;

  & svg {
    font-size: 13px;
  }
`;

export const StyledAdornmentIcons = StyledStartEndIcons.withComponent('span');
