import { InfoOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import ExpandMoreIcon from '../../../../../../../../Assets/icons/expand.svg?component';
import { useCycledStrings } from '../../../../../../../../hooks/useCycledStrings';
import { StyledKnowledgeBaseSlider } from '../../../../../../../Settings/Components/General/components/SimplyAssistantKnowledgeBases/StyledSimplyAssistantKnowledgeBases';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import RadioGroupSet from '../../../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import AutocompleteExpandedModal from '../../../../../../../shared/REDISIGNED/modals/AutocompleteExpandedModal/AutocompleteExpandedModal';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  StyledDivider,
  StyledFlex,
  StyledIconButton,
  StyledRadio,
  StyledTextareaAutosize,
  StyledTextField,
} from '../../../../../../../shared/styles/styled';
import Switch from '../../../../../../../SwitchWithText/Switch';
import CustomAccordion from '../../../../../../shared/components/CustomAccordion/CustomAccordion';
import { PROMPT_SYMPLY_INPUT_EXPANDED_TYPES } from '../../../../constants/stepDelegates';
import { KNOWLEDGE_SOURCE_TYPES } from '../../../../constants/steps';
import KnowledgeBaseSelect from '../KnowledgeBaseSelect/KnowledgeBaseSelect';
import ModelSelect from '../ModelSelect/ModelSelect';

