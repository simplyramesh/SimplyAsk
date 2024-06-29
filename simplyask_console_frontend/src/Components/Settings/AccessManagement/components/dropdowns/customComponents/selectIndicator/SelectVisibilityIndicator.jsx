import { components } from 'react-select';

import Visibility from "@mui/icons-material/Visibility";
import React from "react";

const SelectVisibilityIndicator = (props) => {
  const { isProtected } = props.selectProps;

  const showSecretEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <components.DropdownIndicator {...props}>
      {(isProtected && <Visibility onClick={showSecretEvent}/>) }
    </components.DropdownIndicator>
  );
};

export default SelectVisibilityIndicator;
