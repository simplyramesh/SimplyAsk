import { components } from 'react-select';

import CustomTableIcons from '../../../icons/CustomTableIcons';

const CustomIndicatorArrow = (props) => {
  const { selectProps } = props;

  return (
    <components.DropdownIndicator {...props}>
      <CustomTableIcons icon="DROPDOWN" width={selectProps?.withSeparator ? 12 : 14} />
    </components.DropdownIndicator>
  );
};

export default CustomIndicatorArrow;

CustomIndicatorArrow.propTypes = components.DropdownIndicator.propTypes;
