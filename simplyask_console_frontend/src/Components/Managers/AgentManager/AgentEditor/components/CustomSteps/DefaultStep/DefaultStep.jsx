import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  StyledDefaultStep,
  StyledDefaultStepBody,
  StyledStep,
  StyledStepTargetHandle
} from '../../../../../shared/components/CustomSteps/StyledStep';
import { Position } from 'reactflow';
import { stepDelegates } from '../../../constants/stepDelegates';
import { useRecoilValue } from 'recoil';
import { agentEditorStepsUpdate } from '../../../store';
import DefaultStepHead from './DefaultStepHead';
import { useStepItems } from '../../../hooks/useStepItems';
import { useCustomDrop } from '../../../../../shared/hooks/useCustomDrop';
import { STEP_ITEM_TYPES } from '../../../constants/steps';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { useStepItemsRules } from '../../../hooks/useStepItemsRules';
import StepGroup from './StepGroup';
import { getStepItemTemplate } from '../../../utils/defaultTemplates';

const DefaultStep = ({ id, data, isConnectable, selected }) => {
  const [draggingItem, setDraggingItem] = useState(null);
  const { label, stepItems, meta } = data;
  const steps = useRecoilValue(agentEditorStepsUpdate);
  const { updateStep } = useUpdateSteps();
  const { unifiedStepItems } = useStepItems({ stepItems });

  const connectionStarted = useMemo(() => {
    return steps.some((step) => Boolean(step.data.meta?.touched));
  }, [steps]);

  const handleDrop = useCallback((item) => {
    // we don't want to add the same item twice
    if (unifiedStepItems[item.type]) return false;

    updateStep(id, prev => setIn(prev, 'data.stepItems', prev.data.stepItems.concat(getStepItemTemplate(item.type))));
  }, [id, unifiedStepItems, updateStep]);

  const { dropRef, isOver } = useCustomDrop({
    accept: [
      STEP_ITEM_TYPES.PARAMETER,
      STEP_ITEM_TYPES.SPEAK,
      STEP_ITEM_TYPES.ACTION,
      STEP_ITEM_TYPES.INQUIRY,
      STEP_ITEM_TYPES.TRANSITION,
    ],
    onHover: item => setDraggingItem(item),
    onDrop: handleDrop
  }, [handleDrop]);

  useStepItemsRules(id, stepItems);

  return (
    <StyledStep
      hovered={meta?.hovered}
      selected={selected}
    >
      <StyledDefaultStep ref={dropRef}>
        <DefaultStepHead label={label} editing={meta?.editing} />
        <StyledDefaultStepBody>
          {stepDelegates.map((delegate, index) => (
            <StepGroup
              key={index}
              stepId={id}
              stepDelegate={delegate}
              unifiedStepItems={unifiedStepItems}
              draggingItem={draggingItem}
              isOver={isOver}
            />
          ))}
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
