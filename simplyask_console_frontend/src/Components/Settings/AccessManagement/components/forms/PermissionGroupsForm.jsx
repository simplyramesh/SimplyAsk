import { useFormik } from 'formik';
import PropTypes from 'prop-types';

import { StyledButton, StyledLoadingButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex } from '../../../../shared/styles/styled';
import { ADD_USER_GROUP } from '../../constants/apiConstants';
import { ADD_PERMISSION_GROUP_VALIDATION_SCHEMA } from '../../utils/validations';
import FormErrorMessage from '../FormErrorMessage/FormErrorMessage';
import ValidationInput from '../inputs/ValidationInput/ValidationInput';

const FORMIK_ADD_USER_GROUP_INIT_STATE = {
  [ADD_USER_GROUP.NAME]: '',
  [ADD_USER_GROUP.DESCRIPTION]: '',
};

const PermissionGroupsForm = ({ onSubmit, initialValues, open, onClose, isLoading }) => {
  const handleCreatePermGroup = () => {
    if (!formik.isValid) return;

    onSubmit(formik);
  };

  const formik = useFormik({
    initialValues: initialValues ?? FORMIK_ADD_USER_GROUP_INIT_STATE,
    validationSchema: ADD_PERMISSION_GROUP_VALIDATION_SCHEMA,
    validateOnMount: !!initialValues,
    onSubmit: handleCreatePermGroup,
  });

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="512px"
      title={`${initialValues ? 'Edit' : 'Create'} Permission Group`}
      actions={
        <StyledFlex direction="row" justifyContent="flex-end" width="100%">
          <StyledLoadingButton
            primary
            variant="contained"
            onClick={formik.submitForm}
            disabled={!formik.isValid}
            loading={isLoading}
          >
            {initialValues ? 'Edit' : 'Create'}
          </StyledLoadingButton>
        </StyledFlex>
      }
    >
      <StyledFlex flex="auto" m="24px 32px 24px 28px" gap="17px">
        <ValidationInput
          label="Name"
          inputHeight="41px"
          inputProps={formik.getFieldProps(ADD_USER_GROUP.NAME)}
          errors={formik.getFieldMeta(ADD_USER_GROUP.NAME)}
        >
          <FormErrorMessage>{formik.errors[ADD_USER_GROUP.NAME]}</FormErrorMessage>
        </ValidationInput>
        <ValidationInput
          label="Description"
          isOptional
          isTextArea
          width="100%"
          margin="0 0 24px 0"
          inputProps={formik.getFieldProps(ADD_USER_GROUP.DESCRIPTION)}
        />
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default PermissionGroupsForm;

PermissionGroupsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};
