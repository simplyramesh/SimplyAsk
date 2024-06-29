import React from 'react';
import { usePopoverToggle } from '../../../../../hooks/usePopoverToggle';
import FlowIconWithTooltip from '../FlowIconWithTooltip/FlowIconWithTooltip';
import { ContextMenu } from '../ContextMenus/StyledContextMenus';

const SettingsControl = ({ children }) => {
  const {
    anchorEl: settingsAnchorEl,
    open: isSettingsMenuOpen,
    handleClick: onOpenSettingsMenu,
    handleClose: onCloseSettingsMenu,
  } = usePopoverToggle('settings-context-menu');

  return (
    <>
      <FlowIconWithTooltip
        icon="SETTINGS"
        text="Settings"
        active={isSettingsMenuOpen}
        onClick={onOpenSettingsMenu}
      />
      <ContextMenu
        open={isSettingsMenuOpen}
        onClose={onCloseSettingsMenu}
        anchorEl={settingsAnchorEl}
        maxWidth="274px"
        MenuListProps={{
          onMouseLeave: onCloseSettingsMenu,
        }}
      >
        {children}
      </ContextMenu>
    </>
  );
};

export default SettingsControl;
