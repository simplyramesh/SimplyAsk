import styled from '@emotion/styled';

export const StyledPrimaryButton = styled.button`
  transition:
    background-color 250ms ease-in-out,
    color 250ms ease-in-out;
  padding: 4px 14px;
  border: 3px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 100px;
  outline: none;
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-style: normal;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
  }
`;
