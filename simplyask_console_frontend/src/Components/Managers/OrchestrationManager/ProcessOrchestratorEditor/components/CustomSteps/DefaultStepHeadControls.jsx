import React from 'react';
import { MODES } from '../../constants/config';
import StepCornerContextMenu from '../../../../shared/components/ContextMenus/StepCornerContextMenu';
import { useUpdateSteps } from '../../hooks/useUpdateSteps';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import { StyledDefaultStepHeadIcon } from '../../../../shared/components/CustomSteps/StyledStep';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { toast } from 'react-toastify';
import routes from '../../../../../../config/routes';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { useOrchestratorExecuteById } from '../../../../../../hooks/orchestrator/useOrchestratorExecuteById';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import useOrchestratorExecutionById from '../../../../../../hooks/orchestrator/useOrchestratorExecutionById';
import { EXECUTIONS_STATUSES } from '../../../ProcessOrchestratorDetails/constants/initialValues';

const DefaultStepHeadControls = ({ secondary, stepId, job, mode }) => {
  const navigate = useNavigate();
  const { processId, executingId } = useParams();

  const { duplicateStep, deleteSteps } = useUpdateSteps();

  const { executeOrchestrator, isOrchestratorExecuting } = useOrchestratorExecuteById({
    onSuccess: ({ data }) => {
      toast.success(`Orchestrator has been executed successfully`);
      navigate(`${routes.PROCESS_ORCHESTRATION}/${processId}/history/${data.jobGroupExecutionId}`);
    },
    onError: () => {
      toast.error('Failed to execute Orchestration');
    },
  });

  const { orchestratorExecution } = useOrchestratorExecutionById({
    id: processId,
    executingId,
  });

  const { status } = orchestratorExecution || {};

  const handleStepDelete = () => {
    deleteSteps([{ id: stepId }]);
  };

  const handleDuplicate = () => {
    duplicateStep(stepId);
  };

  const handleExecute = (e) => {
    e.stopPropagation();
    executeOrchestrator(job.id);
  };

  const tooltipTitle = mode === MODES.HISTORY ? 'Re-Execution From This Step' : 'Start Execution From This Step';

  if ([EXECUTIONS_STATUSES.EXECUTING].includes(status)) return null;

  if ([MODES.VIEW, MODES.HISTORY].includes(mode)) {
    return (
      <StyledFlex marginLeft="auto" gap="5px" direction="row">
        {isOrchestratorExecuting ? (
          <StyledFlex p="0 6px">
            <Spinner extraSmall inline />
          </StyledFlex>
        ) : (
          <StyledTooltip arrow placement="top" title={tooltipTitle} p="10px 15px" maxWidth="auto">
            <StyledDefaultStepHeadIcon
              secondary={secondary}
              onClick={handleExecute}
              p="6px 6px 2px"
              backgroundHover="lavenderHover"
            >
              {mode === MODES.HISTORY ? <AutorenewIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
            </StyledDefaultStepHeadIcon>
          </StyledTooltip>
        )}
      </StyledFlex>
    );
  }

  return <StepCornerContextMenu onDelete={handleStepDelete} onDuplicate={handleDuplicate} secondary />;
};

export default DefaultStepHeadControls;
