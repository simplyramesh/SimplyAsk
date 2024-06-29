import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const StyledHeader = styled.header`
  display: flex;
  position: relative;
  boxsizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 16px 36px;
  min-height: 78px;
  border-right: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};
  border-top: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const StyledHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledBreadCrumbIcon = styled.span`
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  margin-right: 5px;

  & svg {
    width: 16px;
    pointer-events: none;
  }
`;

export const StyledBreadCrumbLabel = styled.span``;

export const StyledBreadCrumbLink = styled(Link, {
  shouldForwardProp: (prop) => !['isActive', 'color'].includes(prop),
})`
  text-decoration: none;
  display: flex;
  font-weight: 600;
  white-space: nowrap;

  ${({ isActive }) => isActive && '&:hover { text-decoration: underline; cursor: pointer; }'};
  ${({ isActive }) => !isActive && { pointerEvents: 'none' }}
  ${({ color }) => color && { color }}
`;
