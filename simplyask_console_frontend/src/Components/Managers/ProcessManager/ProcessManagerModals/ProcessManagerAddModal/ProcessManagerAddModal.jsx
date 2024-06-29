import { useFormik } from 'formik';
import { useRecoilState } from 'recoil';

import { organizationProcessTypes } from '../../../../../store';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TagsInput from '../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { PROCESS_DESCRIPTION_MAX_LENGTH, PROCESS_NAME_MAX_LENGTH } from '../../../shared/utils/validation';
import ProcessVisibilityInput from '../../components/ProcessVisibilityInput/ProcessVisibilityInput';
import { addNewProcessValidationSchema } from '../../utils/validations';

import { PROCESS_VISIBILITY } from '../../constants/common';

const ProcessManagerAddModal = ({ isLoading, onClose, onCreate }) => {
  const [processTypes] = useRecoilState(organizationProcessTypes);
  const processTypesOptions = processTypes?.map((type) => ({ value: type.id, label: type.name }));

  const getInitialValues = () => ({
    displayName: '',
    description: '',
    tags: [],
    processType: processTypesOptions[0],
    users: [],
    userGroups: [],
    visibility: PROCESS_VISIBILITY.ORGANIZATION,
  });

  const { values, setFieldValue, setValues, submitForm, touched, errors } = useFormik({
    initialValues: getInitialValues(),
    validationSchema: addNewProcessValidationSchema,
    onSubmit: (val) => {
      onCreate({
        ...val,
        tags: val.tags.map((tag) => ({ name: tag.label })),
        processTypeId: val.processType?.value,
      });
    },
  });

  return (
    <CenterModalFixed
      open
      onClose={onClose}
      maxWidth="775px"
      title={
        <StyledText size={20} weight={600}>
          New Process
        </StyledText>
      }
      actions={
        <StyledButton primary variant="contained" onClick={submitForm} disabled={isLoading}>
          Create
        </StyledButton>
      }
    >
      <>
        {isLoading && <Spinner fadeBgParent />}
        <StyledFlex p="30px" gap="30px">
          <StyledFlex>
            <InputLabel label="Process Name" size={16} mb={10} />
            <BaseTextInput
              name="displayName"
              placeholder="Enter Name of Process..."
              value={values?.displayName}
              onChange={(e) => setFieldValue('displayName', e.target.value)}
              invalid={errors.displayName}
              showLength
              maxLength={PROCESS_NAME_MAX_LENGTH}
            />
            {errors.displayName && <FormErrorMessage>{errors.displayName}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Process Description" size={16} mb={10} isOptional />
            <BaseTextInput
              name="description"
              placeholder="Enter Description of Process..."
              value={values?.description}
              onChange={(e) => setFieldValue('description', e.target.value)}
              invalid={errors.description && touched.description}
              showLength
              maxLength={PROCESS_DESCRIPTION_MAX_LENGTH}
            />
            {errors.description && touched.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Process Type" size={16} mb={10} />
            <CustomSelect
              options={processTypesOptions}
              value={values?.processType}
              mb={0}
              closeMenuOnSelect
              form
              onChange={(val) => setFieldValue('processType', val)}
              isClearable={false}
              isSearchable={false}
            />
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Tags" isOptional size={16} mb={10} />
            <TagsInput
              value={values?.tags}
              onCreateOption={(tag) => setFieldValue('tags', [...values?.tags, { value: tag, label: tag }])}
              onChange={(e) => setFieldValue('tags', e)}
              placeholder="Create Tags..."
            />
          </StyledFlex>

          <ProcessVisibilityInput
            value={{
              users: values?.users || [],
              userGroups: values?.userGroups || [],
              visibility: values?.visibility,
            }}
            onChange={(e) =>
              setValues({
                ...values,
                ...e,
              })
            }
          />
        </StyledFlex>
      </>
    </CenterModalFixed>
  );
};

export default ProcessManagerAddModal;
