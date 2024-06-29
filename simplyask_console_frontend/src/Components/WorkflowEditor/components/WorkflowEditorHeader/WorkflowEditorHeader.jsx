import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import FlowEditorHead from '../../../Managers/shared/components/FlowEditorHead/FlowEditorHead';
import SettingsControl from '../../../Managers/shared/components/SettingsControl/SettingsControl';
import LeavePageBlockerModal from '../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import { StyledLoadingButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledDivider, StyledFlex, StyledText } from '../../../shared/styles/styled';
import { useWorkflowEditorHeader } from '../../hooks/useWorkflowEditorHeader';
import { expandAllStepsState } from '../../store';
import { workflowEditorSidebars } from '../../store/selectors';
import { SIDEBAR_TYPES } from '../../utils/sidebar';
import SettingsContextMenu from '../ContextMenus/SettingsContextMenu';
import RestorePreviousWorkflowWarning from '../RestorePreviousWorkflowWarning/RestorePreviousWorkflowWarning';
import ZoomControl from '../ZoomControl/ZoomControl';

const WorkflowEditorHeader = ({ zoomToElement, wheelZoomValue }) => {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    canSubmitWorkflow,
    isZoomInDisabled,
    isZoomOutDisabled,
    workflowData,
    isModalOpen,
    setZoom,
    setIsModalOpen,
    settingsTab,
    config,
    zoom,
    handleZoomIn,
    handleZoomOut,
    handlePublish,
    handleReset,
    handleZoomFit,
    navBlocker,
    isNavigationBlocked,
  } = useWorkflowEditorHeader({ zoomToElement, wheelZoomValue });

  const { colors } = useTheme();

  const setSidebars = useSetRecoilState(workflowEditorSidebars);
  const setExpandAllSteps = useSetRecoilState(expandAllStepsState);

  const leftControls = (
    <StyledFlex direction="row">
      <SettingsControl>
        <SettingsContextMenu
          undo={undo}
          redo={redo}
          canRedo={canRedo}
          canUndo={canUndo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomFit={handleZoomFit}
          onProcessDetails={() => {
            setSidebars({ type: SIDEBAR_TYPES.PROCESS_DETAILS, open: true });
          }}
          onExpandAllSteps={() => setExpandAllSteps(true)}
          onMinimizeAllSteps={() => setExpandAllSteps(false)}
        />
      </SettingsControl>

      <StyledDivider color={colors.frenchGray} orientation="vertical" borderWidth={2} height="39px" m="0 10px 0 10px" />

      <ZoomControl
        zoom={zoom}
        isZoomInDisabled={isZoomInDisabled}
        isZoomOutDisabled={isZoomOutDisabled}
        onZoomOut={handleZoomOut}
        onZoomIn={handleZoomIn}
        onZoomFit={handleZoomFit}
        onZoomOption={setZoom}
        onZoomToElement={zoomToElement}
      />
    </StyledFlex>
  );

  const centerControls = (
    <StyledFlex>
      <StyledText as="p" lh={21} size={16} weight={600}>
        {`${settingsTab.displayName}: `}
      </StyledText>
    </StyledFlex>
  );

  const rightControls = (
    <StyledFlex direction="row" gap="0 15px">
      <StyledLoadingButton disabled={!canSubmitWorkflow} variant="contained" secondary onClick={handlePublish}>
        {config?.isTestEditor ? 'Publish Test Case' : 'Deploy'}
      </StyledLoadingButton>
    </StyledFlex>
  );

  return (
    <StyledFlex>
      <FlowEditorHead leftControls={leftControls} centerControls={centerControls} rightControls={rightControls} />

      <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={isNavigationBlocked} />

      <RestorePreviousWorkflowWarning
        isPortalOpen={isModalOpen.restorePrevious}
        onReset={handleReset}
        reset={(onClose) =>
          setIsModalOpen((prev) => ({ ...prev, restorePrevious: onClose === undefined ? true : onClose }))
        }
        workflowName={workflowData.displayName}
      />
    </StyledFlex>
  );
};

WorkflowEditorHeader.propTypes = {
  zoomToElement: PropTypes.func,
  wheelZoomValue: PropTypes.number,
};

export default WorkflowEditorHeader;
