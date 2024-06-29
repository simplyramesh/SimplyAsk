import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import {
  StyledDefaultAgentSettingsIconWrapper,
  StyledFlagPhoneNumberInput,
} from '../StyledDefaultAgentAdvancedSettings';
import CanadianFlagIcon from '../../../../../../../Assets/icons/canadianFlag.svg?component';
import FormErrorMessage from '../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { useFormik } from 'formik';
import { editPhoneNumberModalValidationSchema, onlyNumberDashRegex } from '../../../utils/validationSchemas';

const EditPhoneNumberModal = ({ isOpen, onClose, onSave }) => {
  const { values, setFieldValue, submitForm, touched, errors, resetForm } = useFormik({
    initialValues: {
      phoneNumber: '',
    },
    validationSchema: editPhoneNumberModalValidationSchema,
    onSubmit: (values, meta) => {
      onSave?.(values.phoneNumber);
      meta.resetForm();
      onClose(false);
    },
  });

  return (
    <CenterModalFixed
      open={isOpen}
      onClose={() => {
        onClose(false);
        resetForm();
      }}
      maxWidth="432px"
      title="Edit Phone Number"
      actions={
        <StyledButton primary variant="contained" onClick={submitForm}>
          Save
        </StyledButton>
      }
      footerShadow={false}
    >
      <StyledFlex direction="column" flex="auto" width="100%" p="30px 18px 0 30px">
        <StyledFlex direction="column" flex="auto">
          <StyledFlex position="relative" direction="row" flex="auto" width="100%">
            <StyledDefaultAgentSettingsIconWrapper as="span">
              <CanadianFlagIcon />
            </StyledDefaultAgentSettingsIconWrapper>
            <StyledFlagPhoneNumberInput
              name="phoneNumber"
              placeholder=""
              value={values.phoneNumber}
              onChange={(e) => {
                if (!onlyNumberDashRegex.test(e.target.value) && e.target.value !== '') return;
                setFieldValue('phoneNumber', e.target.value);
              }}
              invalid={errors.phoneNumber && touched.phoneNumber}
            />
          </StyledFlex>
          {touched.phoneNumber && errors.phoneNumber && <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>}
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default EditPhoneNumberModal;
