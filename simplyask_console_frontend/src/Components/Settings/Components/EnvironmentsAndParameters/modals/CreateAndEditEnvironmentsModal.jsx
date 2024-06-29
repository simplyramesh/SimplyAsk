import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';

import { useCreateEnvironment } from '../../../../../hooks/environments/useCreateEnvironment';
import { useUpdateEnvironment } from '../../../../../hooks/environments/useUpdateEnvironment';
import BaseTextArea from '../../../../shared/REDISIGNED/controls/BaseTextArea/BaseTextArea';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import FormErrorMessage from '../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';

const CreateAndEditEnvironmentsModal = ({
  openEnvironmentModal, setOpenEnvironmentModal, setClickedTableRow, clickedTableRow,
}) => {
  const createEnvSchema = Yup.object().shape({
    envName: Yup.string()
      .nullable()
      .required('Name is required')
      .test(
        'is-valid-env-name',
        'Invalid environment name',
        (value) => value && !/no\s*environment/i.test(value),
      ),
  });

  const { createEnvironmentFn } = useCreateEnvironment();
  const { updateEnvironmentFn } = useUpdateEnvironment();

  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    resetForm,
    submitForm,
  } = useFormik({
    initialValues: {
      envName: '',
      description: '',
    },
    validationSchema: createEnvSchema,
    onSubmit: (localValues) => {
      if (clickedTableRow?.id) {
        updateEnvironmentFn({
          envId: clickedTableRow?.id,
          updatedValues: { ...localValues, id: clickedTableRow?.id },
        });
      } else {
        createEnvironmentFn(localValues);
      }
      resetForm();
      setClickedTableRow(null);
      setOpenEnvironmentModal(false);
    },
  });

  useEffect(() => {
    if (openEnvironmentModal && clickedTableRow) {
      setFieldValue('envName', clickedTableRow.envName);
      setFieldValue('description', clickedTableRow.description);
    }
  }, [openEnvironmentModal, clickedTableRow]);

  return (
    <CenterModalFixed
      open={openEnvironmentModal}
      onClose={() => {
        resetForm();
        setClickedTableRow(null);
        setOpenEnvironmentModal(false);
      }}
      maxWidth="745px"
      title={(
        <StyledText size={20} weight={600}>
          {clickedTableRow?.id ? 'Edit Environment' : 'Create Environment'}
        </StyledText>
      )}
      actions={(
        <StyledFlex direction="row" gap="15px">
          <StyledButton
            primary
            variant="contained"
            onClick={submitForm}
          >
            {clickedTableRow?.id ? 'Save' : 'Create'}
          </StyledButton>
        </StyledFlex>

      )}
    >
      <StyledFlex
        flex="auto"
        p="25px"
      >
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Name" isOptional={false} />
          <BaseTextInput
            name="envName"
            placeholder="Enter Name of the environment..."
            value={values.envName}
            onChange={(e) => setFieldValue('envName', (e.target.value))}
            invalid={errors.envName && touched.envName}
            onBlur={handleBlur}
          />
          {(errors.envName && touched.envName) && <FormErrorMessage>{errors.envName}</FormErrorMessage>}
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%">
          <InputLabel label="Description" size={16} mb={10} isOptional />
          <BaseTextArea
            name="description"
            placeholder="Enter Description of the environment..."
            value={values.description}
            onChange={(e) => setFieldValue('description', (e.target.value))}
            height="100px"
          />
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default CreateAndEditEnvironmentsModal;
