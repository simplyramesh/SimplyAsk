import { components } from 'react-select';
import { StyledFlex } from '../../../../styles/styled';
import React from 'react';

export const SelectVisibilityValue = ({ children, ...rest }) => {
  const { value, isProtected } = rest.selectProps;

  const valueToShow = (value) => {
    const text = value['description'];
    return isProtected ? '*'.repeat(text.length) : text;
  };

  return (
    <components.SingleValue {...rest}>
      <StyledFlex>{valueToShow(value)}</StyledFlex>
    </components.SingleValue>
  );
};
