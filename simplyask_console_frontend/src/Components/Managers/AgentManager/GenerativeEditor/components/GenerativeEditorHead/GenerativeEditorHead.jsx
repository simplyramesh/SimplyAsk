import React, { memo } from 'react';
import SettingsControl from '../../../../shared/components/SettingsControl/SettingsControl';
import FlowEditorHead from '../../../../shared/components/FlowEditorHead/FlowEditorHead';
import GenerativeEditorHeadControls from './GenerativeEditorHeadControls';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import AiIcon from '../../../../../../Assets/icons/agent/generativeAgent/ai.svg?component';
import SettingsContextMenu from './SettingsContextMenu';

const GenerativeEditorHead = ({ agent }) => {
  return (
    <FlowEditorHead
      title={
        <StyledFlex direction="row" gap="10px">
          <AiIcon />
          <StyledText weight={600} ellipsis>
            {agent.name}
          </StyledText>
        </StyledFlex>
      }
      leftControls={
        <SettingsControl>
          <SettingsContextMenu />
        </SettingsControl>
      }
      rightControls={<GenerativeEditorHeadControls agent={agent} />}
    />
  );
};

export default memo(GenerativeEditorHead);
