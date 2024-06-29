import { useFormik } from 'formik';
import PropTypes from 'prop-types';

import { StyledLoadingButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import { ADD_USER_GROUP } from '../../../../constants/apiConstants';
import { USER_GROUP_VALIDATION_SCHEMA } from '../../../../utils/validations';
import FormErrorMessage from '../../../FormErrorMessage/FormErrorMessage';
import ValidationInput from '../../../inputs/ValidationInput/ValidationInput';

const FORMIK_ADD_USER_GROUP_INIT_STATE = {
  [ADD_USER_GROUP.NAME]: '',
  [ADD_USER_GROUP.DESCRIPTION]: '',
};

const UserGroupsModalForm = ({ onSubmit, initState, open, onClose, title, isLoading }) => {
  const INIT_STATE = initState || FORMIK_ADD_USER_GROUP_INIT_STATE;

  const handleInviteUser = async () => {
    if (!formik.isValid) return;

    onSubmit(formik);
  };

  const formik = useFormik({
    initialValues: INIT_STATE,
    validationSchema: USER_GROUP_VALIDATION_SCHEMA,
    validateOnMount: !!initState,
    onSubmit: handleInviteUser,
  });

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="512px"
      title={title}
      actions={
        <StyledFlex direction="row" justifyContent="flex-end" width="100%">
          <StyledLoadingButton
            primary
            variant="contained"
            text={initState ? 'Save' : 'Create'}
            onClick={formik.submitForm}
            disabled={!formik.isValid}
            loading={isLoading}
          >
            Create
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

export default UserGroupsModalForm;

UserGroupsModalForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initState: PropTypes.any,
};
