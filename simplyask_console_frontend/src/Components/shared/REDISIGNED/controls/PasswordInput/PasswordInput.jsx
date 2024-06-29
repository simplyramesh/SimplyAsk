import { useTheme } from '@emotion/react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { useFormik } from 'formik';

import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import {
  StyledDivider, StyledFlex, StyledPasswordFormControl, StyledText,
} from '../../../styles/styled';

const PasswordInput = ({
  id,
  onChange,
  onBlur,
  maxCharCount,
  error,
  invalid,
  initialValue,
}) => {
  const { colors } = useTheme();

  const { values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: initialValue || '',
      showPassword: false,
    },
  });

  const renderErrorMessage = (message) => (message
    ? (
      <StyledFlex position="absolute" bottom="-20px" left="0">
        <FormErrorMessage>{message}</FormErrorMessage>
      </StyledFlex>
    )
    : null);

  const renderCharCount = (value) => (
    maxCharCount
      ? (
        <StyledFlex position="absolute" bottom={-20} right={0} justifyContent="flex-end" direction="row">
          <StyledText
            size={12}
            lh={15}
            color={error ? colors.validationError : colors.primary}
          >
            {`${value}/${maxCharCount} characters`}
          </StyledText>
        </StyledFlex>
      )
      : null
  );

  return (
    <StyledFlex position="relative">
      <StyledPasswordFormControl
        variant="outlined"
        height="41px"
        invalid={invalid || error}
      >
        <OutlinedInput
          id={id || 'password-visibility-input'}
          autoComplete="off"
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={(e) => {
            setFieldValue('password', e.target.value);
            onChange?.(e);
          }}
          onBlur={(e) => onBlur?.(e)}
          endAdornment={(
            <InputAdornment position="end">
              <StyledDivider orientation="vertical" height="27px" color={colors.primary} />
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setFieldValue('showPassword', !values.showPassword)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {values.showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </IconButton>
            </InputAdornment>
          )}
        />
      </StyledPasswordFormControl>
      {renderErrorMessage(error)}
      {renderCharCount(values.password.length)}
    </StyledFlex>
  );
};

export default PasswordInput;
