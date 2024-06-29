import { components } from 'react-select';
import FalloutTicketStatusOptions from '../../../../../Issues/components/FalloutTickets/components/FalloutTicketsFullView/FalloutTicketStatusMenu/FalloutTicketStatusOptions.jsx/FalloutTicketStatusOptions';

export const FalloutTicketStatusOption = ({ children, getValue, ...props }) => {
  const { label } = props.data;

  return (
    <components.Option {...props}>
      <FalloutTicketStatusOptions label={label}></FalloutTicketStatusOptions>
    </components.Option>
  );
};
