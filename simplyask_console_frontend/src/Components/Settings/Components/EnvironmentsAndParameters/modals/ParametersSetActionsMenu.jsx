import { ContextMenu, ContextMenuItem } from '../../../../Managers/shared/components/ContextMenus/StyledContextMenus';
import TrashBinIcon from '../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';

const ParametersSetActionsMenu = ({ paramsSetMenuAnchorEl, onCloseParamsSetMenu, onDelete }) => (
  <ContextMenu
    key="parameter-set-actions-menu"
    open={!!paramsSetMenuAnchorEl}
    onClose={onCloseParamsSetMenu}
    anchorEl={paramsSetMenuAnchorEl}
    maxWidth="134px"
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    marginTop="4px"
    MenuListProps={{ onMouseLeave: onCloseParamsSetMenu }}
    marginTopMuiMenu="0px"
  >
    <ContextMenuItem startIcon={<TrashBinIcon />} onClick={onDelete}>
      Delete
    </ContextMenuItem>
  </ContextMenu>
);

export default ParametersSetActionsMenu;
