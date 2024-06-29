import styled from '@emotion/styled';
import { Button } from '@mui/material';

import { StyledFlex, StyledTextField } from '../../../../../shared/styles/styled';

export const StyledServiceTicketTypeColorSelector = styled(Button, {
  shouldForwardProp: (prop) => !['color', 'isSelected'].includes(prop),
})(({ theme, color, isSelected }) => ({
  width: '50px',
  height: '40px',
  background: `linear-gradient(90deg, ${theme.iconColors?.[color]?.color} 50%, ${theme.iconColors?.[color]?.bg} 50%)`,
  padding: 0,
  borderRadius: '3px',
  flexGrow: '0',
  ...(isSelected && { '& span': { display: 'flex' } }),
  '&:hover': { '& span': { display: 'flex' } },
}));

export const StyledServiceTicketTypeCheckIconWrapper = styled(StyledFlex)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 0,
  backgroundColor: theme.colors.white,
  boxShadow: theme.boxShadows.checkIcon,
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  color: theme.colors.primary,
  fontSize: '18px',
  flexShrink: 0,
  '& .MuiSvgIcon-root': { fontSize: 'inherit' },
}));

export const StyledServiceTicketTypeIconSelector = styled(Button, {
  shouldForwardProp: (prop) => !['isSelected'].includes(prop),
})(({ theme, isSelected }) => ({
  width: '50px',
  maxWidth: '50px',
  height: '40px',
  fontSize: '18px',
  padding: 0,
  borderRadius: '3px',
  color: theme.colors.primary,
  outline: isSelected ? `3px solid ${theme.colors.linkColor}` : `1.5px solid ${theme.colors.iron}`,
  backgroundColor: theme.colors.bgColorOptionTwo,
  '& span .MuiSvgIcon-root': { fontSize: 'inherit' },
}));

export const StyledServiceTicketTypeTextField = styled(StyledTextField)(({ theme }) => ({
  padding: '0',

  '& .Mui-disabled': {
    color: theme.colors.primary,
    WebkitTextFillColor: theme.colors.primary,
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
    outline: 'none',
    borderRadius: '10px',
  },

  '& .MuiOutlinedInput-root': {
    fontFamily: 'Montserrat',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    padding: '9px 14px',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.colors.white,
    },

    '&:focus-within': {
      backgroundColor: 'transparent',
    },

    '& .MuiOutlinedInput-input': {
      textAlign: 'inherit',
      paddingRight: '6px',
      letterSpacing: 'normal',
      WebkitTextFillColor: 'inherit',
      '::-webkit-scrollbar': {
        width: ' 8px',
        height: '8px',
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        border: `3px solid ${theme.colors.white}20`,
        borderRadius: '10px',
        background: '#c6c6c675',
      },
      '::-webkit-scrollbar-track': {
        borderRadius: '2px',
        background: 'transparent',
      },
      '::-webkit-scrollbar-track-piece:': {
        borderRadius: '2px',
        outline: '2px solid #c6c6c6',
        background: `${theme.colors.scrollThumbBgAlt}80`,
        margin: '0',
        marginBottom: '1px',
      },
    },
  },
}));

export const StyledIconWrapper = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['iconWidth', 'iconHeight'].includes(prop),
})(
  ({ iconWidth, iconHeight }) => `
  & svg {
    width: ${iconWidth || '20px'};
    height: ${iconHeight || '20px'};
  }`
);

