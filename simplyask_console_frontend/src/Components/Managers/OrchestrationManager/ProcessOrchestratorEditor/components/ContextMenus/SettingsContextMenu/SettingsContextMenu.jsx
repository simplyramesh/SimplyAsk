import { StyledDivider, StyledText } from '../../../../../../shared/styles/styled';
import { ContextMenuItem } from '../../../../../shared/components/ContextMenus/StyledContextMenus';
import { ArrowForwardIosRounded } from '@mui/icons-material';
import ZoomSubmenu from '../../../../../shared/components/ContextMenus/ZoomSubmenu';
import React, { memo, useState } from 'react';
import { useTheme } from '@mui/material';
import CopyItem from '../../../../../shared/components/ContextMenus/items/CopyItem';
import PasteItem from '../../../../../shared/components/ContextMenus/items/PasteItem';
import UndoItem from '../../../../../shared/components/ContextMenus/items/UndoItem';
import RedoItem from '../../../../../shared/components/ContextMenus/items/RedoItem';
import DeleteItem from '../../../../../shared/components/ContextMenus/items/DeleteItem';

const SettingsContextMenu = () => {
  const { colors } = useTheme();

  const [viewSubmenuAnchorEl, setViewSubmenuAnchorEl] = useState(null);

  return (
    <>
      <ContextMenuItem
        endIcon={<ArrowForwardIosRounded />}
        onMouseEnter={(e) => setViewSubmenuAnchorEl(e.currentTarget)}
        onMouseLeave={() => setViewSubmenuAnchorEl(null)}
        anchorEl={viewSubmenuAnchorEl}
        submenu={(
          <ZoomSubmenu
            isOpen={!!viewSubmenuAnchorEl}
            onClose={() => setViewSubmenuAnchorEl(null)}
            anchorEl={viewSubmenuAnchorEl}
          />
        )}
      >
        <StyledText lh={15}>View</StyledText>
      </ContextMenuItem>
      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />

      <CopyItem onClick={() => {}} endIcon={<StyledText lh={15}>Ctrl + C</StyledText>} />
      <PasteItem onClick={() => {}} endIcon={<StyledText lh={15}>Ctrl + V</StyledText>} />

      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />

      <UndoItem onClick={() => { }} endIcon={<StyledText lh={15}>Ctrl + Z</StyledText>} />
      <RedoItem onClick={() => { }} endIcon={<StyledText lh={15}>Ctrl + Y</StyledText>} />

      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />

      <DeleteItem onClick={() => {}} label="Delete" />
    </>
  );
};

export default memo(SettingsContextMenu);
