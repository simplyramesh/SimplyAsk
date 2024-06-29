import React, { memo, useMemo } from 'react';
import { Position } from 'reactflow';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import {
  StyledStepErrorCircle, StyledSmallStep, StyledStep, StyledStepTargetHandle,
} from '../../../../../shared/components/CustomSteps/StyledStep';
import { STEP_TYPES } from '../../../../../shared/constants/steps';
import { stepDelegates } from '../../../constants/stepDelegates';
import { agentEditorStepItem, agentEditorStepsUpdate } from '../../../store';

const SwitchStep = memo(({
  id, selected, isConnectable, data,
}) => {
  const switchDelegate = stepDelegates.find((delegate) => delegate.type === STEP_TYPES.SWITCH);
  const switchSubItem = switchDelegate?.children?.find((child) => child.switchType === data.switchType);

  const { Icon } = switchSubItem || {};

  const setStepItemOpened = useSetRecoilState(agentEditorStepItem);
  const steps = useRecoilValue(agentEditorStepsUpdate);

  const connectionStarted = useMemo(() => steps.some((step) => Boolean(step.data.meta?.touched)), [steps]);

  const handleClickStep = () => {
    setStepItemOpened({
      stepId: id,
      stepType: STEP_TYPES.SWITCH,
      switchType: data.switchType,
    });
  };

  const stepErrors = data?.errors || {};
  return (
    <StyledStep
      hovered={data.meta?.hovered}
      selected={selected}
    >
      <StyledSmallStep onClick={handleClickStep}>
        <StyledFlex direction="row" alignItems="center" gap="12px" height="100%">
          {Icon && <Icon />}
          <StyledText size={16} weight={600}>{data.label}</StyledText>
          {!!Object.keys(stepErrors)?.length
          && (
            <StyledTooltip
              arrow
              placement="top"
              title="Contains Missing Fields"
              p="10px 15px"
            >
              <StyledFlex marginLeft="auto" flexShrink="0">
                <StyledStepErrorCircle inline />
              </StyledFlex>
            </StyledTooltip>
          )}
        </StyledFlex>
      </StyledSmallStep>

      <StyledStepTargetHandle
        id={`target-handle-${id}`}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        active={connectionStarted}
      />
    </StyledStep>
  );
});

export default SwitchStep;
