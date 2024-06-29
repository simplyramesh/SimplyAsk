import React from 'react';
import SidebarGenerateVariant from '../../../../../shared/components/SidebarGenerateVariant/SidebarGenerateVariant';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { useRecoilValue } from 'recoil';
import { agentEditorStepItem } from '../../../store';

const QuickRepliesSidebar = ({ stepItem }) => {
  const stepItemOpened = useRecoilValue(agentEditorStepItem);
  const { updateStep } = useUpdateSteps();

  const handleChange = (value, key) => {
    updateStep(stepItemOpened?.stepId, (prev) => setIn(prev, 'data.stepItems', prev.data.stepItems.map((item) => {
      if (item.id === stepItem.id) {
        return {
          ...item,
          data: {
            ...item.data,
            [key]: value,
          }
        };
      }
      return item;
    })));
  };

  return (
    <StyledFlex gap="30px">
      <SidebarGenerateVariant
        values={stepItem.data.quickReplies}
        onChange={(val) => handleChange(val, 'quickReplies')}
        label="Quick Replies"
        addButtonText="Add Reply"
        labelTooltipTitle="These are a list of options that will appear under the Message that a user can optionally select from to response to the Agent, rather than manually typing a response. Each Speak Block can have a maximum of 7 Quick Replies."
        inputPlaceholder="Enter a quick reply..."
        isGenerateVariantVisible={false}
        isOptional
        minItems={0}
        maxVariants={7}
        inputProps={{ maxLength: 40 }}
      />
    </StyledFlex>
  );
};

export default QuickRepliesSidebar;
