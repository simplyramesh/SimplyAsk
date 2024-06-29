import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { StyledDivider, StyledText } from '../../../../../../shared/styles/styled';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { orchestratorContextMenu, orchestratorStepId } from '../../../store';
import { ContextMenu } from '../../../../../shared/components/ContextMenus/StyledContextMenus';
import PasteItem from '../../../../../shared/components/ContextMenus/items/PasteItem';
import { useCoordinates } from '../../../../../shared/hooks/useCoordinates';
import UndoItem from '../../../../../shared/components/ContextMenus/items/UndoItem';
import RedoItem from '../../../../../shared/components/ContextMenus/items/RedoItem';
import { useTheme } from '@mui/material';
import ZoomInItem from '../../../../../shared/components/ContextMenus/items/ZoomInItem';
import ZoomOutItem from '../../../../../shared/components/ContextMenus/items/ZoomOutItem';
import { useReactFlow } from 'reactflow';
import ItemsToAdd from '../../../../../shared/components/ContextMenus/items/ItemsToAdd';
import { stepDelegates } from '../../../constants/stepDelegates';
import { getNewlyAddedProcess } from '../../../utils/defaultTemplates';

const PaneContextMenu = ({ left, top, bottom, right, id, editorRef }) => {
  const { colors } = useTheme();
  const { zoomIn, zoomOut } = useReactFlow();
  const editorCoordinates = useCoordinates({ left, top, editorRef });

  const { pasteStep, addStep } = useUpdateSteps();

  const setContextMenu = useSetRecoilState(orchestratorContextMenu);
  const [lastStepId, setLastStepId] = useRecoilState(orchestratorStepId);

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handlePaste = () => {
    pasteStep(id, editorCoordinates);
    handleCloseMenu();
  }

  const handleAddStep = () => {
    const id = lastStepId + 1;

    const newNode = getNewlyAddedProcess({
      id: id.toString(),
      position: editorCoordinates,
    })

    setLastStepId(id);
    addStep(newNode);
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
      <ItemsToAdd
        label="Create Steps"
        items={stepDelegates}
        onClick={handleAddStep}
      />

      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />

      <PasteItem onClick={handlePaste} endIcon={<StyledText lh={15}>Ctrl + V</StyledText>} />

      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />

      <ZoomInItem onClick={zoomIn} />
      <ZoomOutItem onClick={zoomOut} />
      <UndoItem onClick={() => { }} endIcon={<StyledText lh={15}>Ctrl + Z</StyledText>} />
      <RedoItem onClick={() => { }} endIcon={<StyledText lh={15}>Ctrl + Y</StyledText>} />
    </ContextMenu>
  );
};

export default PaneContextMenu;
