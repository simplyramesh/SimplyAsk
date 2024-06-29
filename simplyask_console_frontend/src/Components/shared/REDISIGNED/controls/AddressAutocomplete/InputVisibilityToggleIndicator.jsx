import { components } from 'react-select';

import { StyledFlex } from '../../../styles/styled';
import InputVisibilityToggle from '../InputVisibiltyToggle/InputVisibilityToggle';

const InputVisibilityToggleIndicator = (props) => {
  const { isProtected, isTextHidden, onTextHidden } = props.selectProps;

  return (
    <components.DropdownIndicator {...props}>
      <StyledFlex mr="-8px">
        {isProtected && <InputVisibilityToggle isTextHidden={isTextHidden} onTextHidden={onTextHidden} />}
      </StyledFlex>
    </components.DropdownIndicator>
  );
};

export default InputVisibilityToggleIndicator;