const PromptSymplyAsistant = ({ stepItem, onChange }) => {
  const [showExpandedInput, setShowExpandedInput] = useState(null);

  const promptPlaceholder = useCycledStrings([
    `Greet {user_name}`,
    `Look up answer to question: {user_question}`,
    `List some restaurant recommendations in {location}`,
    `Tell me a joke`,
    `Generate a happy birthday message`,
  ]);

  return (
    <>
      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel
            label="Knowledge Source"
            name="knowledgeSource"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip
            arrow
            placement="top"
            title="Select the knowledge base the AI model will generate answers from"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledFlex>
          <RadioGroupSet name="delay" onChange={(e) => onChange(e.target.name, 'knowledgeSource')}>
            <StyledRadio
              checked={KNOWLEDGE_SOURCE_TYPES.AI_MODEL === stepItem.data.knowledgeSource}
              name={KNOWLEDGE_SOURCE_TYPES.AI_MODEL}
              label="AI Model"
            />
            <StyledRadio
              checked={KNOWLEDGE_SOURCE_TYPES.CUSTOM === stepItem.data.knowledgeSource}
              name={KNOWLEDGE_SOURCE_TYPES.CUSTOM}
              label="Custom Knowledge Base"
            />
            <StyledRadio
              checked={KNOWLEDGE_SOURCE_TYPES.AUGMENTED === stepItem.data.knowledgeSource}
              name={KNOWLEDGE_SOURCE_TYPES.AUGMENTED}
              label="Custom Knowledge Base + AI Model"
            />
          </RadioGroupSet>
        </StyledFlex>
      </StyledFlex>

      {stepItem.data.knowledgeSource !== KNOWLEDGE_SOURCE_TYPES.AI_MODEL && (
        <KnowledgeBaseSelect
          value={stepItem.data.knowledgeBase}
          onChange={(value) => onChange(value, 'knowledgeBase')}
          invalid={false}
          toolTipText="Select the knowledge base the AI Model can use to generate responses"
        />
      )}

      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel label="Prompt / Query" name="prompt" isOptional={false} size={15} weight={600} mb={0} lh={24} />
          <StyledTooltip
            arrow
            placement="top"
            title="Maximum data length of 6,144 tokens. Note that 1 token is roughly 4 English characters"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledFlex position="relative">
          <StyledTextareaAutosize
            placeholder={promptPlaceholder}
            minRows={1}
            value={stepItem.data.prompt}
            onChange={(e) => onChange(e.target.value, 'prompt')}
            invalid={stepItem.data.errors?.prompt}
          />
          <StyledFlex position="absolute" right="10px" bottom="5px">
            <StyledIconButton
              iconSize="25px"
              size="30px"
              onClick={() => setShowExpandedInput(PROMPT_SYMPLY_INPUT_EXPANDED_TYPES.PROMPT)}
            >
              <ExpandMoreIcon />
            </StyledIconButton>
          </StyledFlex>
        </StyledFlex>

        <AutocompleteExpandedModal
          autocomplete={false}
          open={showExpandedInput === PROMPT_SYMPLY_INPUT_EXPANDED_TYPES.PROMPT}
          value={stepItem.data.prompt}
          onConfirm={(val) => {
            onChange(val, 'prompt');
            setShowExpandedInput(null);
          }}
          onClose={() => setShowExpandedInput(null)}
        >
          {(localValue, setLocalValue) => (
            <StyledTextareaAutosize
              placeholder={promptPlaceholder}
              minRows={15}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
            />
          )}
        </AutocompleteExpandedModal>
      </StyledFlex>

      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel
            label="Output Parameter: Response"
            name="outputParameterResponse"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip arrow placement="top" title="Stores the generated response from the AI model" p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledTextareaAutosize
          minRows={1}
          placeholder="Enter text..."
          value={stepItem.data.outputParameterResponse}
          onChange={(e) => onChange(e.target.value, 'outputParameterResponse')}
          invalid={stepItem.data.errors?.outputParameterResponse}
        />
      </StyledFlex>

      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel
            label="Output Parameter: Source References"
            name="outputParameterSource"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip
            arrow
            placement="top"
            title="Stores a list of references used to generate the Response to a Process parameter for use in later steps"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledTextareaAutosize
          minRows={1}
          placeholder="Enter text..."
          value={stepItem.data.outputParameterSource}
          onChange={(e) => onChange(e.target.value, 'outputParameterSource')}
          invalid={stepItem.data.errors?.outputParameterSource}
        />
      </StyledFlex>

      <StyledDivider m="0" />

      <CustomAccordion title="Context">
        <StyledFlex gap="30px">
          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel label="Context" name="context" isOptional size={15} weight={600} mb={0} lh={24} />
              <StyledTooltip
                arrow
                placement="top"
                title="Maximum data length of 2,048 tokens. Note that 1 token is roughly 4 English characters"
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <StyledFlex position="relative">
              <StyledTextareaAutosize
                minRows={1}
                placeholder="Enter text…"
                value={stepItem.data.context}
                onChange={(e) => onChange(e.target.value, 'context')}
                invalid={stepItem.data.errors?.context}
              />
              <StyledFlex position="absolute" right="10px" bottom="5px">
                <StyledIconButton
                  iconSize="25px"
                  size="30px"
                  onClick={() => setShowExpandedInput(PROMPT_SYMPLY_INPUT_EXPANDED_TYPES.CONTEXT)}
                >
                  <ExpandMoreIcon />
                </StyledIconButton>
              </StyledFlex>
              <AutocompleteExpandedModal
                open={showExpandedInput === PROMPT_SYMPLY_INPUT_EXPANDED_TYPES.CONTEXT}
                value={stepItem.data.context}
                onConfirm={(val) => {
                  onChange(val, 'context');
                  setShowExpandedInput(null);
                }}
                onClose={() => setShowExpandedInput(null)}
              >
                {(localValue, setLocalValue) => (
                  <StyledTextareaAutosize
                    placeholder="Enter text…"
                    minRows={15}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                  />
                )}
              </AutocompleteExpandedModal>
            </StyledFlex>
          </StyledFlex>
          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel
                label="Enhance Queries"
                name="enhanceQuery"
                isOptional={false}
                size={15}
                weight={600}
                mb={0}
                lh={24}
              />
              <StyledTooltip arrow placement="top" title="Enhance Queries" p="10px 15px">
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <Switch
              id="enhanceQuery"
              activeLabel=""
              inactiveLabel=""
              checked={stepItem.data.enhanceQuery}
              onChange={() => onChange(!stepItem.data.enhanceQuery, 'enhanceQuery')}
            />
          </StyledFlex>
          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel label="Guidance" name="guidance" isOptional size={15} weight={600} mb={0} lh={24} />
              <StyledTooltip
                arrow
                placement="top"
                title={`Provides instructions / rules on how to generate the response. For example "You must respond in all upper case characters."`}
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <StyledFlex position="relative">
              <StyledTextareaAutosize
                minRows={1}
                placeholder="Enter text…"
                value={stepItem.data.guidance}
                onChange={(e) => onChange(e.target.value, 'guidance')}
                invalid={stepItem.data.errors?.guidance}
              />
              <StyledFlex position="absolute" right="10px" bottom="5px">
                <StyledIconButton
                  iconSize="25px"
                  size="30px"
                  onClick={() => setShowExpandedInput(PROMPT_SYMPLY_INPUT_EXPANDED_TYPES.GUIDANCE)}
                >
                  <ExpandMoreIcon />
                </StyledIconButton>
              </StyledFlex>
              <AutocompleteExpandedModal
                open={showExpandedInput === PROMPT_SYMPLY_INPUT_EXPANDED_TYPES.GUIDANCE}
                value={stepItem.data.guidance}
                onConfirm={(val) => {
                  onChange(val, 'guidance');
                  setShowExpandedInput(null);
                }}
                onClose={() => setShowExpandedInput(null)}
              >
                {(localValue, setLocalValue) => (
                  <StyledTextareaAutosize
                    placeholder="Enter text…"
                    minRows={15}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                  />
                )}
              </AutocompleteExpandedModal>
            </StyledFlex>
          </StyledFlex>
          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel
                label="Max Included Conversation Messages"
                name="maxIncludedMessages"
                isOptional={false}
                size={15}
                weight={600}
                mb={0}
                lh={24}
              />
              <StyledTooltip
                arrow
                placement="top"
                title="Limits the number of previous conversation messages included as context for the AI model. A larger number increases the amount of context the AI model has but also increases the amount of SimplyAssistant Tokens used."
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="30px">
              <StyledKnowledgeBaseSlider
                name="maxIncludedMessages"
                value={stepItem.data.maxIncludedMessages}
                min={0}
                max={40}
                step={1}
                onChange={(e, val) => onChange(parseFloat(val), 'maxIncludedMessages')}
              />
              <StyledFlex width="60px">
                <StyledTextField
                  readOnly
                  placeholder=""
                  value={stepItem.data.maxIncludedMessages}
                  onChange={(e) => onChange(parseFloat(e.target.value), 'maxIncludedMessages')}
                  variant="standard"
                  height="41px"
                  p="4px 10px"
                  invalid={stepItem.data.errors?.outputParameterSource}
                />
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        </StyledFlex>
      </CustomAccordion>

      <StyledDivider m="0" />

      <CustomAccordion title="Response Format">
        <StyledFlex gap="30px">
          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel label="Persona" name="persona" isOptional size={15} weight={600} mb={0} lh={24} />
              <StyledTooltip
                arrow
                placement="top"
                title="Configure a specific writing style to align with your use case"
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <StyledTextField
              placeholder="[placeholder text]..."
              value={stepItem.data.persona}
              onChange={(e) => onChange(e.target.value, 'persona')}
              variant="standard"
              height="41px"
              p="4px 10px"
            />
          </StyledFlex>

          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel
                label="Max Response Length (Number of Tokens)"
                name="maxResponseLength"
                isOptional={false}
                size={15}
                weight={600}
                mb={0}
                lh={24}
              />
              <StyledTooltip
                arrow
                placement="top"
                title="Controls the max response length. Note that 1 token is roughly 4 English characters"
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="30px">
              <StyledKnowledgeBaseSlider
                name="maxIncludedMessages"
                value={stepItem.data.maxResponseLength}
                min={1}
                max={2000}
                step={1}
                onChange={(e, val) => onChange(parseFloat(val), 'maxResponseLength')}
              />
              <StyledFlex width="80px">
                <StyledTextField
                  readOnly
                  placeholder=""
                  value={stepItem.data.maxResponseLength}
                  onChange={(e) => onChange(parseFloat(e.target.value), 'maxResponseLength')}
                  variant="standard"
                  height="41px"
                  p="4px 10px"
                  invalid={stepItem.data.errors?.maxResponseLength}
                />
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>

          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel
                label="Response Variability (Temperature)"
                name="responseVariability"
                isOptional={false}
                size={15}
                weight={600}
                mb={0}
                lh={24}
              />
              <StyledTooltip
                arrow
                placement="top"
                title="Controls randomness of response. The system will return more deterministic and repetitive responses when the value is closer to 0"
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="30px">
              <StyledKnowledgeBaseSlider
                name="responseVariability"
                value={stepItem.data.responseVariability}
                min={0.1}
                max={1}
                step={0.1}
                onChange={(e, val) => onChange(parseFloat(val), 'responseVariability')}
              />
              <StyledFlex width="80px">
                <StyledTextField
                  readOnly
                  placeholder=""
                  value={stepItem.data.responseVariability}
                  onChange={(e) => onChange(parseFloat(e.target.value), 'responseVariability')}
                  variant="standard"
                  height="41px"
                  p="4px 10px"
                  invalid={stepItem.data.errors?.responseVariability}
                />
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>

          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel
                label="Validate Response Before Sending"
                name="validateBeforeSending"
                isOptional={false}
                size={15}
                weight={600}
                mb={0}
                lh={24}
              />
              <StyledTooltip
                arrow
                placement="top"
                title="If 'Yes', will perform a secondary check on the output to increase response accuracy"
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <Switch
              id="validateBeforeSending"
              activeLabel=""
              inactiveLabel=""
              checked={stepItem.data.validateBeforeSending}
              onChange={() => onChange(!stepItem.data.validateBeforeSending, 'validateBeforeSending')}
            />
          </StyledFlex>

          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel
                label="Include References in Response"
                name="includeReferences"
                isOptional={false}
                size={15}
                weight={600}
                mb={0}
                lh={24}
              />
              <StyledTooltip
                arrow
                placement="top"
                title="If 'Yes', references will be included in-line in the response"
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <Switch
              id="includeReferences"
              activeLabel=""
              inactiveLabel=""
              checked={stepItem.data.includeReferences}
              onChange={() => onChange(!stepItem.data.includeReferences, 'includeReferences')}
            />
          </StyledFlex>

          <StyledFlex>
            <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
              <InputLabel
                label="Translate Output to Input Prompt Language"
                name="translateOutput"
                isOptional={false}
                size={15}
                weight={600}
                mb={0}
                lh={24}
              />
              <StyledTooltip
                arrow
                placement="top"
                title="If 'Yes', will automatically translate the Response to the language of the Prompt"
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <Switch
              id="translateOutput"
              activeLabel=""
              inactiveLabel=""
              checked={stepItem.data.translateOutput}
              onChange={() => onChange(!stepItem.data.translateOutput, 'translateOutput')}
            />
          </StyledFlex>
        </StyledFlex>
      </CustomAccordion>

      <StyledDivider m="0" />

      <CustomAccordion title="Model">
        <ModelSelect value={stepItem.data.model} onChange={(value) => onChange(value, 'model')} invalid={false} />
      </CustomAccordion>
    </>
  );
};

export default PromptSymplyAsistant;
