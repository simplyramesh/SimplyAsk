import React, { memo } from 'react';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { StyledStepGroup, StyledStepSourceHandle } from '../../../../shared/components/CustomSteps/StyledStep';
import { Position } from 'reactflow';
import { getStringifiedEditorState } from '../../../../../shared/REDISIGNED/controls/lexical/utils/helpers';
import GroupItem from '../../../../AgentManager/AgentEditor/components/CustomSteps/DefaultStep/GroupItem';
import ActionErrorIcon from '../../../../../../Assets/icons/agent/steps/arrowRtl.svg?component';
import { TIME_TYPES_MAP } from '../../constants/steps';
import { useRecoilValue } from 'recoil';
import { orchestratorMode } from '../../store';
import { MODES } from '../../constants/config';
import ProcessLink from '../../../../shared/components/ProcessLink/ProcessLink';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';

const DefaultStepItem = ({ job, transitions }) => {
  const mode = useRecoilValue(orchestratorMode);

  const { processId, delayValue, delayType, customStartTime, customEndTime, timeoutValue, timeoutType } = job;

  const handleLinkClick = (e, processLink) => {
    window.open(processLink, '_blank');
  };

  const renderProcessId = () => {
    if (mode !== MODES.DESIGN && processId) {
      return (
        <ProcessLink processId={processId}>
          {(processLink) => (
            <StyledButton variant="text" onClick={(e) => handleLinkClick(e, processLink)} disableRipple size="medium">
              {processId}
            </StyledButton>
          )}
        </ProcessLink>
      );
    }

    return processId ? (
      processId
    ) : (
      <StyledText size={14} display="inline" themeColor="information">
        Select Process...
      </StyledText>
    );
  };

  return (
    <StyledFlex>
      <StyledFlex p="8px 15px">
        <StyledText>
          <StyledText display="inline" size={14} weight={600}>
            Process:{' '}
          </StyledText>
          <StyledText display="inline" size={14}>
            {renderProcessId()}
          </StyledText>
        </StyledText>
        <StyledText>
          <StyledText display="inline" size={14} weight={600}>
            Executes:{' '}
          </StyledText>
          <StyledText display="inline" size={14}>
            {customStartTime && customEndTime ? `${customStartTime} to ${customEndTime}` : ' Anytime'}
          </StyledText>
        </StyledText>
        <StyledText>
          <StyledText display="inline" size={14} weight={600}>
            Timeout:{' '}
          </StyledText>
          <StyledText display="inline" size={14}>
            {timeoutValue && timeoutType ? `${timeoutValue} ${TIME_TYPES_MAP[timeoutType]}` : ' None'}
          </StyledText>
        </StyledText>
        <StyledText>
          <StyledText display="inline" size={14} weight={600}>
            Delay:{' '}
          </StyledText>
          <StyledText display="inline" size={14}>
            {delayValue && delayType ? `${delayValue} ${TIME_TYPES_MAP[delayType]}` : ' None'}
          </StyledText>
        </StyledText>
      </StyledFlex>
      <StyledDivider />
      <StyledFlex p="8px 15px 15px" gap="8px">
        <StyledText size={14} weight={600}>
          Transitions
        </StyledText>
        <StyledStepGroup>
          {transitions?.map((transition) => (
            <GroupItem
              key={transition.id}
              block={{
                id: transition.id,
                Icon: ActionErrorIcon,
                value: getStringifiedEditorState(transition.value),
              }}
              sourceHandle={
                <StyledStepSourceHandle
                  id={transition.id}
                  type="source"
                  position={Position.Right}
                  isConnectable
                  transition
                />
              }
            />
          ))}
        </StyledStepGroup>
      </StyledFlex>
    </StyledFlex>
  );
};

export default memo(DefaultStepItem);
