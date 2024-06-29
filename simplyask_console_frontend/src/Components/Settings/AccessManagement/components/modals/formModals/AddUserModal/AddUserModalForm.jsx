import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { StyledLoadingButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { ADD_USER } from '../../../../constants/apiConstants';
import { useInviteNewUser } from '../../../../hooks/useInviteNewUser';
import { ADD_USER_VALIDATION_SCHEMA } from '../../../../utils/validations';
import FormUserInfo from '../../../FormUserInfo/FormUserInfo';
import NewPassword from '../../../NewPassword/NewPassword';

const FORMIK_ADD_USER_INIT_STATE = {
  [ADD_USER.FIRST_NAME]: '',
  [ADD_USER.LAST_NAME]: '',
  [ADD_USER.TIMEZONE]: '',
  [ADD_USER.EMAIL]: '',
  [ADD_USER.PHONE]: '',
  [ADD_USER.COUNTRY]: '',
  [ADD_USER.PROVINCE]: '',
  [ADD_USER.COMPANY_NAME]: '',
  [ADD_USER.CITY]: '',
  [ADD_USER.PASSWORD]: '',
  [ADD_USER.CONFIRM_PASSWORD]: '',
};

const AddUserModalForm = ({ onOpenChange, ...rest }) => {
  const [shouldValidate, setShouldValidate] = useState(false);

  const { inviteNewUser, isInviteNewUserLoading } = useInviteNewUser({
    invalidateQueryKey: 'getFilteredUsers',
    onSuccess: ({ variables }) => {
      toast.success(`${variables?.[ADD_USER.FIRST_NAME]} has been invited`);

      onOpenChange(false);
      formik.resetForm();
      setShouldValidate(false);
    },
  });

  const handleInviteUser = async (value) => {
    try {
      const userPayload = Object.entries(value).reduce((acc, [key, value]) => {
        if (key === ADD_USER.CONFIRM_PASSWORD) return acc;

        if (key === ADD_USER.COUNTRY) return { ...acc, [ADD_USER.COUNTRY]: value || null };
        if (key === ADD_USER.PROVINCE) return { ...acc, [ADD_USER.PROVINCE]: value || null };

        return { ...acc, [key]: value };
      }, {});

      const parsed = JSON.parse(JSON.stringify(userPayload));

      inviteNewUser(parsed);
    } catch (error) {
      toast.error(`Error inviting ${value?.[ADD_USER.FIRST_NAME]}`);
    }
  };

  const formik = useFormik({
    initialValues: FORMIK_ADD_USER_INIT_STATE,
    validationSchema: ADD_USER_VALIDATION_SCHEMA,
    enableReinitialize: true,
    validateOnBlur: shouldValidate,
    validateOnChange: shouldValidate,
    onSubmit: (value) => handleInviteUser(value),
  });

  return (
    <CenterModalFixed
      {...rest}
      actions={
        <StyledFlex direction="row" justifyContent="flex-end" width="100%" p="0 18px">
          <StyledLoadingButton
            primary
            variant="contained"
            type="submit"
            form="addUserForm"
            onClick={() => formik.submitCount === 0 && setShouldValidate(true)}
            disabled={!formik.isValid}
            minWidth="130px"
            loading={isInviteNewUserLoading}
          >
            Invite User
          </StyledLoadingButton>
        </StyledFlex>
      }
    >
      <StyledFlex as="form" id="addUserForm" flex="auto" p="24px 22px" onSubmit={formik.handleSubmit}>
        <FormUserInfo formik={formik} contactInfoTitle="User's" />
        <StyledDivider orientation="horizontal" flexItem />
        <StyledFlex gap="8px" m="50px 0 40px 0" p="0 12px 0 6px">
          <StyledText as="h3" size={20} weight={600}>
            Password
            {/* <StyledText as="span" size={20} color={colors.optional}>{' (Optional)'}</StyledText> */}
          </StyledText>
          <StyledText as="p" size={16} weight={400}>
            This password allows the user to access their account, as well as the console. You can create it for them
            now, or they can do it themselves once they access their account for the first time
          </StyledText>
        </StyledFlex>
        <StyledFlex p="0 10px">
          <NewPassword formik={formik} />
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default AddUserModalForm;

AddUserModalForm.propTypes = {
  onOpenChange: PropTypes.func.isRequired,
};
