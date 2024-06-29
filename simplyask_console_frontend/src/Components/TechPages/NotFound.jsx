import React from 'react';
import { StyledTechPages, StyledImg } from './StyledTechPages';
import ErrorImage from '../../Assets/images/errorNotify.svg';
import { StyledButton } from '../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex } from '../shared/styles/styled';
import { useNavigate } from 'react-router-dom';

export const NotFound = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  return (
    <StyledTechPages role="alert">
      <StyledImg src={ErrorImage} alt="error" />
      <h1>Page Not Found!</h1>
      <StyledFlex>The Page you are looking for doesn't exist or an other error occurred.</StyledFlex>
      <StyledFlex direction="row" gap="20px">
        <StyledButton size="medium" variant="outlined" primary onClick={() => navigate('/')}>
          Go to Dashboard
        </StyledButton>
      </StyledFlex>
    </StyledTechPages>
  );
};
