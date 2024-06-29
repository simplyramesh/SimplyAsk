import styled from '@emotion/styled';

import { StyledFlex } from '../../../styles/styled';

export const StyledActionsPopover = styled.div`
  position: relative;
`;
export const StyledActionsPopoverButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 2px 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.charcoal};
  min-width: 128px;
  cursor: pointer;
  appearance: none;
  background-color: ${({ theme }) => theme.colors.white};

  &:hover {
    background-color: #eaecf1;
  }
`;

export const StyledActionsPopoverMenu = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['menuWidth'].includes(prop),
})`
  width: ${({ menuWidth }) => menuWidth};
  gap: 10px;
  padding: 14px 0;
`;

export const StyledActionsPopoverItem = styled(StyledFlex)`
  position: relative;
  cursor: pointer;
  padding: 2px 13px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hoverPopoverItem};
  }
`;
