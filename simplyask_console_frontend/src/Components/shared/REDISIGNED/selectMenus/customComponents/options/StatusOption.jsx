import { components } from 'react-select';
import ServiceTicketStatus from '../../../../../Issues/components/ServiceTickets/components/shared/ServiceTicketStatus/ServiceTicketStatus';

export const StatusOption = ({ children, getValue, ...props }) => {
  const colour= props.data.colour;
  return (
    <components.Option {...props}>
      <ServiceTicketStatus
        color={colour}
      >
        {children}
      </ServiceTicketStatus>
    </components.Option>
  );
};
