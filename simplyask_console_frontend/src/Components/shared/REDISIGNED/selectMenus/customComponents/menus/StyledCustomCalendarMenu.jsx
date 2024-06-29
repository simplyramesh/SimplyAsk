import styled from '@emotion/styled';
import { Stack } from '@mui/material';

export const StyledSelectMenuCalendarContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'selectProps',
})`
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    border: 1px solid #f4f4f4;
    border-radius: 10px;
    background: #c6c6c650;
  }

  ::-webkit-scrollbar-track {
    background: #f4f4f4;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-track-piece {
    margin: 1px 0;
    background: #f4f4f4;
  }

  min-height: ${({ selectProps }) => `${selectProps?.minMenuHeight}px` || 'auto'};
  max-height: ${({ selectProps }) => `${selectProps?.maxMenuHeight}px` || 'auto'};
  margin-right: -23px;
  padding-right: 23px;
  overflow-y: auto;
`;

export const StyledDateRangeText = styled('p', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})`
  font-family: 'Montserrat';
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.primary)};
  cursor: ${({ isActive }) => (isActive ? 'default' : 'pointer')};
  pointer-events: ${({ isActive }) => (isActive ? 'none' : 'auto')};
  border-radius: 5px;
  font-weight: ${({ isActive }) => (!isActive ? '400' : '700')};
  font-style: normal;
  text-align: left;
  white-space: nowrap;
  width: 100%;
  margin-left: -2px;
  padding: 8px 16px;
  transition:
    color ${({ theme }) => theme.transitions.default},
    background-color ${({ theme }) => theme.transitions.default},
    font-weight ${({ theme }) => theme.transitions.default};
  &:hover {
    background-color: ${({ theme, isActive }) => !isActive && theme.colors.passwordStrengthUndefined};
  }
`;
