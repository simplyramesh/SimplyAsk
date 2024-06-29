import { components } from "react-select";
import HiddenValue from "../../../../Settings/Components/FrontOffice/components/shared/HiddenValue";

const AddressSingleValue = (props) => {
  const { isTextHidden, value } = props.selectProps;

  const hiddenValue = value?.description ? <HiddenValue showIcon={false} showToolTip={false}/> : '';

  const valueToShow = (value) => (isTextHidden ? hiddenValue : value?.description);

  return <components.SingleValue {...props}>{valueToShow(value)}</components.SingleValue>;
};

export default AddressSingleValue;
