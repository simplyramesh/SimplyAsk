import { useState } from 'react';

export const usePopoverToggle = (initialId = 'simple-popover', stopPropagation = true) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (stopPropagation) {
      event?.stopPropagation();
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return {
    id: open ? initialId : undefined,
    open,
    anchorEl,
    handleClick,
    handleClose,
  };
};
