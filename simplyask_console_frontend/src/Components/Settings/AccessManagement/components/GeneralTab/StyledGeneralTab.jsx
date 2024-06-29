import styled from '@emotion/styled';

export const StyledGeneralTabSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: ${({ theme }) => theme.colors.white};
  height: 100%;
`;

export const StyledGeneralTabSideHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 36px;
  background-color: ${({ theme }) => theme.colors.tertiary};
`;

export const StyledGeneralTabEditButton = styled.button`
  color: ${({ theme }) => theme.colors.linkColor};
  background-color: transparent;
  border: none;
  outline: none;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
`;

export const StyledGeneralTabSideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 22px;
`;

export const StyledGeneralTabSideContentItem = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 0px 14px;
  margin: 1px 0;
`;

export const StyledGeneralTabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.tertiary};
  border: none;
  outline: none;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  padding: 10px 22px;
  cursor: pointer;
  transition: background-color 250ms ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tertiaryHover};
  }
`;
