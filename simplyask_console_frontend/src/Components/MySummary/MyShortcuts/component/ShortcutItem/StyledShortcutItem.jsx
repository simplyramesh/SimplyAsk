import styled from '@emotion/styled';

import SidebarIcons from '../../../../AppLayout/SidebarIcons/SidebarIcons';

export const StyledShortcutItem = styled.div`
  padding: 8px 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.shortcutItemHoverBg};
    cursor: pointer;
  }
`;

export const StyledShortcutIcon = styled(SidebarIcons, {
  shouldForwardProp: (prop) => !['color', 'background'].includes(prop),
})`
  padding: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  color: ${({ color }) => color};
  background: ${({ background }) => background};
`;

export const StyledShortcutLabel = styled.span`
  margin-right: auto;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
