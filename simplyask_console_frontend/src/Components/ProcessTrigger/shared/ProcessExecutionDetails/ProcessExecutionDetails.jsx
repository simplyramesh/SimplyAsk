import { useEffect } from 'react';

import FormErrorMessage from '../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { FREQUENCY_OPTIONS } from '../../utils/constants';

import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import ProcessExecutionDetailsBanner from './ProcessExecutionDetailsBanner/ProcessExecutionDetailsBanner';
import ProcessExecutionDetailsForm from './ProcessExecutionDetailsForm/ProcessExecutionDetailsForm';

const ProcessExecutionDetails = ({
  envOptions,
  isEnvSelectAvailable = false,
  onEnvInputChange,
  onDetailsChange,
  isMultipleExecutions,
  defaultExecutionName = '',
  valueExecutionDetailsStep3 = {},
  setFieldValueExecutionDetailsStep3,
  errorsExecutionDetailsStep3,
  isValidExecutionDetailsStep3,
  isTouchedExecutionDetailsStep3,
  editModeData,
  isOrchestratorMode,
}) => {
  useEffect(() => {
    if (!isValidExecutionDetailsStep3) {
      return;
    }

    const { executionTime, executionName } = valueExecutionDetailsStep3;

    if (isOrchestratorMode) {
      onDetailsChange?.({ executionTime });
    } else {
      onDetailsChange?.(isMultipleExecutions ? { executionTime, executionName } : { executionTime });
    }
  }, [valueExecutionDetailsStep3, isMultipleExecutions, isValidExecutionDetailsStep3]);

  useEffect(() => {
    if (isMultipleExecutions && !isOrchestratorMode) {
      setFieldValueExecutionDetailsStep3('executionName', defaultExecutionName);
    }
  }, [isMultipleExecutions]);

  const getExecutionFrequency = () => valueExecutionDetailsStep3?.executionFrequency?.value;

  const handleSelectEnv = (env) => {
    setFieldValueExecutionDetailsStep3('environment', env);
  };

  return (
    <StyledFlex gap="30px" mt="16px">
      <StyledFlex gap="17px 0" maxWidth="448px">
        <StyledFlex gap="4px 0">
          <StyledText weight={600} lh={24}>
            Select Environment to Execute In
          </StyledText>
          <StyledText size={14} lh={21}>
            The chosen environment impacts the parameters values of the associated parameter sets.
          </StyledText>
        </StyledFlex>
        <CustomSelect
          options={envOptions || []}
          name="Environment"
          value={valueExecutionDetailsStep3?.environment}
          onChange={(newValue) => handleSelectEnv(newValue)}
          onInputChange={onEnvInputChange}
          getOptionLabel={(option) => option.envName}
          getOptionValue={(option) => option.envName}
          placeholder="No Environment"
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          form
          minHeight={40}
          menuPadding={0}
          hideSelectedOptions
          isDisabled={!isEnvSelectAvailable}
          noOptionsMessage={() => 'No environments found'}
          withSeparator
          isClearable
          isSearchable
          closeMenuOnSelect
          closeMenuOnScroll
        />
      </StyledFlex>

      <StyledFlex width="450px" gap="8px">
        <InputLabel label="Execution Frequency" size={16} isOptional={false} mb={6} />

        <CustomSelect
          value={valueExecutionDetailsStep3?.executionFrequency}
          onChange={(e) => setFieldValueExecutionDetailsStep3('executionFrequency', e)}
          options={FREQUENCY_OPTIONS}
          placeholder="Select Frequency"
          closeMenuOnSelect
          menuPlacement="auto"
          isClearable={false}
          isSearchable={false}
          form
        />

        {errorsExecutionDetailsStep3.executionFrequency && isTouchedExecutionDetailsStep3.executionFrequency && (
          <FormErrorMessage>{errorsExecutionDetailsStep3.executionFrequency}</FormErrorMessage>
        )}
      </StyledFlex>

      <ProcessExecutionDetailsForm
        executionFrequency={getExecutionFrequency()}
        onChange={(e) => setFieldValueExecutionDetailsStep3('executionTime', e)}
        valueExecutionDetailsStep3={valueExecutionDetailsStep3}
        editModeData={editModeData}
      />

      {valueExecutionDetailsStep3?.executionFrequency && valueExecutionDetailsStep3?.executionTime && (
        <ProcessExecutionDetailsBanner
          details={valueExecutionDetailsStep3?.executionTime}
          frequency={getExecutionFrequency()}
          isOrchestratorMode={isOrchestratorMode}
        />
      )}

      {isMultipleExecutions && (
        <StyledFlex width="450px" gap="8px" mb={2}>
          <InputLabel label="Group Name" size={16} isOptional={false} mb={6} />

          <BaseTextInput
            name="executionName"
            value={valueExecutionDetailsStep3?.executionName}
            onChange={(e) => setFieldValueExecutionDetailsStep3('executionName', e.target.value)}
          />
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default ProcessExecutionDetails;
