import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import { StyledDivider, StyledFlex } from '../../../../../shared/styles/styled';
import { stepDelegates } from '../../constants/stepDelegates';
import { useUpdateSteps } from '../../hooks/useUpdateSteps';
import { agentEditorContextMenu, agentEditorStepId, agentEditorStepsCopyBuffer } from '../../store';
import { agentEditorStepItem } from '../../store';
import { ContextMenu } from '../../../../shared/components/ContextMenus/StyledContextMenus';
import { STEP_ENTITY_TYPE } from '../../constants/steps';
import { isPasteDisabled } from '../../../../shared/utils/contextMenu';
import { getStepItemTemplate } from '../../utils/defaultTemplates';
import { STEP_DRAG_HANDLE_CLASS, STEP_TYPES } from '../../../../shared/constants/steps';
import { useUpdateStepItem } from '../../hooks/useUpdateStepItem';
import CopyItem from '../../../../shared/components/ContextMenus/items/CopyItem';
import PasteItem from '../../../../shared/components/ContextMenus/items/PasteItem';
import DuplicateItem from '../../../../shared/components/ContextMenus/items/DuplicateItem';
import RenameItem from '../../../../shared/components/ContextMenus/items/RenameItem';
import DeleteItem from '../../../../shared/components/ContextMenus/items/DeleteItem';
import { useCoordinates } from '../../../../shared/hooks/useCoordinates';
import ItemsToAdd from '../../../../shared/components/ContextMenus/items/ItemsToAdd';

const StepContextMenu = ({ left, top, bottom, right, id, editorRef }) => {
  const [lastStepId, setLastStepId] = useRecoilState(agentEditorStepId);

  const editorCoordinates = useCoordinates({ left, top, editorRef });

  const {
    getStepById,
    updateStep,
    addStep,
    copyStep,
    pasteStep,
    duplicateStep,
    deleteSteps,
    centralizeStep,
  } = useUpdateSteps();

  const {
    pasteStepItem,
  } = useUpdateStepItem();
  const [copyBuffer] = useRecoilState(agentEditorStepsCopyBuffer);

  const setContextMenu = useSetRecoilState(agentEditorContextMenu);
  const setStepItemOpened = useSetRecoilState(agentEditorStepItem);

  const step = id && getStepById(id);

  const availableBlocks = !step || step?.type === STEP_TYPES.DEFAULT ? stepDelegates.filter((delegate) => {
    return delegate.addable && (!step || !step.data?.stepItems?.some((item) => item.type === delegate.type) || delegate.multi);
  }) : [];

  const handleCloseMenu = () => {
    setContextMenu((prev) => ({ ...prev, step: null }));
  };

  const handleDelete = () => {
    setStepItemOpened(null);
    deleteSteps([{ id }]);
    handleCloseMenu();
  };

  const handleCopy = () => {
    copyStep(id);
    handleCloseMenu();
  }

  const handlePaste = () => {
    if (copyBuffer.type === STEP_ENTITY_TYPE.STEP) {
      pasteStep(id, editorCoordinates);
    } else {
      pasteStepItem(id, editorCoordinates);
    }

    handleCloseMenu();
  }

  const handleDuplicate = () => {
    duplicateStep(id);
    handleCloseMenu();
  };

  const handleStepEdit = () => {
    centralizeStep({ ...step.position, width: step.width, height: step.height });
    updateStep(id, (prev) => setIn(prev, 'data.meta.editing', true));
    handleCloseMenu();
  };

  const handleAddBlock = (type) => {
    updateStep(id, (prev) => setIn(prev, 'data.stepItems', prev.data.stepItems.concat(getStepItemTemplate(type))));
    handleCloseMenu();
  };

  const handleAddStep = (type) => {
    const id = lastStepId + 1;

    const newNode = {
      id: id.toString(),
      type: STEP_TYPES.DEFAULT,
      dragHandle: `.${STEP_DRAG_HANDLE_CLASS}`,
      data: {
        label: `Step ${id}`,
        stepItems: [getStepItemTemplate(type)],
        meta: {
          hovered: false,
          touched: false
        }
      },
      position: editorCoordinates,
    };

    setLastStepId(id);
    addStep(newNode);
    handleCloseMenu();
  };

  const renderAvailableBlocks = () => !!availableBlocks.length && (
    <>
      <ItemsToAdd
        label={id ? 'Add Blocks' : 'Create Steps'}
        items={availableBlocks}
        onClick={id ? handleAddBlock : handleAddStep}
      />

      <StyledDivider m="5px 15px" />
    </>
  );

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
      {renderAvailableBlocks()}

      <CopyItem onClick={handleCopy} />

      <PasteItem onClick={handlePaste} disabled={isPasteDisabled({ step, copyBuffer })} />

      {id && (<StyledFlex>
        <DuplicateItem onClick={handleDuplicate} />

        <RenameItem onClick={handleStepEdit} />

        <StyledDivider m="5px 15px" />

        <DeleteItem onClick={handleDelete} />

      </StyledFlex>)}
    </ContextMenu>
  );
};

export default StepContextMenu;
