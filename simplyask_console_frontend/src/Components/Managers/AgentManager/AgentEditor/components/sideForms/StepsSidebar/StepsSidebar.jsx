import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import React, { memo, useCallback } from 'react';
import CustomScrollbar from 'react-custom-scrollbars-2';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  StyledDivider, StyledExpandButton, StyledFlex, StyledText,
} from '../../../../../../shared/styles/styled';
import { StyledFlowSidebar, StyledFlowSidebarInner, StyledSidebarBackIcon } from '../../../../../shared/components/StyledFlowSidebar';
import { STEP_TYPES } from '../../../../../shared/constants/steps';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import {
  agentEditorContextMenu, agentEditorShowIncomplete, agentEditorStepsSidebarOpen, agentEditorStepsUpdate,
} from '../../../store';
import PanelContextMenu from '../../ContextMenus/PanelContextMenu/PanelContextMenu';

import StepsSidebarItem from './StepsSidebarItem';

const StepsSidebar = () => {
  const steps = useRecoilValue(agentEditorStepsUpdate);
  const [open, setOpen] = useRecoilState(agentEditorStepsSidebarOpen);
  const [isShowIncomplete, setShowIncomplete] = useRecoilState(agentEditorShowIncomplete);
  const [contextMenu, setContextMenu] = useRecoilState(agentEditorContextMenu);

  const { centralizeAndSelectStep } = useUpdateSteps();

  const filteredSteps = isShowIncomplete
    ? steps.filter((node) => (node.type === STEP_TYPES.SWITCH
      ? Object.keys(node.data?.errors || {}).length > 0
      : node.data.stepItems
        ?.some((stepItem) => Object.keys(stepItem.data?.errors || {}).length > 0)))
    : steps;

  const handleStepClick = useCallback((step) => {
    centralizeAndSelectStep(step.id);
  }, [centralizeAndSelectStep]);

  const handleContextMenu = useCallback((event, {
    data, dataType, stepId, stepItemType,
  }) => {
    event.preventDefault();

    setContextMenu((prev) => ({
      ...prev,
      panel: {
        left: event.clientX - 200,
        top: event.clientY,
        data,
        dataType,
        stepId,
        stepItemType,
      },
    }));
  }, []);

  return (
    <StyledFlowSidebar open={open} width="250px">
      <StyledExpandButton
        open={open}
        onClick={() => setOpen(!open)}
        top="50%"
        right="100%"
      >
        { open ? <KeyboardArrowRightRoundedIcon /> : <KeyboardArrowLeftRoundedIcon /> }
      </StyledExpandButton>

      <StyledFlowSidebarInner>
        <StyledFlex p="20px 15px">
          {isShowIncomplete ? (
            <StyledFlex
              direction="row"
              alignItems="center"
              gap="10px"
            >
              <StyledSidebarBackIcon
                size="small"
                onClick={() => setShowIncomplete(false)}
              />
              <StyledText wrap="nowrap" size={16} weight={600}>Incomplete steps</StyledText>
            </StyledFlex>
          ) : (
            <StyledText wrap="nowrap" size={16} weight={600}>Step List</StyledText>
          )}

        </StyledFlex>
        <StyledDivider m="0" />
        <StyledFlex flex="1 0 auto">
          <CustomScrollbar>
            <StyledFlex p="15px 0">
              {filteredSteps.map((step) => (
                <StepsSidebarItem
                  key={step.id}
                  step={step}
                  onClick={() => handleStepClick(step)}
                  onContextMenu={handleContextMenu}
                  forceOpen={isShowIncomplete}
                />
              ))}
            </StyledFlex>
          </CustomScrollbar>
        </StyledFlex>
      </StyledFlowSidebarInner>

      { contextMenu.panel && <PanelContextMenu {...contextMenu.panel} />}
    </StyledFlowSidebar>
  );
};

export default memo(StepsSidebar);
