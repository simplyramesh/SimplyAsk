import React from 'react';
import { StyledLoadingButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex } from '../../../../../shared/styles/styled';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloseIcon from '@mui/icons-material/Close';
import { useExecutionCancel } from '../../../../../../hooks/orchestrator/useExecutionCancel';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useOrchestratorExecutionById from '../../../../../../hooks/orchestrator/useOrchestratorExecutionById';
import { EXECUTIONS_STATUSES } from '../../../ProcessOrchestratorDetails/constants/initialValues';
import { useOrchestratorExecuteFromStart } from '../../../../../../hooks/orchestrator/useOrchestratorExecuteFromStart';
import routes from '../../../../../../config/routes';

const HistoryModeControls = () => {
  const navigate = useNavigate();
  const { processId, executingId } = useParams();

  const { orchestratorExecution, refetch } = useOrchestratorExecutionById({
    id: processId,
    executingId,
  });

  const { cancelCurrentExecution, isCancelingInProgress } = useExecutionCancel({
    onSuccess: () => {
      toast.success('Execution has been canceled successfully');
    },
    onError: () => {
      toast.error('Failed to cancel execution');
    },
  });

  const { executeOrchestrator } = useOrchestratorExecuteFromStart({
    onSuccess: ({ data }) => {
      const { jobGroupExecutionId, jobId } = data?.[0] || {};
      navigate(`${routes.PROCESS_ORCHESTRATION}/${jobId}/history/${jobGroupExecutionId}`);
    },
  });

  const handleCancelExecution = () => {
    cancelCurrentExecution({ id: processId, executingId });
  };

  const handleReExecuteFromStart = () => {
    executeOrchestrator(processId);
  };

  return (
    <StyledFlex direction="row" alignItems="center" gap="15px">
      {orchestratorExecution?.status === EXECUTIONS_STATUSES.EXECUTING ? (
        <>
          <StyledLoadingButton
            variant="outline"
            primary
            startIcon={<RefreshIcon />}
            onClick={refetch}
          >
            Refresh
          </StyledLoadingButton>
          <StyledLoadingButton
            variant="contained"
            danger
            startIcon={<CloseIcon />}
            onClick={handleCancelExecution}
            loading={isCancelingInProgress}
          >
            Cancel Execution
          </StyledLoadingButton>
        </>
      ) : (
        <StyledLoadingButton
          variant="contained"
          secondary
          startIcon={<AutorenewIcon />}
          onClick={handleReExecuteFromStart}
        >
          Re-Execute From Start
        </StyledLoadingButton>
      )}
    </StyledFlex>
  );
};

export default HistoryModeControls;
