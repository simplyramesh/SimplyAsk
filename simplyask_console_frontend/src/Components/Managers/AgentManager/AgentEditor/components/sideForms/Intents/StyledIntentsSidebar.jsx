import styled from '@emotion/styled';

export const StyledParameterCard = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
`;
