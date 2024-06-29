import { useFormik } from 'formik';

import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { EXPRESSION_BUILDER_DEFAULT_VALUE } from '../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import { RichTextEditor } from '../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import TagsInput from '../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex } from '../../../../shared/styles/styled';
import { createProcessOrchestration } from '../constants/validationSchemas';

const CreateOrchestrationModal = ({ isOpen, onClose, onCreateOrchestration }) => {
  const {
    values, setFieldValue, errors, touched, handleBlur, submitForm,
  } = useFormik({
    initialValues: {
      name: '',
      description: EXPRESSION_BUILDER_DEFAULT_VALUE,
      tags: [],
    },
    validationSchema: createProcessOrchestration,
    onSubmit: (submitValues, meta) => {
      onCreateOrchestration(submitValues);
      meta.resetForm();
    },
  });

  return (
    <CenterModalFixed
      open={isOpen}
      onClose={onClose}
      title="Create Orchestration"
      maxWidth="775px"
      actions={(
        <StyledButton
          primary
          variant="contained"
          onClick={submitForm}
        >
          Create
        </StyledButton>
      )}
    >
      <StyledFlex
        flex="auto"
        p="30px"
      >
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Name" isOptional={false} />
          <BaseTextInput
            name="name"
            placeholder="Enter Name for Your Orchestration..."
            value={values.name}
            onChange={(e) => setFieldValue('name', e.target.value)}
            invalid={errors.name && touched.name}
            onBlur={handleBlur}
          />
          {(errors.name && touched.name) && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Description" isOptional />
          <RichTextEditor
            onChange={(descr) => {
              setFieldValue('description', JSON.stringify(descr));
            }}
            addToolbarPlugin
          />
        </StyledFlex>
        <StyledFlex>
          <InputLabel label="Tags" isOptional />
          <TagsInput
            value={values.tags.map((option) => ({ label: option, value: option }))}
            onCreateOption={(tag) => setFieldValue('tags', [...values.tags, tag])}
            onChange={(tag) => setFieldValue('tags', tag)}
            placeholder="Enter Tags..."
          />
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default CreateOrchestrationModal;
