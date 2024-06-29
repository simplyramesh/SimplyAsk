import styled from '@emotion/styled';
import { Fab, List, ListItemButton, ListItemIcon } from '@mui/material';
import { StyledFlex } from '../shared/styles/styled';

export const StyledHelpResourceList = styled(List)`
  padding: 0;
`;

export const StyledHelpResourceListItemButton = styled(ListItemButton)`
  padding: 10px 15px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.hoverPopoverItem};
  }
`;

export const StyledHelpResourceListItemIcon = styled(ListItemIcon)`
  width: 20px;
  height: 20px;
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledFab = styled(Fab)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accordionBgHover};
  }
`;

export const StyledFabIcon = styled(StyledFlex)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  outline: 0;
  border: 0;
  margin: 0;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.75;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  transition:
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 50%;
  padding: 0;
  min-width: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  width: 24px;
  height: 24px;
  min-height: 24px;
  box-shadow: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledFeedbackModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 28px;
  height: 56px;
  border-radius: 25px 25px 0 0;
  background-color: ${({ theme }) => theme.colors.lighterColor};
`;

export const StyledFeedbackModalBody = styled.div`
  height: calc(100% - 56px);
`;
