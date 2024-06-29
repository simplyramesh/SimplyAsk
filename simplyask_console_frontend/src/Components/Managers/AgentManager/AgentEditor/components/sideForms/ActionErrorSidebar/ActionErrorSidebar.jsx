import React from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import useAgentTrainingPhrases from '../../../hooks/useAgentTrainingPhrases';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { agentEditorStepItem } from '../../../store';
import { formattedAutoGenPhrases } from '../../../utils/defaultTemplates';
import SidebarGenerateVariant from '../../../../../shared/components/SidebarGenerateVariant/SidebarGenerateVariant';

const ActionErrorSidebar = ({ stepItem }) => {
  const stepItemOpened = useRecoilValue(agentEditorStepItem);
  const { updateStep } = useUpdateSteps();

  const isGenerateVariantDisabled = stepItem?.data?.errorMessages?.every((msg) => !msg?.value);

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

  const {
    submitIntentTrainingPhrases: submitAIPhrases,
    isSubmitIntentTrainingPhrasesLoading: isSubmitAIPhrasesLoading,
  } = useAgentTrainingPhrases({
    onSuccess: (data) => {
      const aiPhrases = formattedAutoGenPhrases(data);

      handleChange([
        ...stepItem.data.errorMessages,
        ...aiPhrases,
      ], 'errorMessages');
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const onGenerateVariant = (num) => {
    const searchQuery = new URLSearchParams({
      noOfPhrases: num,
      isTrainingBot: false,
      intents: stepItem?.data?.errorMessages?.map((item) => item.value),
    });

    const payload = {
      params: searchQuery.toString(),
    };

    submitAIPhrases(payload);
  };

  return (
    <StyledFlex gap="30px">
      { isSubmitAIPhrasesLoading && <Spinner fadeBgParent medium /> }

      <StyledText size={14}>
        When an error occurs during any Action Block, users receive an error message and are transferred to another conversation Step
      </StyledText>
      <StyledFlex>
        <SidebarGenerateVariant
          values={stepItem.data.errorMessages}
          onChange={(val) => handleChange(val, 'errorMessages')}
          inputPlaceholder="Enter a error message that will appear when an Action is unable to be performed..."
          label="Error Message"
          addButtonText="Add Variant"
          btnTooltipTitle="You must type at least 1 error message in order to auto-generate a variants"
          isGenerateVariantDisabled={isGenerateVariantDisabled}
          onGenerateVariant={onGenerateVariant}
          errors={stepItem.data.errors?.errorMessages}
          touched={stepItem.data.errors?.errorMessages}
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default ActionErrorSidebar;
