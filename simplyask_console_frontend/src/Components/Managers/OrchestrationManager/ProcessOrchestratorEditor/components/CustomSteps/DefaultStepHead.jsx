import React from 'react';
import { useNodeId } from 'reactflow';
import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import DefaultStepHeadView from '../../../../shared/components/CustomSteps/DefaultStepHeadView/DefaultStepHeadView';
import { useUpdateSteps } from '../../hooks/useUpdateSteps';
import { useRecoilValue } from 'recoil';
import { orchestratorMode } from '../../store';
import DefaultStepHeadControls from './DefaultStepHeadControls';
import { MODES } from '../../constants/config';

const DefaultStepHead = ({ job, editing }) => {
  const stepId = useNodeId();
  const mode = useRecoilValue(orchestratorMode);

  const { updateStep } = useUpdateSteps();

  const handleLabelChange = (e) => {
    e.stopPropagation();
    const newJobName = e.target.value;
    updateStep(stepId, (prev) => setIn(prev, 'data.job.jobName', newJobName));
  };

  const handleExitFromEdit = (e) => {
    e.stopPropagation();
    const val = e.target.value;

    if (!val) {
      updateStep(stepId, (prev) => setIn(prev, 'data.job.jobName', `Process ${stepId}`));
    }

    handleStepEdit(false);
  };

  const handleKeyPress = (e) => {
    e.stopPropagation();

    if (e.key === 'Enter') {
      handleExitFromEdit(e);
    }
  };

  const handleFocus = (e) => {
    e.stopPropagation();

    const val = e.target.value;
    e.target.value = '';
    e.target.value = val;
  };

  const handleStepEdit = (val) => {
    updateStep(stepId, (prev) => setIn(prev, 'data.meta.editing', val));
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
    handleStepEdit(true);
  };

  return (
    <DefaultStepHeadView
      label={job.jobName}
      editing={editing}
      editingDisabled={mode !== MODES.DESIGN}
      onChange={handleLabelChange}
      onBlur={handleExitFromEdit}
      onKeyPress={handleKeyPress}
      onFocus={handleFocus}
      onLabelClick={handleLabelClick}
      background="lavender"
      backgroundHover="lavenderHover"
      rightControls={<DefaultStepHeadControls secondary stepId={stepId} job={job} mode={mode} />}
    />
  );
};

export default DefaultStepHead;
