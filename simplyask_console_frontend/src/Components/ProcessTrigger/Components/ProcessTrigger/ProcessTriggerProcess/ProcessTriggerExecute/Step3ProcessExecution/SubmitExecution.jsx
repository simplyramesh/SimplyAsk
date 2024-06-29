import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import { StyledQuestionsMarkHover } from '../../StyledProcessTriggerExecuteProcess';

const SubmitExecutionButton = ({
  isExecutionDetailsFilled, isExecutionDetailsStepDisabled, submitForm,
}) => {
  const isDisabled = !isExecutionDetailsFilled() || isExecutionDetailsStepDisabled();

  return (
    <StyledTooltip
      title={isDisabled ? 'Complete all 3 steps first to submit execution' : ''}
      arrow
      placement="top"
      p="10px 15px"
      maxWidth="355px"
    >
      <StyledFlex width="217px" opacity={isDisabled ? 0.5 : 1}>
        <StyledButton
          secondary
          variant={isDisabled ? 'outlined' : 'contained'}
          onClick={submitForm}
          disabled={isDisabled}
          endIcon={isDisabled && (
            <StyledFlex mt="-2px">
              <StyledQuestionsMarkHover />
            </StyledFlex>
          )}
        >
          Submit Execution
        </StyledButton>
      </StyledFlex>
    </StyledTooltip>
  );
};

export default SubmitExecutionButton;
