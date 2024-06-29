import styled from '@emotion/styled';
import { MenuItem, MenuList, Select } from '@mui/material';

export const StyledRowPerPageDropdown = styled(Select)`
  border-radius: 67px;
  font-family: Montserrat;

  & .MuiInputBase-input {
    padding: 5px 21px 2px 21px;
    color: ${({ theme }) => theme.colors.black};
    font-family: Montserrat;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 128%; /* 20.48px */
  }

  & .MuiOutlinedInput-notchedOutline {
    border-radius: inherit;
    border: ${({ theme }) => `1px solid ${theme.colors.primary}`};

    &:hover {
      border: ${({ theme }) => `1px solid ${theme.colors.primary}`};
    }
  }

  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: ${({ theme }) => `1px solid ${theme.colors.primary}`};
    outline: none;
  }
`;

export const StyledRowsPerPageMenu = styled(MenuList)`
  & .MuiPaper-root {
    border-radius: 10px;
    box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.1);
  }

  & .MuiList-root {
    padding: 0;
  }
`;

export const StyledRowsPerPageItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    &:hover {
      background-color: ${({ theme }) => theme.colors.passwordStrengthUndefined};
    }

    &.Mui-selected {
      background-color: transparent;
    }
  }
`;
