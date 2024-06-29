import { InfoOutlined } from '@mui/icons-material';
import React, { memo, useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import ConfigToolIcon from '../../../../../../Assets/icons/agent/generativeAgent/configToolIcon.svg?component';
import { StyledKnowledgeBaseSlider } from '../../../../../Settings/Components/General/components/SimplyAssistantKnowledgeBases/StyledSimplyAssistantKnowledgeBases';
import Switch from '../../../../../SwitchWithText/Switch';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import { StyledFlex, StyledTextField, StyledTextareaAutosize } from '../../../../../shared/styles/styled';
import ModelSelect from '../../../AgentEditor/components/sideForms/ActionsSidebar/ModelSelect/ModelSelect';
import { StyledGenerativeEditorCard } from '../../StyledGenerativeEditor';
import { generativeEditorConfigurationState } from '../../store';
import GenerativeEditorCardsHeader from '../GenerativeEditorCardsHeader/GenerativeEditorCardsHeader';

const ModelConfigurations = () => {
  const [modelConfig, setModelConfig] = useRecoilState(generativeEditorConfigurationState);

  const handleChange = useCallback((path, val) => {
    setModelConfig((prev) => setIn(prev, path, val));
  }, []);

  const {
    persona,
    model,
    enhanceQuery,
    validateResponse,
    includeReferences,
    translateOutput,
    maxResponseLength,
    responseVariability,
  } = modelConfig;

  const renderPersona = useMemo(
    () => (
      <StyledFlex gap="17px">
        <StyledFlex direction="row" alignItems="center" gap="10px">
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
        <StyledTextareaAutosize
          placeholder="[placeholder text]..."
          value={persona}
          onChange={(e) => handleChange('persona', e.target.value)}
          variant="standard"
        />
      </StyledFlex>
    ),
    [persona]
  );

  const renderModel = useMemo(
    () => <ModelSelect value={model} onChange={(value) => handleChange('model', value)} invalid={false} />,
    [model]
  );

  const renderEnhanceQueries = useMemo(
    () => (
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
          checked={enhanceQuery}
          onChange={() => handleChange('enhanceQuery', !enhanceQuery)}
        />
      </StyledFlex>
    ),
    [enhanceQuery]
  );

  const renderValidateResponse = useMemo(
    () => (
      <StyledFlex gap="17px">
        <StyledFlex direction="row" alignItems="center" gap="10px">
          <InputLabel
            label="Validate Response Before Sending"
            name="validateResponse"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip arrow placement="top" title="Validate Response Before Sending" p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <Switch
          id="validateResponse"
          activeLabel=""
          inactiveLabel=""
          checked={validateResponse}
          onChange={() => handleChange('validateResponse', !validateResponse)}
        />
      </StyledFlex>
    ),
    [validateResponse]
  );

  const renderIncludeRefferencess = useMemo(
    () => (
      <StyledFlex gap="17px">
        <StyledFlex direction="row" alignItems="center" gap="10px">
          <InputLabel
            label="Include References in Response"
            name="includeReferences"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip arrow placement="top" title="Include References in Response" p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <Switch
          id="includeReferences"
          activeLabel=""
          inactiveLabel=""
          checked={includeReferences}
          onChange={() => handleChange('includeReferences', !includeReferences)}
        />
      </StyledFlex>
    ),
    [includeReferences]
  );

  const renderTranslateOutput = useMemo(
    () => (
      <StyledFlex gap="17px">
        <StyledFlex direction="row" alignItems="center" gap="10px">
          <InputLabel
            label="Translate Output to Input Prompt Language"
            name="translateOutput"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip arrow placement="top" title="Translate Output to Input Prompt Language" p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <Switch
          id="translateOutput"
          activeLabel=""
          inactiveLabel=""
          checked={translateOutput}
          onChange={() => handleChange('translateOutput', !translateOutput)}
        />
      </StyledFlex>
    ),
    [translateOutput]
  );

  const renderMaxResponseLength = useMemo(
    () => (
      <StyledFlex gap="17px">
        <StyledFlex direction="row" alignItems="center" gap="10px">
          <InputLabel
            label="Max Response Length (Number of Tokens)"
            name="maxResponseLength"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip arrow placement="top" title="Response Variability (Temperature)" p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="30px">
          <StyledKnowledgeBaseSlider
            name="maxResponseLength"
            value={maxResponseLength}
            min={1}
            max={2000}
            step={1}
            onChange={(e, val) => handleChange('maxResponseLength', val)}
          />
          <StyledFlex width="69px">
            <StyledTextField
              readOnly
              placeholder=""
              value={maxResponseLength}
              onChange={(e) => handleChange('maxResponseLength', e.target.value)}
              variant="standard"
              height="41px"
              p="4px 10px"
            />
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
    ),
    [maxResponseLength]
  );

  const renderResponseVariability = useMemo(
    () => (
      <StyledFlex gap="17px">
        <StyledFlex direction="row" alignItems="center" gap="10px">
          <InputLabel
            label="Response Variability (Temperature)"
            name="responseVariability"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip arrow placement="top" title="Response Variability (Temperature)" p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="30px">
          <StyledKnowledgeBaseSlider
            name="responseVariability"
            value={responseVariability}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(e, val) => handleChange('responseVariability', parseFloat(val))}
          />
          <StyledFlex width="69px">
            <StyledTextField
              readOnly
              placeholder=""
              value={responseVariability}
              onChange={(e) => handleChange('responseVariability', parseFloat(e.target.value))}
              variant="standard"
              height="41px"
              p="4px 10px"
            />
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
    ),
    [responseVariability]
  );

  return (
    <StyledGenerativeEditorCard borderColor="kellyGreen" id="modelConfigurations">
      <StyledFlex gap="30px">
        <GenerativeEditorCardsHeader
          icon={<ConfigToolIcon />}
          title="Model Configurations"
          description="Configure the underlying AI model to fine-tune-Agent responses"
        />

        {renderPersona}

        {renderModel}

        {renderEnhanceQueries}

        {renderValidateResponse}

        {renderIncludeRefferencess}

        {renderTranslateOutput}

        {renderMaxResponseLength}

        {renderResponseVariability}
      </StyledFlex>
    </StyledGenerativeEditorCard>
  );
};

export default memo(ModelConfigurations);
