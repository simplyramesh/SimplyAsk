import {
  ContextMenu,
  ContextMenuItem,
} from '../../../../../../Managers/shared/components/ContextMenus/StyledContextMenus';
import { STATUS_CONSTANTS } from '../../../constants/constants';
import FalloutTicketStatusOptions from './FalloutTicketStatusOptions.jsx/FalloutTicketStatusOptions';

const FalloutTicketStatusMenu = ({ onClose, anchorEl, onStatusClick, ticket, statusRequests }) => {
  const filteredAvailableStatuses = statusRequests?.filter(
    (status) => status.name !== STATUS_CONSTANTS.RESOLVED && status.name !== ticket?.status
  );

  return (
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
      {filteredAvailableStatuses?.map((status) => (
        <ContextMenuItem cursor="pointer" flexDirection="column" onClick={() => onStatusClick(status)} key={status.id}>
          <FalloutTicketStatusOptions label={status.name} />
        </ContextMenuItem>
      ))}
    </ContextMenu>
  );
};

export default FalloutTicketStatusMenu;
