import styled from '@emotion/styled';

import { StyledFlex } from '../../../../shared/styles/styled';

export const StyledEditValueTrigger = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['isEditing', 'bgTopBotOffset'].includes(prop),
})`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin: ${({ margin }) => margin || '0'};
  padding: ${({ padding }) => padding || '0'};

  min-height: ${({ minHeight }) => minHeight || '41px'};
  z-index: 1;

  &:hover {
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      border-radius: 10px;
      left: -14px;
      top: ${({ bgTopBotOffset }) => (bgTopBotOffset ? `-${bgTopBotOffset}px` : '0')};
      width: calc(100% + 28px);
      height: ${({ bgTopBotOffset }) => (bgTopBotOffset ? `calc(100% + ${bgTopBotOffset * 2}px)` : '100%')};
      background: ${({ theme, isEditing }) => !isEditing && theme.colors.bgColorOptionTwo};
      z-index: -1;
    }
  }
`;
