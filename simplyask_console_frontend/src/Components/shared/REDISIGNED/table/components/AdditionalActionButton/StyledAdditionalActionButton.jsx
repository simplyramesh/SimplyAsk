import styled from '@emotion/styled';

export const StyledAdditionalActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: ${(props) => (props.bold ? '600' : '400')};
  font-style: normal;
  text-align: right;
  color: ${({ theme }) => theme.colors.buttonSpecial};
  white-space: nowrap;
`;
