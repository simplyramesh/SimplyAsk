import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import React from 'react';
import DuplicateIcon from '../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';

import TrashBinIcon from '../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import { ContextMenu, ContextMenuItem } from '../../../shared/components/ContextMenus/StyledContextMenus';

const TestDataFullViewMoreActionsButton = ({ onClose, anchorEl, onDelete, onDuplicate, onExport, canDuplicate }) => (
  <ContextMenu
    open={!!anchorEl}
    onClose={onClose}
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    marginTop="4px"
  >
    {onExport && (
      <ContextMenuItem
        cursor="pointer"
        flexDirection="column"
        onClick={onExport}
        startIcon={
          <IosShareRoundedIcon sx={{ width: '21px !important', height: '21px !important', marginLeft: '-4px' }} />
        }
      >
        Export
      </ContextMenuItem>
    )}
    {canDuplicate && (
      <ContextMenuItem cursor="pointer" flexDirection="column" onClick={onDuplicate} startIcon={<DuplicateIcon />}>
        Duplicate
      </ContextMenuItem>
    )}
    <ContextMenuItem cursor="pointer" flexDirection="column" onClick={onDelete} startIcon={<TrashBinIcon />}>
      Delete
    </ContextMenuItem>
  </ContextMenu>
);

export default TestDataFullViewMoreActionsButton;
