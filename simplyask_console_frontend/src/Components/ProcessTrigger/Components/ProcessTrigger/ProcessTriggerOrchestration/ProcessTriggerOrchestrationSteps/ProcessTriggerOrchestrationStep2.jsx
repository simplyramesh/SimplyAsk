import { useTheme } from '@emotion/react';

import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import ProcessExecutionDetails from '../../../../shared/ProcessExecutionDetails/ProcessExecutionDetails';
import { StyledQuestionsMarkHover } from '../../ProcessTriggerProcess/StyledProcessTriggerExecuteProcess';

const ProcessTriggerOrchestrationStep2 = ({
  isExecutionDetailsStepDisabled,
  isMultipleExecutions,
  setExecutionDetails,
  valueExecutionDetailsStep3,
  setFieldValueExecutionDetailsStep3,
  errorsExecutionDetailsStep3,
  isValidExecutionDetailsStep3,
  isTouchedExecutionDetailsStep3,
  isExecutionDetailsFilled,
  submitForm,
  editModeData,
  isOrchestratorMode,
}) => {
  const { colors } = useTheme();

  const isSubmitDisabled = !isExecutionDetailsFilled || isExecutionDetailsStepDisabled;

  return (
    <>
      <StyledFlex opacity={isExecutionDetailsStepDisabled ? 0.5 : 1} pb="32px">
        <StyledText weight={600} size={19} mb={14}>
          Step 2 - Define Execution Details
        </StyledText>
        {isExecutionDetailsStepDisabled ? (
          <StyledText weight={400} size={16}>
            Complete the previous step first
          </StyledText>
        ) : (
          <ProcessExecutionDetails
            isMultipleExecutions={isMultipleExecutions?.()}
            onDetailsChange={(e) => setExecutionDetails(e)}
            valueExecutionDetailsStep3={valueExecutionDetailsStep3}
            setFieldValueExecutionDetailsStep3={setFieldValueExecutionDetailsStep3}
            errorsExecutionDetailsStep3={errorsExecutionDetailsStep3}
            isValidExecutionDetailsStep3={isValidExecutionDetailsStep3}
            isTouchedExecutionDetailsStep3={isTouchedExecutionDetailsStep3}
            editModeData={editModeData}
            isOrchestratorMode={isOrchestratorMode}
          />
        )}
      </StyledFlex>

      {!editModeData && (
        <StyledFlex>
          <StyledFlex mb={4}>
            <StyledDivider borderWidth={2} color={colors.geyser} flexItem />
          </StyledFlex>

          <StyledTooltip
            title={isSubmitDisabled ? 'Complete all steps first to submit execution' : ''}
            arrow
            placement="top"
            p="10px 15px"
            maxWidth="355px"
          >
            <StyledFlex width="217px" opacity={isSubmitDisabled ? 0.5 : 1}>
              <StyledButton
                secondary
                variant={isSubmitDisabled ? 'outlined' : 'contained'}
                onClick={submitForm}
                disabled={isSubmitDisabled}
                endIcon={
                  isSubmitDisabled && (
                    <StyledFlex mt="-2px">
                      <StyledQuestionsMarkHover />
                    </StyledFlex>
                  )
                }
              >
                Submit Execution
              </StyledButton>
            </StyledFlex>
          </StyledTooltip>
        </StyledFlex>
      )}
    </>
  );
};

export default ProcessTriggerOrchestrationStep2;
