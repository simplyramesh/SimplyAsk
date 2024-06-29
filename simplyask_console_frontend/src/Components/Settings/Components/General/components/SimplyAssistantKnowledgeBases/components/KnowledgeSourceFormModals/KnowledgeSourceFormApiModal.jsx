import React from 'react'
import { StyledDivider, StyledFlex, StyledSwitch, StyledTextField } from '../../../../../../../shared/styles/styled';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import FormErrorMessage from '../../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledKnowledgeBaseSlider } from '../../StyledSimplyAssistantKnowledgeBases';
import { SLIDER_FIELD_NAMES, validateSliderChange } from '../../utils/constants';
import ApiParameter from '../ApiParameter';
import { InfoOutlined } from '@mui/icons-material';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';

const KnowledgeSourceFormApiModal = ({
  values,
  setFieldValue,
  handleBlur,
  errors,
  touched,
  shouldAutoUpdateFrequency,
  setShouldAutoUpdateFrequency
}) => {
  const isUrlInvalid = errors.source?.url && touched.source?.url;

  return (
    <>
      <StyledFlex gap="12px">
        <InputLabel size={16} label="API URL (GET Request)" mb={0} />
        <StyledFlex>
          <StyledTextField
            id="URL"
            name="url"
            placeholder="e.g abc/abv/abc/123"
            variant="standard"
            value={values.source.url}
            onChange={(e) => setFieldValue('source.url', e.target.value)}
            invalid={isUrlInvalid}
            onBlur={handleBlur}
          />
          {isUrlInvalid && <FormErrorMessage>{errors.source?.url}</FormErrorMessage>}
        </StyledFlex>
      </StyledFlex>
      <StyledDivider height="2px" m="15px 0px 15px 0px" />
      <ApiParameter
        parameterType="API Request Body Parameters"
        values={values}
        setFieldValue={setFieldValue}
        fieldName="bodyParameter"
        emptyParametersTitle="No API Request Body Parameters Have Been Added."
        isOptional
        handleBlur={handleBlur}
        errors={errors}
        touched={touched}
      />
      <StyledDivider height="2px" m="15px 0px 15px 0px" />
      <ApiParameter
        parameterType="API Request Header Parameters"
        values={values}
        setFieldValue={setFieldValue}
        fieldName="headerParameter"
        emptyParametersTitle="No API Request Header Parameters Have Been Added."
        isOptional
        handleBlur={handleBlur}
        errors={errors}
        touched={touched}
      />
      <StyledDivider height="2px" m="15px 0px 15px 0px" />
      <StyledFlex gap="17px">
        <InputLabel size={16} label="Auto-Update Frequency" mb={0} />
        <StyledFlex flexDirection="row" alignItems="center" gap="10px">
          <StyledSwitch
            checked={shouldAutoUpdateFrequency}
            onChange={(e) => setShouldAutoUpdateFrequency(e.target.checked)}
          />
          <InputLabel size={16} weight={500} label="Auto-Update Source" mb={0} />
          <StyledTooltip
            arrow
            placement="top"
            title="If toggled on, sources will be automatically updated every specified number of days in the below field"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
      </StyledFlex>
      {shouldAutoUpdateFrequency && <StyledFlex gap="12px">
        <InputLabel size={16} label="Number of Days" mb={0} />
        <StyledFlex flexDirection="row" alignItems="center" gap="30px">
          <StyledKnowledgeBaseSlider
            name={SLIDER_FIELD_NAMES.AUTO_UPDATE_FREQUENCY}
            value={Number(values.autoUpdateFrequency)}
            min={1}
            max={365}
            step={1}
            onChange={(e, val) => setFieldValue(SLIDER_FIELD_NAMES.AUTO_UPDATE_FREQUENCY, val)}
          />
          <StyledTextField
            name={SLIDER_FIELD_NAMES.AUTO_UPDATE_FREQUENCY}
            width="66px"
            fontSize="15px"
            variant="standard"
            value={values.autoUpdateFrequency}
            onChange={(e) => setFieldValue(SLIDER_FIELD_NAMES.AUTO_UPDATE_FREQUENCY,
              validateSliderChange(e.target.value, SLIDER_FIELD_NAMES.AUTO_UPDATE_FREQUENCY))}
          />
        </StyledFlex>
      </StyledFlex>}
    </>
  )
}

export default KnowledgeSourceFormApiModal;