import styled from '@emotion/styled';
import { Menu, MenuItem } from '@mui/material';
import { memo } from 'react';

import { StyledFlex } from '../../../../shared/styles/styled';

export const ContextMenu = styled(Menu, {
  shouldForwardProp: (prop) => !['maxWidth', 'marginTop'].includes(prop),
})(({ theme, maxWidth, marginTop, disablePortal, marginbottom, rootpadding, marginTopMuiMenu }) => ({
  '& .MuiMenu-paper': {
    padding: 0,
    borderRadius: '5px',
    boxShadow: theme.boxShadows.table,
    marginTop: marginTopMuiMenu || '10px',
    ...(maxWidth && { maxWidth }),
    ...(disablePortal && { marginLeft: '10px', transform: 'translateY(-60px) !important' }),
  },

  '& .MuiList-root': {
    ...(rootpadding && { padding: rootpadding }),
  },

  '& .MuiList-root .MuiMenuItem-root': {
    ...(maxWidth && { minWidth: maxWidth }),

    '&:first-of-type': {
      ...(!!marginTop && { marginTop }),
    },

    '&:last-of-type': {
      marginBottom: marginbottom || '4px',
    },
  },
}));

export const StyledContextMenuListItem = styled(MenuItem, {
  shouldForwardProp: (prop) => !['isSubmenuOpen', 'disabledWithActions'].includes(prop),
})(({ theme, isSubmenuOpen, onMouseEnter, disabledWithActions }) => ({
  padding: '10px 15px',
  fontFamily: 'Montserrat',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  letterSpacing: 0,
  color: theme.colors.primary,
  transition: 'background-color 0.3s ease',
  ...(isSubmenuOpen && { backgroundColor: theme.colors.tableEditableCellBg }),
  zIndex: !onMouseEnter ? theme.zIndex.modal + 1 : theme.zIndex.modal,

  '&:hover': {
    backgroundColor: theme.colors.tableEditableCellBg,
  },

  ...(disabledWithActions && {
    opacity: 0.4,
  }),

  '&.Mui-disabled': {
    opacity: 0.4,

    '& .MuiSvgIcon-root': {
      opacity: 0.4,
    },

    '& svg': {
      opacity: 0.4,
    },
  },
}));

export const StyledContextMenuListIcon = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['color', 'width', 'startIcon'].includes(prop),
})(({ theme, color, width, startIcon }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  ...(startIcon && { marginRight: '10px' }),
  color: color || theme.colors.primary,
  flexShrink: 0,

  '& svg': {
    width: width || '16px',
    height: width || '16px',
  },
}));

export const ContextMenuItem = memo(
  ({
    children,
    onClick = () => {},
    startIcon,
    endIcon,
    disabled,
    disabledWithActions,
    submenu,
    onMouseEnter,
    onMouseLeave,
    anchorEl,
  }) => {
    const renderIcon = (icon, isStartIcon) => (
      <StyledContextMenuListIcon startIcon={isStartIcon}>{icon}</StyledContextMenuListIcon>
    );

    return (
      <StyledContextMenuListItem
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        isSubmenuOpen={!!anchorEl}
        disabledWithActions={disabledWithActions}
      >
        {startIcon ? renderIcon(startIcon, true) : null}
        <StyledFlex flex="1 1 auto">{children}</StyledFlex>
        {endIcon ? renderIcon(endIcon, false) : null}
        {submenu}
      </StyledContextMenuListItem>
    );
  }
);
