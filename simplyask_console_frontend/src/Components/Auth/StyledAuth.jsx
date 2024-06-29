import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { LoadingButton } from '@mui/lab';
import TextField from '@mui/material/TextField';
import { StyledFlex } from '../shared/styles/styled';

export const StyledAuthLoginButton = styled(LoadingButton, {
  shouldForwardProp: (prop) => prop !== 'isLoading',
})`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: ${({ loading }) => (!loading ? '16px' : 0)};
  line-height: 20px;
  max-height: 41px;
  min-height: 41px;
  text-transform: none;
  text-align: center;
  border-radius: 10px;
  padding: 0;
  margin-top: 26px;
  background-color: ${({ theme, loading }) =>
    !loading ? theme.colors.symphonaBlue : `${theme.colors.symphonaBlue}50`};
  color: ${({ theme }) => theme.colors.white};
  transition: background-color 250ms ease-in-out;

  & .MuiLoadingButton-loadingIndicator {
    color: ${({ theme }) => theme.colors.white};

    & .MuiCircularProgress-root {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px !important;
      height: 20px !important;
    }

    & .MuiCircularProgress-svg {
      width: 20px;
      height: 20px;
    }
  }

  &:hover {
    background-color: ${({ loading, theme }) =>
      !loading ? `${theme.colors.symphonaBlue}99` : `${theme.colors.symphonaBlue}50`};
  }

  &:disabled {
    background-color: ${({ theme }) => `${theme.colors.symphonaBlue}`};
    color: ${({ theme }) => `${theme.colors.white}`};
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const StyledAuthRoot = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => `${theme.colors.white}`};
`;

export const StyledAuthContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  place-items: start;
  align-content: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const StyledLoginCardContainer = styled.div`
  z-index: 1;
  animation: ${fadeIn} ease-in 1;
  animation-fill-mode: forwards;
  animation-duration: 0.5s;
`;

export const StyledLoginCardContent = styled(StyledFlex)`
  padding: 40px;
  background: ${({ theme }) => theme.colors.white};
  z-index: 2;
  border-radius: 20px;
  width: 550px;
  box-shadow: ${({ theme }) => theme.boxShadows.loginCardShadow};
`;

export const StyledLoginFailed = styled.section`
  margin: 0;
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  border: 1px solid ${({ theme }) => theme.colors.validationError};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.lightRedError} inset;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.validationError};
  padding: 18px 14px;
  pointer-events: none;
`;

export const StyledFailIcon = styled.div`
  flex: 0 0 auto;
  margin: 0 16px;

  & > svg {
    font-size: 24px;
  }
`;

export const StyledTextLoginField = styled(TextField)`
  & .MuiInputBase-root {
    height: 50px;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
  }
`;
