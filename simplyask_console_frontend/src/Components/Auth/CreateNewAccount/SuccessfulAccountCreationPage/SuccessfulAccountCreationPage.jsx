import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import CongratulationsHat from '../../../../Assets/images/congratulationsHat.svg?component';
import routes from '../../../../config/routes';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';

import {
  StyledAccountCreationSuccessBackground,
  StyledAccountCreationSuccessCard,
} from './StyledAccountCreationSuccessPage';
import useResendEmail from '../../hooks/useResendEmail';
import Spinner from '../../../shared/Spinner/Spinner';

const SuccessfulAccountCreationPage = ({ email = '' }) => {
  const navigate = useNavigate();

  const redirectToLoginPage = () => {
    navigate(routes.DEFAULT);
  };

  const { resendEmail, isEmailResendLoading } = useResendEmail({
    onSuccess: () => toast.success('Email resent successfully'),
    onError: () => toast.error('Something went wrong...'),
  });

  if (isEmailResendLoading) return <Spinner parent />;
  return (
    <StyledAccountCreationSuccessBackground>
      <StyledFlex height="100%" width="100%" justifyContent="center" alignItems="center" display="flex">
        <StyledFlex justifyContent="center" alignItems="center" flex="1">
          <StyledAccountCreationSuccessCard p="0" borderRadius="20px" width="1240px" height="802px">
            <StyledFlex height="100%" width="100%" justifyContent="center" alignItems="center" gap="40px">
              <StyledFlex as="span">
                <CongratulationsHat />
              </StyledFlex>

              <StyledText themeColor="linkColor" size={40} weight={700}>
                Congratulations!
              </StyledText>

              <StyledText width="446px" height="73px" textAlign="center" size={25} weight={700}>
                You Have Successfully Registered For Symphona
              </StyledText>

              <StyledText width="464px" textAlign="center" height="99px">
                We have sent a link to {email} to confirm your email. Please check your Inbox. If you did not receive an
                email, check your spam box or{' '}
                <StyledButton variant="text" fontSize={16} onClick={() => resendEmail(email)}>
                  click here to resend the email.
                </StyledButton>{' '}
              </StyledText>

              <StyledButton variant="contained" type="submit" onClick={redirectToLoginPage}>
                Return to Login Page
              </StyledButton>
            </StyledFlex>
          </StyledAccountCreationSuccessCard>
        </StyledFlex>

        <StyledFlex mb="20px" alignItems="center" justifyContent="center">
          <StyledText weight={500}>© 2024 SimplyAsk.ai Inc. All rights reserved.</StyledText>
        </StyledFlex>
      </StyledFlex>
    </StyledAccountCreationSuccessBackground>
  );
};

export default SuccessfulAccountCreationPage;

SuccessfulAccountCreationPage.propTypes = {
  email: PropTypes.string,
};
