import styled from '@emotion/styled';

export const StyledInfoTable = styled.div`
  border: 1px solid black;
  width: 100%;
`;

export const StyledInfoTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  &:nth-child(even) {
    background-color: #f3f4f8;
  }

  & + & {
    border-top: 1px solid black;
  }
`;

export const StyledInfoTableCell = styled.div`
  padding: 14px;

  & + & {
    border-left: 1px solid black;
  }
`;
