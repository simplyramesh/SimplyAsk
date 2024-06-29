import styled from '@emotion/styled';

export const StyledTableFilterBadge = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 1px 8px;
  border: ${({ theme }) => `1px solid ${theme.colors.loblolly}`};
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.bgColorOptionTwo};
  white-space: nowrap;
`;
