import { format } from 'date-fns';
import { components } from 'react-select';

export const DateSingleValue = ({ children, ...rest }) => {
  const { value, valueFormat, timePicker, isProtected } = rest.selectProps;

  const valueToShow = (value) => {
    return isProtected ? '**********' : format(value, valueFormat || (timePicker ? 'LLL d, yyyy hh:mm a' : 'LLL d, yyyy'))
  }

  return (
    <components.SingleValue {...rest}>
      {valueToShow(value)}
    </components.SingleValue>
  );
};
