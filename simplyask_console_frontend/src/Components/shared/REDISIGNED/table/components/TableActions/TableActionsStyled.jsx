import styled from '@emotion/styled';

export const StyledTableActions = styled.span`
  position: relative;
  display: inline-block;
`;

export const StyledActionsItem = styled.div`
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  border-radius: 4px;

  &:first-child {
    border-radius: 4px 4px 0 0;
  }

  &:last-child {
    border-radius: 0 0 4px 4px;
  }

  &:only-child {
    border-radius: 4px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }
`;

export const StyledActionsItemText = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
`;

export const StyledActionsItemIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;
