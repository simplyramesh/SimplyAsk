import styled from '@emotion/styled';
import { TextField } from '@mui/material';

export const StyledDescriptionTextField = styled(TextField)(({ theme, disabled }) => ({
  pointerEvents: disabled ? 'none' : 'auto',
  backgroundColor: 'transparent',
  marginRight: '-16px',
  borderRadius: '10px',
  color: theme.colors.primary,
  width: '100%',
  textAlign: 'right',
  '& .Mui-disabled': {
    color: theme.colors.primary,
    WebkitTextFillColor: theme.colors.primary,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
    outline: 'none',
    borderRadius: '10px',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: `2px solid ${theme.colors.linkColor}`,
    borderRadius: '10px',
  },
  '& .MuiOutlinedInput-root': {
    fontFamily: 'Montserrat',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    padding: '1px 8px 1px 10px',
    '&:hover': {
      backgroundColor: theme.colors.athensGray,
    },
    '&:focus-within': {
      backgroundColor: 'transparent',
    },
    '& .MuiOutlinedInput-input': {
      textAlign: 'inherit',
      paddingRight: '6px',
      letterSpacing: 'normal',
      WebkitTextFillColor: 'inherit',
    },
  },
}));
