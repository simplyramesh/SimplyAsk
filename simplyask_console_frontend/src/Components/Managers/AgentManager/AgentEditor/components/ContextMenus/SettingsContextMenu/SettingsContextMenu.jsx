import { ArrowForwardIosRounded } from '@mui/icons-material';
import { useTheme } from '@mui/system';
import React, { memo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import CopyItem from '../../../../../shared/components/ContextMenus/items/CopyItem';
import DeleteItem from '../../../../../shared/components/ContextMenus/items/DeleteItem';
import DuplicateItem from '../../../../../shared/components/ContextMenus/items/DuplicateItem';
import PasteItem from '../../../../../shared/components/ContextMenus/items/PasteItem';
import RedoItem from '../../../../../shared/components/ContextMenus/items/RedoItem';
import UndoItem from '../../../../../shared/components/ContextMenus/items/UndoItem';
import { ContextMenuItem } from '../../../../../shared/components/ContextMenus/StyledContextMenus';
import HeadContextSubmenu from '../../../../../shared/components/ContextMenus/ZoomSubmenu';
import { agentEditorSidebars } from '../../../store';
import { SIDEBAR_TYPES } from '../../../utils/sidebar';
import { initialAgentEditorStateAfterLoad } from '../../../store';

const SettingsContextMenu = ({ onDuplicateAgentClick }) => {
  const { colors } = useTheme();
  const setSidebarOpened = useSetRecoilState(agentEditorSidebars);
  const initialAgentStateAfterLoad = useRecoilValue(initialAgentEditorStateAfterLoad);
  const [viewSubmenuAnchorEl, setViewSubmenuAnchorEl] = useState(null);

  const handleMenuItemSelect = (type) => {
    setSidebarOpened({ type });
  };

  return (
    <>
      <StyledFlex pl="15px" pt="15px" mb="10px">
        <StyledText weight={600} lh={20}>
          Agent Configurations
        </StyledText>
      </StyledFlex>
      <ContextMenuItem onClick={() => handleMenuItemSelect(SIDEBAR_TYPES.AGENT_DETAILS)}>
        <StyledText lh={15}>Agent Details</StyledText>
      </ContextMenuItem>

      <ContextMenuItem onClick={() => handleMenuItemSelect(SIDEBAR_TYPES.ADVANCED_SETTINGS)}>
        <StyledText lh={15}>Advanced Settings</StyledText>
      </ContextMenuItem>

      <ContextMenuItem onClick={() => handleMenuItemSelect(SIDEBAR_TYPES.CONFIGURE_CHANNELS)}>
        <StyledText lh={15}>Configure Channels</StyledText>
      </ContextMenuItem>

      <ContextMenuItem onClick={() => handleMenuItemSelect(SIDEBAR_TYPES.INTENT)}>
        <StyledText lh={15}>Intents</StyledText>
      </ContextMenuItem>

      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />
      <ContextMenuItem endIcon={<ArrowForwardIosRounded />} onClick={() => {}}>
        <StyledText lh={15}>File</StyledText>
      </ContextMenuItem>

      <ContextMenuItem
        endIcon={<ArrowForwardIosRounded />}
        onMouseEnter={(e) => setViewSubmenuAnchorEl(e.currentTarget)}
        onMouseLeave={() => setViewSubmenuAnchorEl(null)}
        anchorEl={viewSubmenuAnchorEl}
        submenu={
          <HeadContextSubmenu
            isOpen={!!viewSubmenuAnchorEl}
            onClose={() => setViewSubmenuAnchorEl(null)}
            anchorEl={viewSubmenuAnchorEl}
          />
        }
      >
        <StyledText lh={15}>View</StyledText>
      </ContextMenuItem>
      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />

      <CopyItem onClick={() => {}} endIcon={<StyledText lh={15}>Ctrl + C</StyledText>} />
      <PasteItem onClick={() => { }} endIcon={<StyledText lh={15}>Ctrl + V</StyledText>} />
      <DuplicateItem onClick={() => onDuplicateAgentClick()} disabled={!(initialAgentStateAfterLoad.steps.length > 1)} />

      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />

      <UndoItem onClick={() => {}} endIcon={<StyledText lh={15}>Ctrl + Z</StyledText>} />
      <RedoItem onClick={() => {}} endIcon={<StyledText lh={15}>Ctrl + Y</StyledText>} />

      <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />

      <DeleteItem onClick={() => {}} label="Delete" />
    </>
  );
};

export default memo(SettingsContextMenu);
