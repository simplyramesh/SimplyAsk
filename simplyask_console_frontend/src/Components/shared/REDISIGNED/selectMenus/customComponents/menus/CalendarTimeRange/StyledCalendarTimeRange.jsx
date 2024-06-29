import styled from '@emotion/styled';
import { MenuItem, Select, TextField } from '@mui/material';

export const StyledTimeRangeInput = styled(TextField, {
  shouldForwardProp: (prop) => !['selectProps', 'textAlign', 'textColor'].includes(prop),
})`
  padding: 0;
  text-align: ${({ textAlign }) => textAlign || 'left'};

  & .MuiInputBase-root {
    padding: inherit;
    text-align: inherit;
    border-radius: 10px;
    border: none;
    background: transparent;
    outline: none;

    & .MuiInputBase-input {
      padding: inherit;
      text-align: inherit;
      font-family: Montserrat;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 128%; /* 20.48px */
      letter-spacing: 0.32px;
      color: ${({ theme, textColor }) => textColor || theme.colors.primary};
      &::placeholder {
        color: ${({ theme }) => theme.colors.information};
      }
    }

    & .MuiOutlinedInput-notchedOutline {
      border-radius: inherit;
      border: inherit;

      &:hover {
        border: inherit;
      }
    }
  }
`;

export const StyledAmPmSelect = styled(Select, {
  shouldForwardProp: (prop) => !['selectProps', 'textColor', 'borderColor'].includes(prop),
})`
  border-radius: 10px;
  width: 98px;
  font-family: Montserrat;

  & .MuiInputBase-input {
    padding: 9px 21px;
    color: ${({ theme, textColor }) => textColor || theme.colors.black};
    font-family: Montserrat;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 128%; /* 20.48px */
  }
  & .MuiOutlinedInput-notchedOutline {
    border-radius: inherit;
    border: ${({ theme, borderColor }) => `1px solid ${borderColor || theme.colors.primary}`};
    &:hover {
      border: ${({ theme }) => `1px solid ${theme.colors.primary}`};
    }
  }
`;

export const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== 'selectProps',
})`
  &.MuiMenuItem-root {
    &:hover {
      background-color: ${({ theme }) => theme.colors.passwordStrengthUndefined};
    }
    &.Mui-selected {
      background-color: transparent;
    }
  }
`;
