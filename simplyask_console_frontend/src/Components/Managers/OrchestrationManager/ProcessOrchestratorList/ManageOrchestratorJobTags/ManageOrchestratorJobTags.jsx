import { useFormik } from 'formik';

import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TagsInput from '../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex } from '../../../../shared/styles/styled';

const ManageOrchestratorJobTags = ({
  isOpen, onClose, group, onConfirm,
}) => {
  const isBulk = Array.isArray(group?.processId);

  const {
    values, setFieldValue, submitForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      tags: group?.tags?.map((tag) => ({ label: tag, value: tag })) || [],
      processId: group?.processId,
    },
    onSubmit: (submitValues, meta) => {
      if (!isBulk) { // NOTE: UI design is being updated for bulk update of tags
        onConfirm({
          ...submitValues,
          tags: submitValues.tags.map((tag) => tag.value),
        });
      }

      onClose();
      meta.resetForm();
    },
  });

  return (
    <CenterModalFixed
      open={isOpen}
      onClose={onClose}
      title="Manage Tags"
      maxWidth="775px"
      actions={(
        <StyledButton
          primary
          variant="contained"
          onClick={submitForm}
        >
          Confirm
        </StyledButton>

      )}
    >
      <StyledFlex p="30px" minHeight="216px">
        <InputLabel label="Tags" />
        <StyledFlex direction="row" gap="12px" alignContent="center" alignItems="center" alignSelf="stretch" flexWrap="wrap">
          <TagsInput
            value={values.tags}
            onCreateOption={(tag) => setFieldValue('tags', [...values.tags, { value: tag, label: tag }])}
            onChange={(tags) => setFieldValue('tags', tags)}
            placeholder="Enter Tags..."
          />
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default ManageOrchestratorJobTags;
