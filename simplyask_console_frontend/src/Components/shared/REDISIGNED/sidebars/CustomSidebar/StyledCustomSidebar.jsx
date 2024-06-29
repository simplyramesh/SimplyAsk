import styled from '@emotion/styled';

export const StyledCustomSidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const StyledCustomSidebarHead = styled.div`
  padding: 30px;
  background-color: ${({ headBackgroundColor, theme }) => headBackgroundColor || theme.colors.cardGridItemBorder};
  border-bottom: 2px solid ${({ theme }) => theme.colors.timberwolfGray};

  ${({ headStyleType, theme }) =>
    headStyleType === 'filter' &&
    `
    padding: 12px 20px 20px 20px;
    background-color: ${theme.colors.white};
    border-bottom: none;
  `};
`;

export const StyledCustomSidebarHeadTemplate = styled.div`
  padding-top: 30px;
`;

export const StyledCustomSidebarHeadActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 41px;
`;

export const StyledCustomSidebarHeadClose = styled.div``;

export const StyledCustomSidebarHeadCustomAction = styled.div``;

export const StyledCustomSidebarBody = styled.div`
  flex-grow: 1;
`;
export const StyledCustomSidebarFooter = styled.div``;
