import React from 'react';

import { StyledInfoTable } from './StyledInfoTable';

const InfoTable = ({ children, ...rest }) => {
  return (
    <StyledInfoTable {...rest}>{children}</StyledInfoTable>
  );
};

export default InfoTable;
