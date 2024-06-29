import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';
import zxcvbn from 'zxcvbn';

import AccessManagementIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { ADD_USER } from '../../constants/apiConstants';
import { generateRandomPassword } from '../../utils/helpers';
import FormErrorMessage from '../FormErrorMessage/FormErrorMessage';
import PasswordInput from '../inputs/PasswordInput/PasswordInput';

import PasswordStrengthBar from './PasswordStrengthBar/PasswordStrengthBar';

const PASSWORD_STRENGTH_TEXT = {
  0: 'N/A',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
};

const passwordAttrValidation = (value) => {
  if (value === '' || typeof value !== 'string') {
    return {
      hasLowercase: 'undefined',
      hasUppercase: 'undefined',
      hasNumber: 'undefined',
      hasSpecial: 'undefined',
      hasMinLength: 'undefined',
    };
  }

  const hasTwelveCharacters = value.length >= 12;
  const hasLowercase = /[a-z]/.test(value);
  const hasUppercase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#?%]/.test(value);

  return {
    hasTwelveCharacters: `${hasTwelveCharacters}`,
    hasLowercase: `${hasLowercase}`,
    hasUppercase: `${hasUppercase}`,
    hasNumber: `${hasNumber}`,
    hasSpecial: `${hasSpecial}`,
  };
};

const passwordValidationHelpers = (formik, theme) => {
  const {
    hasTwelveCharacters, hasUppercase, hasLowercase, hasNumber, hasSpecial,
  } = passwordAttrValidation(formik.values[ADD_USER.PASSWORD]);

  const textColor = {
    true: theme.colors.statusResolved,
    false: theme.colors.validationError,
    undefined: theme.colors.information,
  };

  return [
    {
      text: '12 characters minimum',
      icon: hasTwelveCharacters === 'true' ? 'CHECK' : 'CLOSE',
      width: hasTwelveCharacters === 'true' ? 14 : 10,
      color: textColor[hasTwelveCharacters],
    },
    {
      text: '1 lowercase letter',
      icon: hasLowercase === 'true' ? 'CHECK' : 'CLOSE',
      width: hasLowercase === 'true' ? 14 : 10,
      color: textColor[hasLowercase],
    },
    {
      text: '1 uppercase letter',
      icon: hasUppercase === 'true' ? 'CHECK' : 'CLOSE',
      width: hasUppercase === 'true' ? 14 : 10,
      color: textColor[hasUppercase],
    },
    {
      text: '1 number',
      icon: hasNumber === 'true' ? 'CHECK' : 'CLOSE',
      width: hasNumber === 'true' ? 14 : 10,
      color: textColor[hasNumber],
    },
    {
      text: '1 special character (examples: !, @, #, ?, %)',
      icon: hasSpecial === 'true' ? 'CHECK' : 'CLOSE',
      width: hasSpecial === 'true' ? 14 : 10,
      color: textColor[hasSpecial],
    },
  ];
};

const NewPassword = ({ formik }) => {
  const theme = useTheme();

  const [passwordInputType, setPasswordInputType] = useState({ new: true, confirm: true });

  const passwordRef = useRef(null);

  const { score } = useMemo(() => zxcvbn(
    formik.values?.[ADD_USER.PASSWORD],
    [
      formik.values?.[ADD_USER.COUNTRY]?.name,
      formik.values?.[ADD_USER.CITY],
      formik.values?.[ADD_USER.COMPANY_NAME],
      formik.values?.[ADD_USER.FIRST_NAME],
      formik.values?.[ADD_USER.LAST_NAME],
      formik.values?.[ADD_USER.EMAIL],
      formik.values?.[ADD_USER.PHONE],
      formik.values?.[ADD_USER.PROVINCE],
    ],
  ), [formik.values?.[ADD_USER.PASSWORD]]);

  const handleGeneratePassword = () => {
    const password = generateRandomPassword();

    formik.setValues({
      ...formik.values,
      [ADD_USER.PASSWORD]: password,
      [ADD_USER.CONFIRM_PASSWORD]: password,
    });

    setPasswordInputType({ new: false, confirm: false });
  };

  return (
    <>
      <PasswordInput
        label="New Password"
        width="100%"
        inputProps={{
          ...formik.getFieldProps(ADD_USER.PASSWORD),
          onBlur: (e) => {
            if (!formik.values[ADD_USER.PASSWORD]) {
              formik.setValues({
                ...formik.values,
                [ADD_USER.CONFIRM_PASSWORD]: '',
              });
            }
            formik.getFieldProps(ADD_USER.PASSWORD).onBlur(e);
          },
          type: passwordInputType.new ? 'password' : 'text',
          inputRef: passwordRef,
        }}
        errors={formik.getFieldMeta(ADD_USER.PASSWORD)}
        onGeneratePassword={handleGeneratePassword}
        onShowPassword={() => setPasswordInputType((prev) => ({
          ...prev,
          new: !prev.new,
        }))}
        isMasked={passwordInputType.new}
        withGenerate
      />
      <StyledFlex direction="row" gap="8px" flex="auto" width="100%" m="10px 0">
        <PasswordStrengthBar strength={score} />
        <PasswordStrengthBar strength={score > 1 ? score : 0} />
        <PasswordStrengthBar strength={score > 2 ? score : 0} />
        <PasswordStrengthBar strength={score > 3 ? score : 0} />
      </StyledFlex>
      <StyledFlex mb="24px">
        <StyledText as="p" size={14} weight={500}>
          {`Password Strength: ${PASSWORD_STRENGTH_TEXT[score]}`}
        </StyledText>
        {(formik.getFieldMeta(ADD_USER.PASSWORD).error) && (
          <FormErrorMessage>{formik.getFieldMeta(ADD_USER.PASSWORD).error}</FormErrorMessage>
        )}
      </StyledFlex>
      <StyledFlex direction="column" gap="10px" flex="auto" width="100%" m="0 0 30px 0">
        {passwordValidationHelpers(formik, theme).map((helper) => (
          <StyledFlex key={helper.text} direction="row" gap="6px" align="center">
            <AccessManagementIcons
              icon={helper.icon}
              width={helper.width}
              color={helper.color}
            />
            <StyledText
              as="p"
              size={14}
              weight={500}
              color={helper.color}
            >
              {helper.text}
            </StyledText>
          </StyledFlex>
        ))}
      </StyledFlex>
      <StyledFlex direction="row" gap="8px" flex="auto" width="100%" m="0 0 36px 0">
        <PasswordInput
          label="Confirm New Password"
          inputProps={{
            ...formik.getFieldProps(ADD_USER.CONFIRM_PASSWORD),
            type: passwordInputType.confirm ? 'password' : 'text',
            disabled: !formik.values[ADD_USER.PASSWORD],
          }}
          errors={formik.getFieldMeta(ADD_USER.CONFIRM_PASSWORD)}
          onShowPassword={() => setPasswordInputType((prev) => ({
            ...prev,
            confirm: !prev.confirm,
          }))}
          isMasked={passwordInputType.confirm}
        >
          <FormErrorMessage>{!formik.getFieldMeta(ADD_USER.CONFIRM_PASSWORD).touched ? 'Confirm password is required' : formik.errors[ADD_USER.CONFIRM_PASSWORD]}</FormErrorMessage>
        </PasswordInput>
      </StyledFlex>
    </>
  );
};

export default NewPassword;

NewPassword.propTypes = {
  formik: PropTypes.object,
};
