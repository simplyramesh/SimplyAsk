import React from 'react';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ProcessExecutionInfo from '../../../../../shared/components/ProcessExecutionInfo/ProcessExecutionInfo';
import {
  useOrchestratorJobExecutionById
} from '../../../../../../../hooks/orchestrator/useOrchestratorJobExecutionById';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import ProcessLink from '../../../../../shared/components/ProcessLink/ProcessLink';

const OrchestratorSingleSidebar = ({ data, customActionsRef }) => {
  const { job } = data || {};

  const { isProcessFetching, processDetails } = useOrchestratorJobExecutionById({
    id: job?.id,
    jobExecutionId: job?.jobExecutionId,
  })

  if (isProcessFetching) return <Spinner inline medium />

  const handleLinkClick = (e, processLink) => {
    window.open(processLink, '_blank');
  }

  return (
    <StyledFlex p="0 0 30px 0">
      <StyledFlex p="30px" gap="18px" alignItems="flex-start">
        <StyledText size={24} weight={600}>{job?.jobName}</StyledText>
        <ProcessLink processId={job?.processId}>
          {(processLink) => (
            <StyledButton
              variant="contained"
              tertiary
              onClick={(e) => handleLinkClick(e, processLink)}
            >
              View in Process Manager
            </StyledButton>
          )}
        </ProcessLink>
      </StyledFlex>
      <ProcessExecutionInfo customActionsRef={customActionsRef} processInstanceId={processDetails?.processInstanceId} />
    </StyledFlex>
  );
};

export default OrchestratorSingleSidebar;
