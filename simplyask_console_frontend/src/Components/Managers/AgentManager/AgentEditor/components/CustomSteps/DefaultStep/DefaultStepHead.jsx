import React from 'react';
import { useNodeId } from 'reactflow';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import DefaultStepHeadView from '../../../../../shared/components/CustomSteps/DefaultStepHeadView/DefaultStepHeadView';
import StepCornerContextMenu from '../../../../../shared/components/ContextMenus/StepCornerContextMenu';
import { STEP_LABEL_MAX_ROW_HEIGHT } from '../../../constants/head';

const DefaultStepHead = ({
  label,
  editing
}) => {
  const stepId = useNodeId();

  const {
    updateStep,
    duplicateStep,
    deleteSteps,
  } = useUpdateSteps();

  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    const rowHeight = e.target.scrollHeight;
    if (rowHeight <= STEP_LABEL_MAX_ROW_HEIGHT) updateStep(stepId, (prev) => setIn(prev, 'data.label', newLabel));
  };

  const handleExitFromEdit = (e) => {
    const val = e.target.value;

    if (!val) {
      updateStep(stepId, (prev) => setIn(prev, 'data.label', `Step ${stepId}`));
    }

    handleStepEdit(false);
  };

  const handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      handleExitFromEdit(e);
    }
  };

  const handleFocus = (e) => {
    const val = e.target.value;
    e.target.value = '';
    e.target.value = val;
  };

  const handleStepEdit = (val) => {
    updateStep(stepId, (prev) => setIn(prev, 'data.meta.editing', val));
  };

  const handleStepDelete = () => {
    deleteSteps([{ id: stepId }]);
  };

  const handleDuplicate = () => {
    duplicateStep(stepId);
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
    handleStepEdit(true);
  };

  return (
    <DefaultStepHeadView
      label={label}
      editing={editing}
      onChange={handleLabelChange}
      onBlur={handleExitFromEdit}
      onKeyPress={handleKeyPress}
      onFocus={handleFocus}
      onLabelClick={handleLabelClick}
      rightControls={(
        <StepCornerContextMenu
          onDelete={handleStepDelete}
          onDuplicate={handleDuplicate}
        />
      )}
    />
  );
};

export default DefaultStepHead;
