import React from 'react';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { InfoOutlined } from '@mui/icons-material';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import useAiModels from '../../../../../../../Settings/Components/General/components/SimplyAssistantKnowledgeBases/hooks/useAiModels';

const ModelSelect = ({ value, onChange, invalid }) => {
  const { aiModels } = useAiModels();

  const options =
    aiModels?.map(({ displayName, modelId, tokenMultiplier }) => ({
      label: { displayName, tokenMultiplier },
      value: modelId,
    })) || [];

  return (
    <StyledFlex>
      <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
        <InputLabel label="Model" name="model" isOptional={false} size={15} weight={600} mb={0} lh={24} />
        <StyledTooltip
          arrow
          placement="top"
          title="Select the AI model you would like to use for generating responses. Note that different models have different token multipliers and will perform differently based on their areas of strength."
          p="10px 15px"
        >
          <InfoOutlined fontSize="inherit" />
        </StyledTooltip>
      </StyledFlex>
      <StyledFlex gap="10px">
        <CustomSelect
          formatOptionLabel={({ label: { displayName, tokenMultiplier } }, meta) => (
            <StyledFlex width="100%" direction="row" alignItems="center" justifyContent="space-between">
              <StyledFlex>{displayName}</StyledFlex>
              {meta.context === 'menu' && (
                <StyledFlex>
                  <StyledText weight={500}>{tokenMultiplier} x tokens</StyledText>
                </StyledFlex>
              )}
            </StyledFlex>
          )}
          menuPlacement="auto"
          placeholder="Select Model..."
          options={options}
          getOptionValue={({ value }) => value}
          getValues={({ value }) => value}
          closeMenuOnSelect
          isClearable={false}
          isSearchable={false}
          value={options?.find(({ value: val }) => val == value) || options[0]}
          onChange={(val) => onChange(val.value)}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          maxHeight={30}
          menuPadding={0}
          controlTextHidden
          menuPortalTarget={document.body}
          form
          invalid={invalid}
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default ModelSelect;
