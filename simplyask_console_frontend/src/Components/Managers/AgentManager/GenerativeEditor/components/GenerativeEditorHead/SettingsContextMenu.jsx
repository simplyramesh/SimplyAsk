import React from 'react';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import UndoItem from '../../../../shared/components/ContextMenus/items/UndoItem';
import RedoItem from '../../../../shared/components/ContextMenus/items/RedoItem';
import { useTheme } from '@mui/material';
import { ContextMenuItem } from '../../../../shared/components/ContextMenus/StyledContextMenus';

const SettingsContextMenu = () => {
  const { colors } = useTheme();

  return (
    <>
      <StyledFlex pl="15px" pt="15px" mb="10px">
        <StyledText weight={600} lh={20}>
          Agent Configurations
        </StyledText>
      </StyledFlex>
      <ContextMenuItem onClick={() => {}}>
        <StyledText lh={15}>Agent Details</StyledText>
      </ContextMenuItem>

      <ContextMenuItem onClick={() => {}}>
        <StyledText lh={15}>Advanced Settings</StyledText>
      </ContextMenuItem>

      <ContextMenuItem onClick={() => {}}>
        <StyledText lh={15}>Configure Channels</StyledText>
      </ContextMenuItem>

      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />

      <UndoItem onClick={() => {}} endIcon={<StyledText lh={15}>Ctrl + Z</StyledText>} />
      <RedoItem onClick={() => {}} endIcon={<StyledText lh={15}>Ctrl + Y</StyledText>} />
    </>
  );
};

export default SettingsContextMenu;
