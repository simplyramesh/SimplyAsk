import { InputLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import BaseTextInput from '../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex } from '../../../../../../../shared/styles/styled';
import FormErrorMessage from '../../../../FormErrorMessage/FormErrorMessage';

const EditAPIKeyModal = ({
  open, value, onSubmit, onClose,
}) => {
  const {
    values, errors, handleChange, touched, handleBlur, handleSubmit,
  } = useFormik({
    initialTouched: false,
    initialValues: {
      name: value,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('An API key name is required'),
    }),
    onSubmit,
  });

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="600px"
      title="Edit API Key"
      actions={(
        <StyledFlex direction="row" justifyContent="flex-end" width="100%">
          <StyledButton
            primary
            variant="contained"
            type="submit"
            onClick={handleSubmit}
          >
            Save
          </StyledButton>
        </StyledFlex>
      )}
    >
      <StyledFlex p="24px">
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="API Key Name" />
          <BaseTextInput
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            invalid={errors.name && touched.name}
            onBlur={handleBlur}
          />
          {(errors.name && touched.name) && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default EditAPIKeyModal;
