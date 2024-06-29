import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import DeleteIcon from '../../../../../../../Assets/icons/agent/contextMenu/delete.svg?component';
import DuplicateIcon from '../../../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';
import CopyIcon from '../../../../../../../Assets/icons/copy.svg?component';

import { StyledDivider, StyledText } from '../../../../../../shared/styles/styled';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { agentEditorContextMenu, agentEditorStepItem, agentEditorStepsCopyBuffer } from '../../../store';

import { ContextMenuItem, ContextMenu } from '../../../../../shared/components/ContextMenus/StyledContextMenus';
import { ContentPasteRounded } from '@mui/icons-material';
import { stepDelegates } from '../../../constants/stepDelegates';
import { STEP_ENTITY_TYPE } from '../../../constants/steps';
import { useReactFlow } from 'reactflow';
import { isPasteDisabled } from '../../../../../shared/utils/contextMenu';
import { useUpdateStepItem } from '../../../hooks/useUpdateStepItem';

const BlockContextMenu = ({ left, top, bottom, right, data, type, stepId, editorRef }) => {
  const reactFlowInstance = useReactFlow();

  const { getStepById, pasteStep } = useUpdateSteps();

  const { duplicateStepItem, deleteStepItem, copyStepItem, pasteStepItem } = useUpdateStepItem();
  const [copyBuffer] = useRecoilState(agentEditorStepsCopyBuffer);

  const setContextMenu = useSetRecoilState(agentEditorContextMenu);
  const setStepItemOpened = useSetRecoilState(agentEditorStepItem);

  const step = getStepById(stepId);
  const blockModel = stepDelegates.find((step) => step.type === type);

  const getEditorCoordinates = () => {
    const bounds = editorRef.current.getBoundingClientRect();

    return reactFlowInstance.project({
      x: left - bounds.left,
      y: top - bounds.top,
    });
  };

  const handleCloseMenu = () => {
    setContextMenu((prev) => ({ ...prev, block: null }));
  };

  const handleDelete = () => {
    setStepItemOpened(false);
    deleteStepItem(stepId, data.id, type);
    handleCloseMenu();
  };

  const handleCopy = () => {
    copyStepItem(stepId, data, type);
    handleCloseMenu();
  };

  const handlePaste = () => {
    if (copyBuffer.type === STEP_ENTITY_TYPE.STEP) {
      pasteStep(stepId, getEditorCoordinates());
    } else {
      pasteStepItem(stepId, getEditorCoordinates());
    }

    handleCloseMenu();
  };

  const handleDuplicate = () => {
    duplicateStepItem(stepId, data, type);
    handleCloseMenu();
  };

  return (
    <ContextMenu
      open={!!(top || left || bottom || right)}
      onClose={handleCloseMenu}
      style={{ top, left, right, bottom }}
      maxWidth="250px"
      MenuListProps={{
        onMouseLeave: handleCloseMenu,
      }}
      anchorReference="none"
    >
      {
        <ContextMenuItem startIcon={<CopyIcon />} onClick={handleCopy}>
          <StyledText lh={15}>Copy</StyledText>
        </ContextMenuItem>
      }

      <ContextMenuItem
        startIcon={<ContentPasteRounded />}
        onClick={handlePaste}
        disabled={isPasteDisabled({ step, copyBuffer })}
      >
        <StyledText lh={15}>Paste</StyledText>
      </ContextMenuItem>

      <ContextMenuItem startIcon={<DuplicateIcon />} onClick={handleDuplicate} disabled={!blockModel.multi}>
        <StyledText size={16} lh={16}>
          Duplicate
        </StyledText>
      </ContextMenuItem>
      <StyledDivider m="5px 15px" />
      <ContextMenuItem startIcon={<DeleteIcon />} onClick={handleDelete}>
        <StyledText size={16} lh={16}>
          Delete Block
        </StyledText>
      </ContextMenuItem>
    </ContextMenu>
  );
};

export default BlockContextMenu;
