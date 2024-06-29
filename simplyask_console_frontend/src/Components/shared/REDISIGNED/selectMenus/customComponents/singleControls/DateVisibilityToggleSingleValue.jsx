import { format } from 'date-fns';
import { components } from 'react-select';
import { BASE_DATE_FORMAT, BASE_DATE_TIME_12H_FORMAT } from '../../../../../../utils/timeUtil';
import HiddenValue from '../../../../../Settings/Components/FrontOffice/components/shared/HiddenValue';

const DateVisibilityToggleSingleValue = ({ children, ...rest }) => {
  const { value, valueFormat, timePicker, isTextHidden } = rest.selectProps;

  const hiddenValue = value ? <HiddenValue showIcon={false} showToolTip={false}/> : '';

  const valueToShow = (value) => {
    return isTextHidden
      ? hiddenValue
      : format(value, valueFormat || (timePicker ? BASE_DATE_TIME_12H_FORMAT : BASE_DATE_FORMAT));
  };

  return <components.SingleValue {...rest}>{valueToShow(value)}</components.SingleValue>;
};

export default DateVisibilityToggleSingleValue;
