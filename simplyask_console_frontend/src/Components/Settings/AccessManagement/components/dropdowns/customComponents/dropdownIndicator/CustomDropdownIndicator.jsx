import { components } from 'react-select';

import AccessManagementIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';

const CustomDropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <AccessManagementIcons icon="DROPDOWN" width={14} />
    </components.DropdownIndicator>
  );
};

export default CustomDropdownIndicator;
