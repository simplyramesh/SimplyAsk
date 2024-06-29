import { InfoOutlined } from '@mui/icons-material';
import React from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledTextField } from '../../../../../../shared/styles/styled';
import { paramTypeOptions } from '../../../constants/common';
import useAgentTrainingPhrases from '../../../hooks/useAgentTrainingPhrases';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { agentEditorStepItem } from '../../../store';
import { formattedAutoGenPhrases } from '../../../utils/defaultTemplates';
import SidebarGenerateVariant from '../../../../../shared/components/SidebarGenerateVariant/SidebarGenerateVariant';
import { getErrors } from '../../../../../shared/utils/validation';
import { inquirySchema } from '../../../utils/validationSchemas';

const InquirySidebar = ({ stepItem }) => {
  const stepItemOpened = useRecoilValue(agentEditorStepItem);
  const { updateStep } = useUpdateSteps();

  const isGenerateVariantDisabled = stepItem?.data?.question?.every((msg) => !msg?.value);

  const handleParamsChange = (value, key) => {
    updateStep(stepItemOpened?.stepId, (prev) => setIn(prev, 'data.stepItems', prev.data.stepItems.map((item) => {
      if (item.id === stepItem.id) {
        const errors = getErrors({
          schema: inquirySchema,
          data: { ...item.data, [key]: value },
        })

        return {
          ...item,
          data: {
            ...item.data,
            [key]: value,
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

      handleParamsChange([
        ...stepItem.data.question,
        ...aiPhrases,
      ], 'question');
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const onGenerateVariant = (num) => {
    const searchQuery = new URLSearchParams({
      noOfPhrases: num,
      isTrainingBot: false,
      intents: stepItem?.data?.question?.map((item) => item.value),
    });

    const payload = {
      params: searchQuery.toString(),
    };

    submitAIPhrases(payload);
  };

  return (
    <StyledFlex gap="30px">
      { isSubmitAIPhrasesLoading && <Spinner fadeBgParent medium /> }

      <StyledFlex>
        <SidebarGenerateVariant
          values={stepItem.data.question}
          onChange={(val) => handleParamsChange(val, 'question')}
          inputPlaceholder="Enter a phrase to ask the user for information..."
          label="Question"
          addButtonText="Add Variant"
          btnTooltipTitle="You must type at least 1 question in order to auto-generate a variants"
          isGenerateVariantDisabled={isGenerateVariantDisabled}
          onGenerateVariant={onGenerateVariant}
          errors={stepItem.data.errors?.question}
          touched={stepItem.data.errors?.question}
        />
      </StyledFlex>

      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel
            label="User Response Parameter"
            name="responseParam"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip
            arrow
            placement="top"
            title="User Response Parameter"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledTextField
          placeholder="Enter a name of your parameter"
          value={stepItem.data.responseParam}
          onChange={(e) => handleParamsChange(e.target.value, 'responseParam')}
          variant="standard"
          height="41px"
          p="4px 10px"
          invalid={stepItem.data.errors?.responseParam}
        />
      </StyledFlex>

      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel
            label="Expected User Response Type"
            name="responseType"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip
            arrow
            placement="top"
            title="Expected User Response Type"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <CustomSelect
          menuPlacement="auto"
          placeholder="Select an available response type"
          options={paramTypeOptions}
          getOptionValue={({ value }) => value}
          closeMenuOnSelect
          isClearable={false}
          isSearchable={false}
          value={paramTypeOptions.find(({ value }) => value === stepItem.data.responseType)}
          onChange={({ value }) => handleParamsChange(value, 'responseType')}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: IconOption,
          }}
          maxHeight={30}
          menuPadding={0}
          controlTextHidden
          menuPortalTarget={document.body}
          form
          invalid={stepItem.data.errors?.responseType}
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default InquirySidebar;
