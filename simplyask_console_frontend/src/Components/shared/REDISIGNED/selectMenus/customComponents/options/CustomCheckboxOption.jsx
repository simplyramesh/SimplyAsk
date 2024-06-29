import { useState } from 'react';
import { components } from 'react-select';

import { StyledStatus } from '../../../../styles/styled';
import Checkbox from '../../../controls/Checkbox/Checkbox';

const CustomCheckboxOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  data,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = 'transparent';
  if (isFocused) bg = '#eee';
  if (isActive) bg = '#B2D4FF';

  const style = {
    alignItems: 'center',
    backgroundColor: bg,
    color: 'inherit',
    display: 'flex ',
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style,
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <Checkbox
        checkValue={isSelected}
      />
      {data.color ? (
        <StyledStatus color={data.color}>
          {children}
        </StyledStatus>
      )
        : children}
    </components.Option>
  );
};

export default CustomCheckboxOption;
