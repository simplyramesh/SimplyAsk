import styled from '@emotion/styled';

import { StyledFlex } from '../../../../../../shared/styles/styled';

export const StyledParamListContainer = styled(StyledFlex, {
  shouldForwardProp: (prop) => prop !== !['as'].includes(prop),
})`
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  gap: 0 10px;
  padding: 0px 0px 0px 10px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  min-height: 86px;
  box-shadow: ${({ theme }) => theme.boxShadows.paramCard};
`;

export const StyledParamListTextWrapper = styled(StyledFlex, {
  shouldForwardProp: (prop) => prop !== !['as'].includes(prop),
})`
  align-items: flex-start;
  gap: 6px 0;
  flex: 1 1 auto;
  padding: 0;
  min-width: 0;
`;

export const StyledParamListActionWrapper = styled(StyledFlex, {
  shouldForwardProp: (prop) => prop !== !['as'].includes(prop),
})`
  justify-content: center;
  align-items: center;
  align-self: stretch;
  padding: 8px;
  gap: 8px 0;
  width: 40px;
  background-color: ${({ theme }) => theme.colors.tertiary};
  border-radius: 0 10px 10px 0;
`;

export const StyledParamListIconWrapper = styled(StyledFlex, {
  shouldForwardProp: (prop) => prop !== !['as'].includes(prop),
})`
  &:hover {
    cursor: pointer;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.tertiaryHover};
  }

  & svg {
    width: 26px;
    height: 26px;
    pointer-events: none;
  }
`;
