import { components } from 'react-select';

import AccessManagementIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import Visibility from "@mui/icons-material/Visibility";
import React from "react";
import { StyledFlex } from "../../../../../../shared/styles/styled";

const CustomCalendarIndicator = (props) => {
  const { isProtected } = props.selectProps;

  return (
    <components.DropdownIndicator {...props}>
      <StyledFlex direction="row" gap="10px">
        <AccessManagementIcons icon="CALENDAR" width={24} />
        {(isProtected && <Visibility/>)}
      </StyledFlex>
    </components.DropdownIndicator>
  );
};

export default CustomCalendarIndicator;
