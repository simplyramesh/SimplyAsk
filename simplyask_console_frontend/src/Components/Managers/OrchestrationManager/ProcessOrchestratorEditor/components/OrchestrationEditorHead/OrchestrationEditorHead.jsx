import React, { memo } from 'react';
import FlowEditorHead from '../../../../shared/components/FlowEditorHead/FlowEditorHead';
import SettingsControl from '../../../../shared/components/SettingsControl/SettingsControl';
import { StyledDivider } from '../../../../../shared/styles/styled';
import ZoomControl from '../../../../shared/components/ZoomControl/ZoomControl';
import { useTheme } from '@mui/material/styles';
import SettingsContextMenu from '../ContextMenus/SettingsContextMenu/SettingsContextMenu';
import { useRecoilValue } from 'recoil';
import { orchestratorMode } from '../../store';
import DesignModeControls from './DesignModeControls';
import { MODES } from '../../constants/config';
import HistoryModeControls from './HistoryModeControls';

const OrchestrationEditorHead = ({ orchestrator }) => {
  const { colors } = useTheme();

  const mode = useRecoilValue(orchestratorMode);

  const renderControls = () => {
    if (mode === MODES.DESIGN) {
      return <DesignModeControls orchestrator={orchestrator} />
    }

    if (mode === MODES.HISTORY) {
      return <HistoryModeControls />
    }
  }

  return (
    <FlowEditorHead
      title={orchestrator?.name}
      leftControls={(
        <>
          <SettingsControl>
            <SettingsContextMenu />
          </SettingsControl>
          <StyledDivider
            orientation="vertical"
            borderWidth={2}
            height="39px"
            color={colors.frenchGray}
          />
          <ZoomControl />
        </>
      )}
      rightControls={renderControls()}
    />
  );
};

export default memo(OrchestrationEditorHead);
