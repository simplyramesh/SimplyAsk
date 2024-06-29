import styled from '@emotion/styled';

import { StyledResizeHandle as StyledRootResizeHandler } from '../../shared/styles/styled';

export const StyledResizeHandle = styled(StyledRootResizeHandler)`
  box-shadow: ${({ theme }) => theme.boxShadows.panelExpandButton};
  background-color: ${({ theme }) => theme.colors.white};
`;
