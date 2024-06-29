import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';

import routes from '../../../config/routes';

import { useTheme } from '@emotion/react';
import PersonIcon from '@mui/icons-material/Person';
import InputAdornment from '@mui/material/InputAdornment';

import bottomLeftLoginWave from '../../../Assets/images/bottomLeftCircleLogin.svg';
import topRightLoginWave from '../../../Assets/images/topRightCircleLogin.svg';
import SidebarIcons from '../../AppLayout/SidebarIcons/SidebarIcons';
import FormErrorMessage from '../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledButton, StyledLoadingButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledDivider, StyledFlex, StyledText } from '../../shared/styles/styled';
import { StyledTextLoginField } from '../StyledAuth';
import useForgotPassword from '../hooks/useForgotPassword';
import { forgotPasswordValidationSchema } from '../validationSchema';
import {
  StyledBottomLeftDarkBlueGradientImage,
  StyledForgotPasswordCard,
  StyledForgotPasswordContainer,
  StyledTopRightLightBlueGradientImage,
} from './StyledForgotPassword';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const { colors } = useTheme();

  const { resetPassword, isResetPasswordLoading } = useForgotPassword({
    onSuccess: () => {
      setEmailError('');

      toast.success(
        'Your reset email request has been received. If an account with that email is found, further information will be sent.'
      );

      navigate(routes.DEFAULT);
    },
    onError: (error) => {
      if (error.response && error.response.status === 400) {
        setEmailError(error.response.data);
      } else {
        setEmailError('Something went wrong!');
      }
    },
  });

  const { values, errors, touched, setFieldValue, submitForm } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: (values) => {
      handleResetPassword(values);
    },
  });

  const handleResetPassword = (values) => {
    resetPassword({ email: values.email });
  };

  return (
    <StyledForgotPasswordContainer>
      <StyledForgotPasswordCard>
        <StyledFlex
          display="flex"
          flexDirection="row"
          px="20px"
          pb="10px"
          textAlign="center"
          justifyContent="center"
          alignItems="center"
          gap="15px"
        >
          <StyledFlex display="flex" flexDirection="row">
            <SidebarIcons icon="SYMPHONA" width="20px" height="30px" />
            <StyledText ml={5} weight={700} size={20} mr={2}>
              Symphona
            </StyledText>
          </StyledFlex>
          <StyledDivider orientation="vertical" borderWidth={2} color={colors.darkVerticalBorder} height="20px" />

          <StyledFlex display="flex" flexDirection="row">
            <SidebarIcons icon="SIMPLY_ASK" width="29px" height="29px" />
            <StyledText ml={5} weight={700} size={20}>
              SimplyAsk
            </StyledText>
          </StyledFlex>
        </StyledFlex>
        <StyledText mt={40} weight={700} size={20} mb={3}>
          Reset Your Password
        </StyledText>
        <StyledFlex flexDirection="row" mb={2}>
          <StyledText as="span" display="inline">
            Enter your
            <StyledText as="span" weight={600} display="inline">
              {' '}
              account email{' '}
            </StyledText>
            below. We will send a temporary password to the account email. If you don't remember your account email,
            contact your administrator.
          </StyledText>
        </StyledFlex>
        <StyledText weight={600}>Email</StyledText>
        <StyledFlex width="470px">
          <StyledTextLoginField
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={values.email}
            onChange={(e) => {
              setFieldValue('email', e.target.value);
              setEmailError('');
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color={colors.blueBayoux} />
                </InputAdornment>
              ),
            }}
          />
        </StyledFlex>
        {((errors.email && touched.email) || emailError) && (
          <FormErrorMessage>{errors.email || emailError}</FormErrorMessage>
        )}
        <StyledFlex direction="row" mt="45px" width="100%" gap="10px">
          <StyledButton
            variant="contained"
            primary
            onClick={() => navigate(routes.DEFAULT)}
            minWidth="230px"
            height="38px"
          >
            Return to Log In
          </StyledButton>
          <StyledLoadingButton
            variant="contained"
            form="ResetForm"
            type="Submit"
            loading={isResetPasswordLoading}
            minWidth="230px"
            onClick={() => submitForm()}
          >
            Request Reset
          </StyledLoadingButton>
        </StyledFlex>
      </StyledForgotPasswordCard>
      <StyledFlex
        textAlign="center"
        justifyContent="center"
        alignItems="center"
        width="100%"
        zIndex={1}
        position="absolute"
        bottom={20}
      >
        <StyledText weight={600}>© 2024 SimplyAsk.ai Inc. All rights reserved.</StyledText>
      </StyledFlex>
      <StyledTopRightLightBlueGradientImage src={topRightLoginWave} alt="Light Blue Image Gradient" />
      <StyledBottomLeftDarkBlueGradientImage src={bottomLeftLoginWave} alt="Dark Blue Image Gradient" />
    </StyledForgotPasswordContainer>
  );
};

export default ForgotPassword;
