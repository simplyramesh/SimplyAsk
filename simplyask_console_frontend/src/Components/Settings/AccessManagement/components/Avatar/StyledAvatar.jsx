import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import { Avatar } from '@mui/material';
import { memo } from 'react';

import { randomColor } from '../../utils/formatters';

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'size' && prop !== 'color',
})`
  width: ${({ size }) => `${size}px` || '34px'};
  height: ${({ size }) => `${size}px` || '34px'};
  background-color: ${({ theme }) => randomColor(theme)};
  font-family: Montserrat;
  font-style: normal;
  font-size: ${({ size }) => (size ? `${parseInt(size, 10) / 2.5}px` : '24px')};
  color: ${({ theme, color }) => color || theme.colors.white};
`;

export const StyledAvatarMask = styled(StyledAvatar)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  background-color: ${({ theme }) => `${theme.colors.white}70`};
  border: none;
  outline: 1px solid ${({ theme }) => `${theme.colors.white}70`};
  transition: opacity 150ms ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

// memo to prevent color change on every state change/rerender
export default memo(StyledAvatar);
