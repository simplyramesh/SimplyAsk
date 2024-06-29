import { useTheme } from '@emotion/react';
import { keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useGetEnvironments } from '../../../../../../hooks/environments/useGetEnvironments';
import { useGetParametersSet } from '../../../../../../hooks/environments/useGetParametersSet';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import ProcessExecutionDetails from '../../../../shared/ProcessExecutionDetails/ProcessExecutionDetails';
import SubmitExecutionButton from './Step3ProcessExecution/SubmitExecution';

const ProcessTriggerExecute = ({
  selectedProcess,
  isExecutionDetailsStepDisabled,
  isMultipleExecutions,
  setExecutionDetails,
  getDefaultExecutionName,
  valueExecutionDetailsStep3,
  setFieldValueExecutionDetailsStep3,
  errorsExecutionDetailsStep3,
  isValidExecutionDetailsStep3,
  isTouchedExecutionDetailsStep3,
  isExecutionDetailsFilled,
  submitForm,
  editModeData,
}) => {
  const { colors } = useTheme();

  const [debouncedEnv, setDebouncedEnv] = useState('');
  const debounced = useDebouncedCallback(
    (value) => {
      setDebouncedEnv(value);
    },
    300,
    { leading: true }
  );

  const filterParams = {
    pageSize: 100,
    workflowsInUse: Array.isArray(selectedProcess) ? selectedProcess : [selectedProcess],
  };
  const filterQueryParams = new URLSearchParams(filterParams).toString();

  const { data: paramSetEnvData } = useGetParametersSet({
    payload: { filter: filterQueryParams },
    options: {
      enabled: !!selectedProcess,
      select: (data) => {
        const isEnvSelectAvailable = data?.content?.some(
          (paramSet) => Object.keys(paramSet?.envSpecificParameters || {}).length > 0
        );

        const getEnvironmentOptions = (resData) =>
          resData?.content?.reduce((acc, paramSet) => [...acc, ...(paramSet?.associatedEnvironments ?? [])], []);

        return {
          environments: isEnvSelectAvailable ? getEnvironmentOptions(data) : [],
          isEnvSelectAvailable,
        };
      },
    },
  });

  const envQueryParams = new URLSearchParams({ searchText: debouncedEnv, pageSize: 5 }).toString();

  const { data: envData } = useGetEnvironments(
    {
      payload: { filter: envQueryParams },
      enabled: paramSetEnvData?.isEnvSelectAvailable,
    },
    {
      select: (data) => {
        return data?.content?.reduce((acc, env) => {
          if (paramSetEnvData?.environments?.includes(env?.envName)) return [...acc, env];

          return acc;
        }, []);
      },
      placeholderData: keepPreviousData,
      staleTime: 1000,
    }
  );

  const handleEnvInputChange = (value) => debounced(value);

  return (
    <>
      <StyledFlex opacity={isExecutionDetailsStepDisabled() ? 0.5 : 1} pb="32px">
        <StyledText weight={600} size={19} mb={14}>
          Step 3 - Define Execution Details
        </StyledText>
        {isExecutionDetailsStepDisabled() ? (
          <StyledText weight={400} size={16}>
            Complete the previous step first
          </StyledText>
        ) : (
          <ProcessExecutionDetails
            envOptions={envData || []}
            isEnvSelectAvailable={paramSetEnvData?.isEnvSelectAvailable}
            onEnvInputChange={handleEnvInputChange}
            isMultipleExecutions={isMultipleExecutions()}
            onDetailsChange={(e) => setExecutionDetails(e)}
            defaultExecutionName={getDefaultExecutionName()}
            valueExecutionDetailsStep3={valueExecutionDetailsStep3}
            setFieldValueExecutionDetailsStep3={setFieldValueExecutionDetailsStep3}
            errorsExecutionDetailsStep3={errorsExecutionDetailsStep3}
            isValidExecutionDetailsStep3={isValidExecutionDetailsStep3}
            isTouchedExecutionDetailsStep3={isTouchedExecutionDetailsStep3}
            editModeData={editModeData}
          />
        )}
      </StyledFlex>

      {!editModeData && (
        <StyledFlex>
          <StyledFlex mb={4}>
            <StyledDivider borderWidth={2} color={colors.geyser} flexItem />
          </StyledFlex>

          <SubmitExecutionButton
            isExecutionDetailsFilled={isExecutionDetailsFilled}
            isExecutionDetailsStepDisabled={isExecutionDetailsStepDisabled}
            submitForm={submitForm}
          />
        </StyledFlex>
      )}
    </>
  );
};

export default ProcessTriggerExecute;
