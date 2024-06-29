import React from 'react';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { StyledButton, StyledLoadingButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import routes from '../../../../../../config/routes';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '../../../../../../Assets/icons/EditIcon.svg?component';
import { StyledSvgIconWrap } from '../../../../shared/components/StyledFlowEditor';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { useOrchestratorExecuteFromStart } from '../../../../../../hooks/orchestrator/useOrchestratorExecuteFromStart';

const OrchestratorDetailsActions = () => {
  const navigate = useNavigate();
  const { processId } = useParams();

  const { executeOrchestrator, isOrchestratorExecuting } = useOrchestratorExecuteFromStart({
    onSuccess: ({ data }) => {
      const jobGroupExecutionId = data?.[0].jobGroupExecutionId;
      navigate(`${routes.PROCESS_ORCHESTRATION}/${processId}/history/${jobGroupExecutionId}`);
    },
  });

  return (
    <StyledFlex direction="row" gap="16px">
      <StyledLoadingButton
        variant="contained"
        tertiary
        onClick={() => executeOrchestrator(processId)}
        loading={isOrchestratorExecuting}
        startIcon={<PlayCircleOutlinedIcon width={18} />}
      >
        Execute From Start
      </StyledLoadingButton>
      <StyledButton
        variant="contained"
        secondary
        startIcon={
          <StyledSvgIconWrap width="16px" height="16px" themeFillColor="white">
            <EditIcon />
          </StyledSvgIconWrap>
        }
        onClick={() => navigate(`${routes.PROCESS_ORCHESTRATION}/${processId}/edit`)}
      >
        Edit
      </StyledButton>
    </StyledFlex>
  );
};

export default OrchestratorDetailsActions;
