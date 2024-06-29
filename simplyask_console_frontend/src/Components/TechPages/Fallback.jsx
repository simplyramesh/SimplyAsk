import React, { useEffect } from 'react';
import { StyledTechPages, StyledImg, StyledStack } from './StyledTechPages';
import ErrorImage from '../../Assets/images/errorNotify.svg';
import { StyledButton } from '../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex } from '../shared/styles/styled';
import { useNavigate } from 'react-router-dom';

export const Fallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (error?.message?.includes('dynamically imported module')) {
      window.location.reload();
    }
  }, [error.message]);

  return (
    <StyledTechPages role="alert">
      <StyledImg src={ErrorImage} alt="error" />
      <h1>Whoops...Something Went Wrong!</h1>
      <StyledFlex direction="row" gap="20px">
        <StyledButton size="medium" variant="outlined" primary onClick={() => navigate('/')}>
          Go to Dashboard
        </StyledButton>
        <StyledButton size="medium" variant="outlined" primary onClick={resetErrorBoundary}>
          Try to refresh
        </StyledButton>
      </StyledFlex>
      <StyledFlex width="80%" overflow="auto" gap="10px">
        <b>Error Message:</b> <i>{error.message}</i>
        <StyledStack>{error.stack}</StyledStack>
      </StyledFlex>
    </StyledTechPages>
  );
};
