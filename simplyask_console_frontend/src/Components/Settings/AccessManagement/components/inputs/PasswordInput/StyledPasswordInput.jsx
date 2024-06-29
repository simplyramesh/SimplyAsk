import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

import { StyledSpanIcon } from '../../../../../shared/REDISIGNED/icons/StyledCustomTableIcons';

export const Container = styled('div', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'margin',
})`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: ${(prop) => (prop.margin ? prop.margin : '0')};
`;

export const AbsoluteContainer = styled('div', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'width',
})`
  position: absolute;
  top: 0px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  height: 100%;

  padding: 0 14px;
  background-color: transparent;

  ${StyledSpanIcon} {
    transition: color 250ms ease-in-out;
  }

  ${StyledSpanIcon}:hover {
    color: ${({ theme }) => theme.colors.passwordIconHover};
  }
`;

export const DividerWrapper = styled.div`
  height: 100%;
  padding: 6px 0;
`;
