import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import useAgentTrainingPhrases from '../../../hooks/useAgentTrainingPhrases';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { agentEditorStepItem } from '../../../store';
import { formattedAutoGenPhrases } from '../../../utils/defaultTemplates';
import SidebarGenerateVariant from '../../../../../shared/components/SidebarGenerateVariant/SidebarGenerateVariant';
import { getErrors } from '../../../../../shared/utils/validation';
import { speakSchema } from '../../../utils/validationSchemas';

const SpeakSidebar = ({ stepItem }) => {
  const stepItemOpened = useRecoilValue(agentEditorStepItem);

  const { updateStep } = useUpdateSteps();

  const isGenerateVariantDisabled = stepItem?.data?.message?.every((msg) => !msg?.value);

  const handleChange = (value, key) => {
    updateStep(stepItemOpened?.stepId, (prev) =>
      setIn(
        prev,
        'data.stepItems',
        prev.data.stepItems.map((item) => {
          if (item.id === stepItem?.id) {
            const errors = getErrors({
              schema: speakSchema,
              data: { ...item.data, [key]: value },
            });

            return {
              ...item,
              data: {
                ...item.data,
                [key]: value,
                errors,
              },
            };
          }
          return item;
        })
      )
    );
  };

  const {
    submitIntentTrainingPhrases: submitAIPhrases,
    isSubmitIntentTrainingPhrasesLoading: isSubmitAIPhrasesLoading,
  } = useAgentTrainingPhrases({
    onSuccess: (data) => {
      const aiPhrases = formattedAutoGenPhrases(data);

      handleChange([...stepItem?.data.message, ...aiPhrases], 'message');
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const onGenerateVariant = (num) => {
    const searchQuery = new URLSearchParams({
      noOfPhrases: num,
      isTrainingBot: false,
      intents: stepItem?.data?.message?.map((item) => item.value),
    });

    const payload = {
      params: searchQuery.toString(),
    };

    submitAIPhrases(payload);
  };

  return (
    <StyledFlex gap="30px">
      {isSubmitAIPhrasesLoading && <Spinner fadeBgParent medium />}
      <SidebarGenerateVariant
        values={stepItem?.data.message}
        onChange={(val) => handleChange(val, 'message')}
        label="Message"
        addButtonText="Add Variant"
        btnTooltipTitle="You must type at least 1 message in order to auto-generate a variants"
        inputPlaceholder="Enter a message..."
        isGenerateVariantDisabled={isGenerateVariantDisabled}
        onGenerateVariant={onGenerateVariant}
        errors={stepItem?.data.errors?.message}
        touched={stepItem?.data.errors?.message}
      />
    </StyledFlex>
  );
};

export default SpeakSidebar;
