import { PriorityHighRounded } from '@mui/icons-material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTheme } from '@mui/material/styles';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useReactFlow } from 'reactflow';
import { useRecoilState, useRecoilValue } from 'recoil';

import routes from '../../../../../../config/routes';
import { useNavigationBlock } from '../../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import LeavePageBlockerModal from '../../../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import { StyledButton, StyledLoadingButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import PublishTooltip from '../../../../shared/components/PublishTooltip/PublishTooltip';
import { STEP_TYPES } from '../../../../shared/constants/steps';
import { getErrors } from '../../../../shared/utils/validation';
import { useAgentPublish } from '../../hooks/useAgentPublish';
import { useUpdateSteps } from '../../hooks/useUpdateSteps';
import { agentEditorShowIncomplete, agentEditorState, initialAgentEditorStateAfterLoad } from '../../store';
import { validationSchemasMap } from '../../utils/validation';

const AgentEditorHeadControls = () => {
  const { colors, boxShadows } = useTheme();
  const { serviceTypeId } = useParams();
  const navigate = useNavigate();
  const { updateSteps } = useUpdateSteps();

  const [showIncomplete, setShowIncomplete] = useRecoilState(agentEditorShowIncomplete);

  const { toObject } = useReactFlow();

  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  const agentEditorStateObject = useRecoilValue(agentEditorState);
  const initialAgentState = useRecoilValue(initialAgentEditorStateAfterLoad);

  const { settings, agentConfiguration, version, assignedWidgets, assignedPhoneNumbers, lastStepId, steps, edges } =
    agentEditorStateObject;

  const { navBlocker } = useNavigationBlock(isNavigationBlocked);

  const { publishAgent, isAgentPublishing } = useAgentPublish({
    onSuccess: () => {
      toast.success('Agent has been published successfully.');
      navigate(`${routes.AGENT_MANAGER}`);
    },
  });

  const removeCustomModelProperties = (agentState) => {
    try {
      const { stepsSidebarOpen, stepItemOpened, sidebarOpened, ...rest } = agentState;

      const filteredSteps = rest.steps?.map(({ width, height, data: { meta, ...restData }, ...restStep }) => ({
        ...restStep,
        data: restData,
      }));

      return { ...rest, steps: filteredSteps };
    } catch (error) {
      console.log(error);
      return agentState;
    }
  };

  const filteredInitialAgentData = useMemo(() => removeCustomModelProperties(initialAgentState), [initialAgentState]);

  const filteredCurrentAgentData = useMemo(
    () => removeCustomModelProperties(agentEditorStateObject),
    [agentEditorStateObject]
  );

  useEffect(() => {
    setIsNavigationBlocked(isAgentPublishing ? false : !isEqual(filteredInitialAgentData, filteredCurrentAgentData));
  }, [filteredCurrentAgentData]);

  const nonSwitchStepsErrorCount = steps
    .map((step) => step.data?.stepItems?.map((stepItem) => Object.keys(stepItem.data?.errors || {})?.length))
    .flat()
    .filter(Boolean).length;

  const switchStepErrorsCount =
    steps
      .filter((step) => step.type === STEP_TYPES.SWITCH)
      ?.map((item) => Object.keys(item.data?.errors || {})?.length)
      .filter(Boolean).length || 0;

  const isStartConnected =
    steps.length > 1 ? edges.some((edge) => edge.sourceHandle === STEP_TYPES.START.toLowerCase()) : true;

  const errorsCount = nonSwitchStepsErrorCount + switchStepErrorsCount;
  const hasErrors = errorsCount + (isStartConnected ? 0 : 1) > 0;

  const handlePublish = useCallback(() => {
    const { nodes, edges, viewport } = toObject();

    const withErrors = nodes
      .filter((node) => node.type === STEP_TYPES.DEFAULT || node.type === STEP_TYPES.SWITCH)
      .map((node) => (node.type === STEP_TYPES.SWITCH ? node : node.data.stepItems))
      .flat()
      .some((stepItem) => {
        const errors = getErrors({
          schema: validationSchemasMap[stepItem.type],
          data: stepItem.data,
        });

        return Object.keys(errors || {}).length > 0;
      });

    if (withErrors) {
      updateSteps((prev) => {
        if (prev?.type === STEP_TYPES.SWITCH) {
          const errors = getErrors({
            schema: validationSchemasMap[prev.type],
            data: prev.data,
          });
          return setIn(prev, 'data', { ...prev.data, errors });
        }

        return setIn(
          prev,
          'data.stepItems',
          prev.data.stepItems?.map((item) => {
            const errors = getErrors({
              schema: validationSchemasMap[item.type],
              data: item.data,
            });

            return {
              ...item,
              data: {
                ...item.data,
                errors,
              },
            };
          })
        );
      });
    } else {
      setIsNavigationBlocked(false);
      publishAgent({
        id: serviceTypeId,
        payload: {
          nodes: nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              ...(node.data.stepItems && {
                stepItems: node.data.stepItems.map((stepItem) => ({
                  ...stepItem,
                  data: JSON.stringify(stepItem.data),
                })),
              }),
            },
          })),
          edges,
          viewport,
          settings,
          ...(assignedWidgets.length && { assignedWidgets }),
          ...(assignedPhoneNumbers.length && { assignedPhoneNumbers }),
          agentConfiguration,
          lastStepId,
          version: version + 1,
        },
      });
    }
  }, [settings, agentConfiguration, version, lastStepId, assignedPhoneNumbers, assignedWidgets]);

  return (
    <>
      <StyledFlex maxWidth="58px">
        {errorsCount > 0 && (
          <StyledTooltip
            arrow
            placement="top"
            title={`${showIncomplete ? 'Hide ' : 'Display'} the Errors Preventing Publication of Agent`}
            p="10px 15px"
          >
            <StyledButton variant="contained" danger onClick={() => setShowIncomplete((si) => !si)}>
              <PriorityHighRounded />
              <StyledText size={15} weight={600} color={colors.white}>
                {errorsCount}
              </StyledText>
            </StyledButton>
          </StyledTooltip>
        )}
      </StyledFlex>
      <StyledTooltip
        title={hasErrors ? <PublishTooltip /> : ''}
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
            disabled={hasErrors}
            variant="contained"
            secondary
            endIcon={hasErrors && <HelpOutlineIcon />}
            onClick={handlePublish}
            loading={isAgentPublishing}
          >
            Publish
          </StyledLoadingButton>
        </StyledFlex>
      </StyledTooltip>

      <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={isNavigationBlocked} />
    </>
  );
};

export default AgentEditorHeadControls;
