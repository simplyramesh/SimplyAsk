import styled from '@emotion/styled';

export const StyledImg = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
  border: ${({ theme }) => `1px solid ${theme.colors.black}`};
`;
