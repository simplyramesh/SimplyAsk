import { useFormik } from 'formik';

import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TagsInput from '../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledText, StyledFlex } from '../../../../shared/styles/styled';
import { DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA } from '../../../shared/utils/validation';
import { getDuplicateAgentValidationSchema } from '../../utils/validations';

const AgentManagerDuplicateModal = ({
  data,
  isLoading,
  onClose,
  duplicateAgent,
  allAgentsOptions = [],
  headerTitle = 'Duplicate Agent',
  submitBtnTitle = 'Duplicate',
  isImportAgentModal = false,
  handleImportAgent,
}) => {
  const getInitialValues = () => ({
    name: (isImportAgentModal ? data?.name : `${data?.name} - Copy`) || '',
    description: data?.description || '',
    tags: data?.tags?.map((tag) => ({ value: tag, label: tag })) || [],
  });

  const {
    values,
    setFieldValue,
    submitForm,
    touched,
    errors,
  } = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: getDuplicateAgentValidationSchema(allAgentsOptions),
    onSubmit: (val) => {
      if (isImportAgentModal) {
        handleImportAgent?.({
          fileContent: {
            ...data?.fileContent,
            settings: {
              ...data?.fileContent?.settings,
              name: val.name,
              description: val.description,
              tags: val?.tags?.map((tag) => tag.label),
            },
          },
        });
      } else {
        duplicateAgent({
          id: data.agentId,
          body: { ...data, ...val, tags: val?.tags?.map((tag) => tag.label) },
        });
      }
    },
  });

  return (
    <CenterModalFixed
      open
      onClose={onClose}
      maxWidth="520px"
      title={(
        <StyledText size={20} weight={600}>
          {headerTitle}
        </StyledText>
      )}
      actions={(
        <StyledButton
          primary
          variant="contained"
          onClick={submitForm}
          disabled={isLoading}
        >
          {submitBtnTitle}
        </StyledButton>
      )}
    >
      <>
        {isLoading && <Spinner fadeBgParent />}
        <StyledFlex p="24px 20px">
          <StyledFlex direction="column" flex="auto" width="100%" mb="30px">
            <InputLabel label="Agent Name" size={16} mb={10} />
            <BaseTextInput
              name="name"
              placeholder="Enter Name of Agent..."
              value={values?.name}
              onChange={(e) => setFieldValue('name', (e.target.value))}
              invalid={errors.name}
              showLength
              maxLength={DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.NAME_MAX_LEN}
            />
            {(errors.name) && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </StyledFlex>
          <StyledFlex direction="column" flex="auto" width="100%" mb="30px">
            <InputLabel label="Agent Description" size={16} mb={10} />
            <BaseTextInput
              name="description"
              placeholder="Enter Description of Agent..."
              value={values?.description}
              onChange={(e) => setFieldValue('description', (e.target.value))}
              invalid={errors.description && touched.description}
              showLength
              maxLength={DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.DESCRIPTION_MAX_LEN}
            />
            {(errors.description && touched.description) && <FormErrorMessage>{errors.description}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Tags" isOptional />
            <TagsInput
              value={values?.tags}
              onCreateOption={(tag) => setFieldValue('tags', [...values?.tags, { value: tag, label: tag }])}
              onChange={(e) => setFieldValue('tags', e)}
              placeholder="Create Tags..."
            />
          </StyledFlex>
        </StyledFlex>
      </>

    </CenterModalFixed>

  );
};

export default AgentManagerDuplicateModal;
