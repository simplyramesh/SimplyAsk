import React from 'react';

import { StyledInfoTableCell, StyledInfoTableRow } from './StyledInfoTable';

const InfoTableItem = ({ children, name }) => {
  return (
    <StyledInfoTableRow>
      <StyledInfoTableCell>{name}</StyledInfoTableCell>
      <StyledInfoTableCell>{children}</StyledInfoTableCell>
    </StyledInfoTableRow>
  );
};

export default InfoTableItem;
