import React from 'react';
import { useRecoilValue } from 'recoil';
import { orchestratorMode, orchestratorStepDetailsOpened, orchestratorStepsUpdate } from '../../store';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import { useUpdateSteps } from '../../../../AgentManager/AgentEditor/hooks/useUpdateSteps';
import { SIDEBAR_TYPES } from '../../utils/sidebar';
import ProcessSidebar from '../sideForms/ProcessSidebar/ProcessSidebar';
import OrchestratorExecutionSidebar from '../sideForms/OrchestratorExecutionSidebar/OrchestratorExecutionSidebar';
import { MODES } from '../../constants/config';
import OrchestratorSingleSidebar from '../sideForms/OrchestratorSingleExecutionSidebar/OrchestratorSingleSidebar';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const SidebarsCombiner = () => {
  const stepDetails = useRecoilValue(orchestratorStepDetailsOpened);
  const steps = useRecoilValue(orchestratorStepsUpdate);
  const mode = useRecoilValue(orchestratorMode);
  const { updateStep } = useUpdateSteps();
  const { type, payload } = stepDetails || {};
  const data = steps.find((step) => step.id === payload?.id);
  const handleClose = () => {
    updateStep(data?.id, (prev) => setIn(prev, 'selected', false));
  }

  return (
    <>
      {mode === MODES.HISTORY && (<OrchestratorExecutionSidebar />)}

      <CustomSidebar
        open={type === SIDEBAR_TYPES.PROCESS_EDIT}
        onClose={handleClose}
        headStyleType="filter"
        width={608}
      >
        {() => <ProcessSidebar {...data} />}
      </CustomSidebar>

      <CustomSidebar
        open={type === SIDEBAR_TYPES.PROCESS_EXECUTION_DETAILS}
        onClose={handleClose}
        width={550}
        headerTemplate={(
          <StyledFlex direction="row" alignItems="center" gap="12px">
            <StyledText weight={500}>#{data?.data.job.id}</StyledText>
            <StyledDivider
              orientation="vertical"
              borderWidth={2}
              height="14px"
            />
            <StyledText weight={500}>{data?.data.job.jobName}</StyledText>
          </StyledFlex>
        )}
      >
        {({ customActionsRef }) => <OrchestratorSingleSidebar {...data} customActionsRef={customActionsRef} />}
      </CustomSidebar>
    </>
  );
};

export default SidebarsCombiner;
