import React, { memo, useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import DeleteIcon from '../../../../../../../Assets/icons/agent/contextMenu/delete.svg?component';
import DuplicateIcon from '../../../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';
import CopyIcon from '../../../../../../../Assets/icons/copy.svg?component';

import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { agentEditorContextMenu, agentEditorStepItem, agentEditorStepsCopyBuffer } from '../../../store';

import { ContextMenuItem, ContextMenu } from '../../../../../shared/components/ContextMenus/StyledContextMenus';
import { ContentPasteRounded } from '@mui/icons-material';
import { STEP_ENTITY_TYPE } from '../../../constants/steps';
import { stepDelegates } from '../../../constants/stepDelegates';
import { isPasteDisabled } from '../../../../../shared/utils/contextMenu';
import { STEP_TYPES } from '../../../../../shared/constants/steps';
import { useUpdateStepItem } from '../../../hooks/useUpdateStepItem';

const PanelContextMenu = ({ left, top, bottom, right, data, dataType, stepId, stepItemType }) => {
  const { copyStep, pasteStep, duplicateStep, deleteSteps, getStepById } = useUpdateSteps();
  const { copyStepItem, pasteStepItem, deleteStepItem, duplicateStepItem } = useUpdateStepItem();

  const setStepItemOpened = useSetRecoilState(agentEditorStepItem);
  const [copyBuffer] = useRecoilState(agentEditorStepsCopyBuffer);

  const isStep = dataType === STEP_ENTITY_TYPE.STEP && data?.type === STEP_TYPES.DEFAULT;
  const isBlock = dataType === STEP_ENTITY_TYPE.BLOCK;

  const targetStep = isBlock ? getStepById(stepId) : data;

  const setContextMenu = useSetRecoilState(agentEditorContextMenu);

  const handleCloseMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, panel: null }));
  }, []);

  const handleDelete = useCallback(() => {
    setStepItemOpened(false);

    if (isBlock) {
      deleteStepItem(stepId, data.id, stepItemType);
    } else {
      deleteSteps([{ id: data.id }]);
    }

    handleCloseMenu();
  }, [data, deleteStepItem, deleteSteps, handleCloseMenu, isBlock, setStepItemOpened, stepId, stepItemType]);

  const handleCopy = useCallback(() => {
    if (isBlock) {
      copyStepItem(stepId, data, stepItemType);
    } else {
      copyStep(data.id);
    }

    handleCloseMenu();
  }, [isBlock, data, stepId, stepItemType]);

  const handlePaste = useCallback(() => {
    const targetId = isBlock ? stepId : data.id;

    if (copyBuffer.type === STEP_ENTITY_TYPE.BLOCK) {
      pasteStepItem(targetId);
    } else {
      pasteStep(targetId);
    }

    handleCloseMenu();
  }, [copyBuffer, data, isBlock, stepId]);

  const handleDuplicate = useCallback(() => {
    if (isBlock) {
      duplicateStepItem(stepId, data, stepItemType);
    } else {
      duplicateStep(data.id);
    }

    handleCloseMenu();
  }, [isBlock, stepId, data, stepItemType]);

  const isDuplicateDisabled = () => {
    if (dataType === STEP_ENTITY_TYPE.BLOCK) {
      const stepItemModel = stepDelegates.find((delegate) => delegate.type === stepItemType);

      return !stepItemModel.multi;
    }

    return false;
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
      {(isStep || isBlock) && (
        <ContextMenuItem startIcon={<CopyIcon />} onClick={handleCopy}>
          <StyledText lh={15}>Copy</StyledText>
        </ContextMenuItem>
      )}

      <ContextMenuItem
        startIcon={<ContentPasteRounded />}
        onClick={handlePaste}
        disabled={isPasteDisabled({ step: targetStep, copyBuffer })}
      >
        <StyledText lh={15}>Paste</StyledText>
      </ContextMenuItem>

      {(isStep || isBlock) && (
        <StyledFlex>
          <ContextMenuItem startIcon={<DuplicateIcon />} onClick={handleDuplicate} disabled={isDuplicateDisabled()}>
            <StyledText size={16} lh={16}>
              Duplicate
            </StyledText>
          </ContextMenuItem>
          <StyledDivider m="5px 15px" />
          <ContextMenuItem startIcon={<DeleteIcon />} onClick={handleDelete}>
            <StyledText size={16} lh={16}>
              Delete{' '}
            </StyledText>
          </ContextMenuItem>
        </StyledFlex>
      )}
    </ContextMenu>
  );
};

export default memo(PanelContextMenu);
