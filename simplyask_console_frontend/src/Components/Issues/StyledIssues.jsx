import styled from '@emotion/styled';

export const StyledIssueTypeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  border-radius: 50%;
  border: 2px solid white;
`;
