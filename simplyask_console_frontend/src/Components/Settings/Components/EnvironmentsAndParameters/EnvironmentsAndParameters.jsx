import React from 'react';
import { StyledFlex } from '../../../shared/styles/styled';
import EnvironmentsTable from './EnvironmentsTable/EnvironmentsTable';
import ParametersTable from './ParametersTable/ParametersTable';

const EnvironmentsAndParameters = () => {
  return (
    <StyledFlex gap={4} p="16px 0 32px">
      <EnvironmentsTable />
      <ParametersTable />
    </StyledFlex>
  );
};

export default EnvironmentsAndParameters;
