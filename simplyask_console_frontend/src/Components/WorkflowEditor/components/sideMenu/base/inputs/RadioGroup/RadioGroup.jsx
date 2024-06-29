import React from 'react';
import { StyledRadio } from '../../../../../../shared/styles/styled';
import RadioGroupSet from '../../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';

const RadioGroup = ({ value, options, onChange }) => {
  const [possibleValues] = Object.values(options) || [];

  return (
    <RadioGroupSet onChange={(e) => onChange(e.target.name)}>
      {possibleValues.map((key) => (
        <StyledRadio key={key.value} checked={key.value === value} name={key.value} label={key.title} />
      ))}
    </RadioGroupSet>
  );
};

export default RadioGroup;
