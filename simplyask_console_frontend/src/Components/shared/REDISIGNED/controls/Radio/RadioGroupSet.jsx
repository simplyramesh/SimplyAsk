import RadioGroup from '@mui/material/RadioGroup';
import { Children } from 'react';

import { StyledFormControlLabel, StyledRadio } from '../../../styles/styled';

const RadioGroupSet = ({ children, name, ...props }) => {
  const childrenArray = Children.toArray(children);

  return (
    <RadioGroup name={name} {...props}>
      {childrenArray.map((child) => (
        <StyledFormControlLabel
          key={child?.key}
          value={child?.props?.value}
          label={child?.props?.label}
          control={
            <StyledRadio disableFocusRipple disableRipple />
          }
          {...child?.props}
        />
      ))}
    </RadioGroup>
  );
};

export default RadioGroupSet;

RadioGroupSet.propTypes = RadioGroup.propTypes;
