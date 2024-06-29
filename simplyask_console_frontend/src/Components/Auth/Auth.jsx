import { useTheme } from '@emotion/react';
import { WarningAmberRounded } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Collapse } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import { useMutation } from '@tanstack/react-query';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Navigate, matchPath, useLocation, useNavigate } from 'react-router-dom';
import bottomLeftLoginWave from '../../Assets/images/bottomLeftCircleLogin.svg';
import topRightLoginWave from '../../Assets/images/topRightCircleLogin.svg';
import { Login } from '../../Services/axios/authAxios';
import routes from '../../config/routes';
import { useUser } from '../../contexts/UserContext';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import SidebarIcons from '../AppLayout/SidebarIcons/SidebarIcons';
import FormErrorMessage from '../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledButton } from '../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledDivider, StyledFlex, StyledText } from '../shared/styles/styled';
import {
  StyledBottomLeftDarkBlueGradientImage,
  StyledTopRightLightBlueGradientImage,
} from './ForgotPassword/StyledForgotPassword';
import {
  StyledAuthContainer,
  StyledAuthLoginButton,
  StyledAuthRoot,
  StyledFailIcon,
  StyledLoginCardContainer,
  StyledLoginCardContent,
  StyledLoginFailed,
  StyledTextLoginField,
} from './StyledAuth';
import { ERROR_EXCEPTION_MAP, ERROR_TITLE, TELUS_ENV_ACTIVATE_KEY } from './constants/login';
import './transition.css';
import { loginValidationSchema } from './validationSchema';

const Auth = () => {
  const isTelusEnvActivated = import.meta.env.VITE_IS_TELUS_ENV_ACTIVATED;

  const navigate = useNavigate();
  const location = useLocation();

  const { colors } = useTheme();

  const { user, setUser, setIsAccountDisabled, updateUser } = useUser();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isValidRoute = Object.values(routes).some((route) => matchPath(route, location.pathname));

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await Login(email.toLowerCase(), password);
      return response.data;
    },
    onSuccess: async (data) => {
      const error = data?.error || null;

      const isUserAccountDisabled = error && data?.status === 401;
      const exceptionReason = data?.exception?.split('.').pop();

      setIsAccountDisabled(isUserAccountDisabled);
      setErrorMessage(ERROR_EXCEPTION_MAP[exceptionReason] || null);

      if (!isUserAccountDisabled) setUser(data?.token);
    },
    onError: (error) => {
      const errorResponseMessage =
        error.response && error.response.status === 400 ? error.response.data : 'Something went wrong!';

      setErrorMessage({ title: ERROR_TITLE, message: errorResponseMessage });
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      if (user) return;
      login({ email: values.email, password: values.password });
    },
  });

  useEffect(() => {
    if (user?.isTemp) {
      updateUser(undefined);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      navigate(routes.FORGOT_PASSWORD);
    }
  }, [user]);

  if (!isValidRoute) return <Navigate to={routes.DEFAULT} replace />;

  return (
    <StyledAuthRoot>
      <StyledAuthContainer>
        <StyledTopRightLightBlueGradientImage src={topRightLoginWave} alt="" />
        <StyledBottomLeftDarkBlueGradientImage src={bottomLeftLoginWave} alt="" />
        <StyledLoginCardContainer>
          <StyledLoginCardContent>
            <StyledFlex
              display="flex"
              flexDirection="row"
              px="20px"
              pb="40px"
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
            <FormikProvider value={formik}>
              <StyledFlex as="form" id="loginForm" gap="30px">
                <StyledFlex>
                  <StyledText as="label" for="email" weight={600} size={18} lh={22} mb={10}>
                    Email
                  </StyledText>
                  <StyledTextLoginField
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email..."
                    value={formik.values.email}
                    onChange={(e) => formik.setFieldValue('email', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color={colors.blueBayoux} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  )}
                </StyledFlex>
                <StyledFlex>
                  <StyledText as="label" for="password" weight={600} size={18} lh={22} mb={10}>
                    Password
                  </StyledText>
                  <StyledTextLoginField
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter your password..."
                    value={formik.values.password}
                    onChange={(e) => formik.setFieldValue('password', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color={colors.blueBayoux} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <RemoveRedEyeOutlinedIcon
                            color={colors.blueBayoux}
                            cursor="pointer"
                            onClick={() => setIsPasswordVisible((prev) => !prev)}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {formik.errors.password && formik.touched.password && (
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                  )}
                  <StyledFlex justifyContent="start" mt={1} textAlign="start" alignItems="start">
                    <StyledButton fontWeight={600} variant="text" onClick={() => navigate(routes.FORGOT_PASSWORD)}>
                      Forgot Password?
                    </StyledButton>
                  </StyledFlex>
                  <StyledFlex
                    flexDirection="row"
                    mt="21px"
                    mb="11px"
                    justifyContent="start"
                    textAlign="start"
                    alignItems="center"
                    ml={-1}
                  >
                    <Checkbox defaultChecked />
                    <StyledText>Remember Me</StyledText>
                  </StyledFlex>
                </StyledFlex>
              </StyledFlex>
            </FormikProvider>

            <Collapse in={!!errorMessage} unmountOnExit>
              <StyledLoginFailed>
                <StyledFailIcon>
                  <WarningAmberRounded />
                </StyledFailIcon>
                <StyledFlex alignItems="flex-start" flex="1 1 auto">
                  <StyledText as="h4" size={16} weight={600} themeColor="validationError">
                    {errorMessage?.title}
                  </StyledText>
                  <StyledText as="p" size={14} weight={500} lh={18} themeColor="validationError">
                    {errorMessage?.message}
                  </StyledText>
                </StyledFlex>
              </StyledLoginFailed>
            </Collapse>

            <StyledFlex gap="22px 0">
              <StyledAuthLoginButton
                id="loginBtn"
                form="loginForm"
                type="submit"
                loading={isLoginLoading}
                onClick={formik.handleSubmit}
              >
                Log In
              </StyledAuthLoginButton>
              <StyledFlex>
                {isTelusEnvActivated !== TELUS_ENV_ACTIVATE_KEY ? (
                  <StyledText as="p" justifyContent="center" textAlign="center" alignItems="center" size={16}>
                    {`Don't Have an Account? `}
                    <StyledButton variant="text" fontWeight={600} onClick={() => navigate(routes.REGISTER)}>
                      Sign Up for Free
                    </StyledButton>
                  </StyledText>
                ) : null}
              </StyledFlex>
            </StyledFlex>
          </StyledLoginCardContent>
        </StyledLoginCardContainer>
        <StyledFlex
          as="footer"
          justifyContent="center"
          alignItems="center"
          width="100%"
          zIndex={1}
          height="67px"
          position="absolute"
          bottom={0}
        >
          <StyledText as="p" weight={500} lh={24} wrap="nowrap">
            © 2024 SimplyAsk.ai Inc. All rights reserved.
          </StyledText>
        </StyledFlex>
      </StyledAuthContainer>
    </StyledAuthRoot>
  );
};

export default Auth;
