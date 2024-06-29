import { components } from 'react-select';

import AccessManagementIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import InputVisibilityToggle from '../../../../../../shared/REDISIGNED/controls/InputVisibiltyToggle/InputVisibilityToggle';

const CustomVisibilityToggleCalendarIndicator = (props) => {
  const { isProtected, isTextHidden, onTextHidden } = props.selectProps;

  return (
    <components.DropdownIndicator {...props}>
      <StyledFlex direction="row" gap="10px">
        {isProtected ? (
          <InputVisibilityToggle isTextHidden={isTextHidden} onTextHidden={onTextHidden} />
        ) : (
          <AccessManagementIcons icon="CALENDAR" width={24} />
        )}
      </StyledFlex>
    </components.DropdownIndicator>
  );
};

export default CustomVisibilityToggleCalendarIndicator;
