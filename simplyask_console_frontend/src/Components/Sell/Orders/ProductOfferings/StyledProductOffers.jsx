import styled from '@emotion/styled';
import { CardMedia } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex } from '../../../shared/styles/styled';

export const StyledListItem = styled.li`
  list-style-type: disc;
  margin-left: 20px;
  min-width: 340px;
  font-size: 10px;
`;

export const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: '250px',
  borderRadius: '15px 15px 0px 0px',
  backgroundColor: theme.colors.timberwolfGray,
}));

export const StyledProductOfferingsBanner = styled.div`
  width: ${({ width }) => width || '100%'};
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  padding: ${({ p }) => p || '0px 0px'};
  display: flex;
  border-radius: 0px 0px 50px 50px;
  background-color: ${({ theme, bgColor }) => bgColor || theme.colors.background};
  overflow: hidden;
`;

export const StyledProductCategoryIconWrapper = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['size'].includes(prop),
})(({ theme, color, size }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.white,
  borderRadius: '10px',
  color: theme.colors[color] || theme.colors.vikingBlue,
  fontSize: size || '60px',
  width: '170px',
  height: '115px',
  boxShadow: theme.boxShadows.productCategory,

  '&:hover': {
    boxShadow: theme.boxShadows.productCategoryHover,
    cursor: 'pointer',
  },
}));

export const StyledProductOfferToastContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    display: flex;
    width: auto;
    background-color: transparent;
  }
  .Toastify__toast {
    cursor: default;
    padding: 0px;
    margin: 0px;
    box-shadow: none;
    border: none;
    background: transparent;
  }
  .Toastify__toast-body {
  }
  .Toastify__progress-bar {
  }
`;

export const StyledCartButton = styled(StyledButton, {
  shouldForwardProp: (prop) => !['iconSize'].includes(prop),
})(({ theme, variant, iconSize }) => ({
  border: 'none',
  outline: 'none',

  '&:hover': {
    color: theme.colors.primary,
    backgroundColor: theme.colors.athensGray,
  },

  ...(variant === 'text' && {
    color: theme.colors.primary,
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '24px',
    padding: '7px 13px',

    ...(iconSize && {
      '& svg': {
        width: iconSize,
        height: iconSize,
      },
    }),
  }),
}));
