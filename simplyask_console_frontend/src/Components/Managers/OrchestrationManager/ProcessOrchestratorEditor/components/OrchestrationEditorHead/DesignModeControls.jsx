import React, { useCallback } from 'react';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { StyledLoadingButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTheme } from '@mui/material/styles';
import { useReactFlow } from 'reactflow';
import { useOrchestratorPublish } from '../../../../../../hooks/orchestrator/useOrchestratorPublish';
import { toast } from 'react-toastify';
import routes from '../../../../../../config/routes';
import { useNavigate } from 'react-router-dom';
import { getErrors } from '../../../../shared/utils/validation';
import { jobValidationSchema } from '../../utils/schemas';
import { useUpdateSteps } from '../../hooks/useUpdateSteps';
import { STEP_TYPES } from '../../../../shared/constants/steps';
import { useRecoilValue } from 'recoil';
import { orchestratorStepsUpdate } from '../../store';

const DesignModeControls = ({ orchestrator }) => {
  const navigate = useNavigate();
  const { colors, boxShadows } = useTheme();
  const { updateSteps } = useUpdateSteps();
  const steps = useRecoilValue(orchestratorStepsUpdate);

  const isPublishBtnDisabled = steps
    .filter((step) => step.type === STEP_TYPES.DEFAULT)
    .some((step) => Object.keys(step.data.errors || {}).length > 0);

  const { toObject } = useReactFlow();

  const { publishOrchestrator, isOrchestratorPublishing } = useOrchestratorPublish({
    onSuccess: () => {
      toast.success('Orchestrator has been published successfully.');
      navigate(`${routes.PROCESS_ORCHESTRATION}/${orchestrator?.id}?tab=orchestration`);
    },
    onError: () => {
      toast.error('Failed to publish Orchestrator.');
    },
  });

  const handlePublish = useCallback(() => {
    const payload = toObject();

    const hasAnyErrors = payload.nodes
      .filter((node) => node.type === STEP_TYPES.DEFAULT)
      .some((node) => {
        const errors = getErrors({
          schema: jobValidationSchema,
          data: node.data.job,
        })

        return Object.keys(errors).length > 0;
      });

    if (hasAnyErrors) {
      updateSteps(prev => {
        const errors = getErrors({
          schema: jobValidationSchema,
          data: prev.data.job,
        })

        return {
          ...prev,
          data: {
            ...prev.data,
            errors,
          },
        };
      });
    } else {
      publishOrchestrator({
        id: orchestrator?.id,
        payload,
      });
    }


  }, [orchestrator]);

  return (
    <StyledTooltip
      title={isPublishBtnDisabled ? 'You have steps with incomplete fields. These must be completed in order to publish this workflow.' : ''}
      placement="bottom-end"
      maxWidth="354px"
      radius="5px"
      textAlign="left"
      p="20px 18px"
      color={colors.primary}
      bgTooltip={colors.white}
      boxShadow={boxShadows.table}
    >
      <StyledFlex as="span">
        <StyledLoadingButton
          disabled={isPublishBtnDisabled}
          variant="contained"
          secondary
          endIcon={isPublishBtnDisabled && (<HelpOutlineIcon />)}
          onClick={handlePublish}
          loading={isOrchestratorPublishing}
        >
          Publish
        </StyledLoadingButton>
      </StyledFlex>
    </StyledTooltip>
  );
};

export default DesignModeControls;
