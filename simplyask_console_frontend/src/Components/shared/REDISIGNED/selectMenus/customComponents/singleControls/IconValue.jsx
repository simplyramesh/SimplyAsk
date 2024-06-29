import React from 'react';
import { components } from 'react-select';

export const IconValue = ({ getValue, ...props }) => {
  const Icon = getValue()?.[0]?.Icon;

  return (
    <components.SingleValue {...props}>
      {Icon && <Icon />}
    </components.SingleValue>
  );
};
