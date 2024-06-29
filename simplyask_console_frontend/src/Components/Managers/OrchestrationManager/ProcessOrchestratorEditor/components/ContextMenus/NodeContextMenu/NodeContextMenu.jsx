import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import { StyledDivider, StyledFlex } from '../../../../../../shared/styles/styled';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { orchestratorContextMenu, orchestratorStepDetailsOpened, orchestratorStepsCopyBuffer } from '../../../store';
import { ContextMenu } from '../../../../../shared/components/ContextMenus/StyledContextMenus';
import { isPasteDisabled } from '../../../../../shared/utils/contextMenu';
import CopyItem from '../../../../../shared/components/ContextMenus/items/CopyItem';
import PasteItem from '../../../../../shared/components/ContextMenus/items/PasteItem';
import DuplicateItem from '../../../../../shared/components/ContextMenus/items/DuplicateItem';
import RenameItem from '../../../../../shared/components/ContextMenus/items/RenameItem';
import DeleteItem from '../../../../../shared/components/ContextMenus/items/DeleteItem';
import { useCoordinates } from '../../../../../shared/hooks/useCoordinates';

const NodeContextMenu = ({ left, top, bottom, right, id, editorRef }) => {
  const editorCoordinates = useCoordinates({ left, top, editorRef });

  const {
    getStepById,
    updateStep,
    copyStep,
    pasteStep,
    duplicateStep,
    deleteSteps,
    centralizeStep,
  } = useUpdateSteps();

  const [copyBuffer] = useRecoilState(orchestratorStepsCopyBuffer);

  const setContextMenu = useSetRecoilState(orchestratorContextMenu);
  const setStepItemOpened = useSetRecoilState(orchestratorStepDetailsOpened);

  const step = id && getStepById(id);

  const handleCloseMenu = () => {
    setContextMenu(null);
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
    pasteStep(id, editorCoordinates);
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

export default NodeContextMenu;
