import React, { memo, useMemo } from 'react';
import { StyledDefaultStep, StyledDefaultStepBody, StyledStep, StyledStepErrorCircle, StyledStepTargetHandle } from '../../../../shared/components/CustomSteps/StyledStep';
import { Position } from 'reactflow';
import DefaultStepHead from './DefaultStepHead';
import { useRecoilValue } from 'recoil';
import { orchestratorMode, orchestratorStepsUpdate } from '../../store';
import DefaultStepItem from './DefaultStepItem';
import { MODES } from '../../constants/config';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';


const DefaultStep = ({ id, data, isConnectable, selected }) => {
  const steps = useRecoilValue(orchestratorStepsUpdate);
  const mode = useRecoilValue(orchestratorMode);
  const { job, transitions, meta, errors } = data;

  const connectionStarted = useMemo(() => {
    return steps.some((step) => Boolean(step.data.meta?.touched));
  }, [steps]);

  return (
    <StyledStep
      hovered={meta?.hovered}
      selected={selected}
      status={job?.status}
      mode={mode}
    >
      <StyledDefaultStep>
        <DefaultStepHead job={job} editing={meta?.editing} />
        <StyledDefaultStepBody p="0">
          <DefaultStepItem transitions={transitions} job={data.job} />
          {Object.keys(errors || {}).length > 0 && mode === MODES.DESIGN && (
            <StyledTooltip
              arrow
              placement="top"
              title="Contains Missing Fields"
              p="10px 15px"
            >
              <StyledStepErrorCircle />
            </StyledTooltip>
          )}
        </StyledDefaultStepBody>

        <StyledStepTargetHandle
          id={`target-handle-${id}`}
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          active={connectionStarted}
        />
      </StyledDefaultStep>
    </StyledStep>
  );
};

export default memo(DefaultStep);
