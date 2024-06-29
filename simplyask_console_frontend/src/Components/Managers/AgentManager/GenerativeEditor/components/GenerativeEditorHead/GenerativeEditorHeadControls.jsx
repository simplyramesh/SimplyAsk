import { PriorityHighRounded } from '@mui/icons-material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import { useTheme } from '@mui/material';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import routes from '../../../../../../config/routes';
import { useNavigationBlock } from '../../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import LeavePageBlockerModal from '../../../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import { StyledButton, StyledLoadingButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import PublishTooltip from '../../../../shared/components/PublishTooltip/PublishTooltip';
import useSaveGenerativeAgent from '../../../hooks/useSaveGenerativeAgent';
import { generativeEditorErrors, generativeEditorInitialState, generativeEditorState } from '../../store';

const GenerativeEditorHeadControls = ({ agent }) => {
  const navigate = useNavigate();
  const { colors, boxShadows } = useTheme();

  const { topics, objectives, modelConfig, greeting, greetingEnabled } = useRecoilValue(generativeEditorState);
  const initialAgentState = useRecoilValue(generativeEditorInitialState);

  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  const { navBlocker } = useNavigationBlock(isNavigationBlocked);

  const errors = useRecoilValue(generativeEditorErrors);
  const errorsCount = Object.keys(errors).length;

  const { createGenerativeAgent, isAgentSaving } = useSaveGenerativeAgent({
    onSuccess: () => {
      toast.success('Agent has been deployed successfully.');
      navigate(`${routes.AGENT_MANAGER}`);
    },
    onError: () => {
      toast.error('Failed to deploy agent');
    },
  });

  const handleDeploy = () => {
    setIsNavigationBlocked(false);

    const stringifiedObjectives = objectives.map((objective) => ({
      ...objective,
      actions: objective.actions.map((action) => ({
        ...action,
        data: JSON.stringify(action.data),
      })),
    }));

    createGenerativeAgent({
      agentId: agent.agentId,
      objectives: stringifiedObjectives,
      topics,
      modelConfig,
      greeting,
      greetingEnabled,
    });
  };

  const removeCustomModelProperties = (editorData) => {
    if (!editorData) return {};

    const { objectives, topics, greeting, greetingEnabled, modelConfig = {} } = editorData;

    return {
      objectives,
      topics,
      greeting,
      greetingEnabled,
      modelConfig: {
        ...modelConfig,
        model: `${modelConfig.model}`,
      },
    };
  };

  const filteredInitialEditorData = useMemo(() => removeCustomModelProperties(initialAgentState), [initialAgentState]);

  const filteredCurrentEditorData = useMemo(
    () => removeCustomModelProperties({ objectives, topics, modelConfig, greeting, greetingEnabled }),
    [objectives, topics, modelConfig, greeting, greetingEnabled]
  );

  useEffect(() => {
    const hasDataChanged = !isEqual(filteredInitialEditorData, filteredCurrentEditorData);

    setIsNavigationBlocked(hasDataChanged);
  }, [filteredInitialEditorData, filteredCurrentEditorData]);

  return (
    <StyledFlex direction="row" gap="10px">
      <StyledFlex maxWidth="58px">
        {errorsCount > 0 && (
          <StyledTooltip
            arrow
            placement="top"
            textAlign="left"
            title={
              <>
                <StyledFlex as="ul">
                  {[...new Set([...Object.values(errors)])].map((error) => (
                    <li>{error}</li>
                  ))}
                </StyledFlex>
              </>
            }
            p="10px 15px"
          >
            <StyledButton variant="contained" minWidth="58px" danger onClick={() => {}}>
              <PriorityHighRounded />
              <StyledText size={15} weight={600} color={colors.white}>
                {errorsCount}
              </StyledText>
            </StyledButton>
          </StyledTooltip>
        )}
      </StyledFlex>
      <StyledLoadingButton
        startIcon={<PlayIcon fontSize="small" />}
        disabled={false}
        variant="outlined"
        primary
        onClick={() => {}}
        loading={false}
      >
        Test
      </StyledLoadingButton>
      <StyledTooltip
        title={errorsCount > 0 ? <PublishTooltip /> : ''}
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
            disabled={errorsCount > 0}
            variant="contained"
            secondary
            endIcon={errorsCount > 0 && <HelpOutlineIcon />}
            onClick={handleDeploy}
            loading={isAgentSaving}
          >
            Deploy
          </StyledLoadingButton>
        </StyledFlex>
      </StyledTooltip>

      <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={isNavigationBlocked} />
    </StyledFlex>
  );
};

export default GenerativeEditorHeadControls;
