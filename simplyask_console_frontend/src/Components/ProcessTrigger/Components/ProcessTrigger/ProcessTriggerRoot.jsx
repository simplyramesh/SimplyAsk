// import RadioGroupSet from '../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import { useNavigationBlock } from '../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import LeavePageBlockerModal from '../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import {
  // StyledRadio,
  StyledFlex,
  StyledText,
} from '../../../shared/styles/styled';
import { TRIGGER_RADIO } from '../../utils/constants';
import ProcessTriggerOrchestration from './ProcessTriggerOrchestration/ProcessTriggerOrchestration';
import ProcessTriggerProcess from './ProcessTriggerProcess/ProcessTriggerProcess';

const ProcessTriggerRoot = ({
  onViewScheduledProcesses,
  isOrchestrationTrigger,
  isDirtySynced,
  // setIsOrchestrationTrigger,
  setIsDirtySynced,
}) => {
  const { navBlocker } = useNavigationBlock(isDirtySynced?.isDirty);

  return (
    // const onSuccessUnsavedModalClick = () => {
    //   setIsDirtySynced({ isDirty: false, isOpen: false });

    //   setIsOrchestrationTrigger(TRIGGER_RADIO.ORCHESTRATION);
    // };

    // Temp remove Process Orchestrator as per SC-4171
    // const onRadioChange = (e) => {
    //   if (isDirtySynced?.isDirty && isOrchestrationTrigger === TRIGGER_RADIO.PROCESS) {
    //     setIsDirtySynced((prev) => ({ ...prev, isOpen: true, onSuccessCallback: () => onSuccessUnsavedModalClick() }));
    //     return;
    //   }
    //   setIsOrchestrationTrigger(e.target.value);
    // };

    <StyledFlex p="35px">
      <StyledFlex>
        {/* // Temp remove Process Orchestrator as per SC-4171 */}
        {/* <StyledText weight={600} size={19}>
          Step 1  - Select Process or Orchestration
        </StyledText> */}

        <StyledText weight={600} size={19}>
          Step 1 - Select Process
        </StyledText>

        {/* <StyledFlex>
          <RadioGroupSet
            row
            name="triggerType"
            value={isOrchestrationTrigger}
            onChange={onRadioChange}
            sx={{ '.MuiFormControlLabel-label': { marginRight: '25px' } }}
          >
            <StyledRadio
              value={TRIGGER_RADIO.PROCESS}
              label="Process"
            />

            <StyledRadio
              value={TRIGGER_RADIO.ORCHESTRATION}
              label="Orchestration"
            />
          </RadioGroupSet>
        </StyledFlex> */}
      </StyledFlex>

      {isOrchestrationTrigger === TRIGGER_RADIO.PROCESS ? (
        <ProcessTriggerProcess
          onViewScheduledProcesses={onViewScheduledProcesses}
          setIsDirtySynced={setIsDirtySynced}
        />
      ) : (
        <ProcessTriggerOrchestration onViewScheduledProcesses={onViewScheduledProcesses} />
      )}

      <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={isDirtySynced?.isDirty} />

      <ConfirmationModal
        isOpen={isDirtySynced?.isOpen}
        onSuccessClick={() => setIsDirtySynced((prev) => ({ ...prev, isOpen: false }))}
        onCloseModal={() => isDirtySynced?.onSuccessCallback?.()}
        successBtnText="Stay On Page"
        cancelBtnText="Leave Page"
        alertType="WARNING"
        title="Are You Sure?"
        text="You have unsaved changes and are about to exit out of the page. If you leave, all your progress will be lost."
      />
    </StyledFlex>
  );
};

export default ProcessTriggerRoot;
