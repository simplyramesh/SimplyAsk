import { useTheme } from '@mui/material/styles';
import React from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import RadioGroup from '../../../../../../Settings/AccessManagement/components/inputs/radio/RadioGroup';
import RadioInput from '../../../../../../Settings/AccessManagement/components/inputs/radio/RadioInput';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import {
  CONDITION_ONLY_STRING, INTENT_AND_CONDITION_STRING, INTENT_ONLY_STRING, TRANSITION_TYPE,
} from '../../../constants/common';
import useAgentIntents from '../../../hooks/useAgentIntents';
import useAgentTrainingPhrases from '../../../hooks/useAgentTrainingPhrases';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { agentEditorStepItem } from '../../../store';
import { formattedAutoGenPhrases } from '../../../utils/defaultTemplates';
import SidebarGenerateVariant from '../../../../../shared/components/SidebarGenerateVariant/SidebarGenerateVariant';

import TransitionBlockConditionOnly from './TransitionBlockConditionOnly';
import TransitionBlockIntentAndCondition from './TransitionBlockIntentAndCondition';
import TransitionBlockIntentOnly from './TransitionBlockIntentOnly';
import { useParams } from 'react-router-dom';
import { getErrors } from '../../../../../shared/utils/validation';
import { transitionSchema } from '../../../utils/validationSchemas';

const TransitionSidebar = ({ stepItem }) => {
  const { colors } = useTheme();
  const { serviceTypeId } = useParams();
  const { intents, isIntentLoading } = useAgentIntents({ agentId: serviceTypeId });
  const stepItemOpened = useRecoilValue(agentEditorStepItem);

  const { updateStep } = useUpdateSteps();

  const isGenerateVariantDisabled = stepItem?.data?.fulfillmentPhrase?.every((msg) => !msg?.value);

  const handleChange = (value, key) => {
    updateStep(stepItemOpened?.stepId, (prev) => setIn(prev, 'data.stepItems', prev.data.stepItems.map((item) => {
      if (item.id === stepItem.id) {
        const errors = getErrors({
          schema: transitionSchema,
          data: { ...item.data, [key]: value },
        })

        const updatedData = setIn(item.data, key, value);

        return {
          ...item,
          data: {
            ...updatedData,
            errors,
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
        ...stepItem.data.fulfillmentPhrase,
        ...aiPhrases,
      ], 'fulfillmentPhrase');
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const onGenerateVariant = (num) => {
    const searchQuery = new URLSearchParams({
      noOfPhrases: num,
      isTrainingBot: false,
      intents: stepItem?.data?.fulfillmentPhrase?.map((item) => item.value),
    });

    const payload = {
      params: searchQuery.toString(),
    };

    submitAIPhrases(payload);
  };

  if(isIntentLoading) return <Spinner inline small />

  return (
    <>
      <StyledFlex
        display="flex"
        gap="17px"
        alignItems="stretch"
        mr="-20px"
      >
        { isSubmitAIPhrasesLoading && <Spinner fadeBgParent medium /> }

        <RadioGroup
          orientation="row"
        >
          <RadioInput
            label={<StyledText size={15}>{INTENT_ONLY_STRING}</StyledText>}
            checked={stepItem.data.type === TRANSITION_TYPE.INTENT}
            onChange={() => handleChange(TRANSITION_TYPE.INTENT, 'type')}
            style={{ height: '18px', width: '18px' }}
          />
          <RadioInput
            label={<StyledText size={15}>{CONDITION_ONLY_STRING}</StyledText>}
            checked={stepItem.data.type === TRANSITION_TYPE.CONDITION}
            onChange={() => handleChange(TRANSITION_TYPE.CONDITION, 'type')}
            style={{ height: '18px', width: '18px' }}
          />
          <RadioInput
            label={<StyledText size={15}>{INTENT_AND_CONDITION_STRING}</StyledText>}
            checked={stepItem.data.type === TRANSITION_TYPE.INTENT_CONDITION}
            onChange={() => handleChange(TRANSITION_TYPE.INTENT_CONDITION, 'type')}
            style={{ height: '18px', width: '18px' }}
          />
        </RadioGroup>
      </StyledFlex>
      <StyledDivider borderWidth={1.5} color={colors.cardGridItemBorder} m="30px -20px 30px -20px" />
      {stepItem.data.type === TRANSITION_TYPE.INTENT && (
        <TransitionBlockIntentOnly
          intents={intents}
          isIntentLoading={isIntentLoading}
          stepItemOpened={stepItemOpened}
          stepItem={stepItem}
          onChange={handleChange}
        />
      )}
      {stepItem.data.type === TRANSITION_TYPE.CONDITION && (
        <TransitionBlockConditionOnly
          stepItemOpened={stepItemOpened}
          stepItem={stepItem}
          onChange={handleChange}
        />
      )}
      {stepItem.data.type === TRANSITION_TYPE.INTENT_CONDITION && (
        <TransitionBlockIntentAndCondition
          intents={intents}
          isIntentLoading={isIntentLoading}
          stepItemOpened={stepItemOpened}
          stepItem={stepItem}
          onChange={handleChange}
        />
      )}
      <StyledFlex
        padding="10px 0px"
        mt="30px"
      >
        <SidebarGenerateVariant
          values={stepItem.data.fulfillmentPhrase}
          onChange={(val) => handleChange(val, 'fulfillmentPhrase')}
          label="Fulfillment Phrase"
          addButtonText="Add Variant"
          btnTooltipTitle="You must type at least 1 phrase in order to auto-generate a variants"
          inputPlaceholder="Enter a phrase for when the agent in unable to collect the parameter..."
          isGenerateVariantDisabled={isGenerateVariantDisabled}
          onGenerateVariant={onGenerateVariant}
        />
      </StyledFlex>
    </>
  );
};

export default TransitionSidebar;
