import styled from '@emotion/styled';

import { StyledFlex } from '../../../styles/styled';

export const StyledCardGridItem = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['noClick', 'noHover'].includes(prop),
})`
  height: 70px;
  max-height: 70px;
  padding: 4px 26px 4px 19px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.cardGridItemBg};
  border: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  ${({ noClick }) => !noClick && `cursor: pointer;`}
  transition: background-color 300ms ease-in-out;

  ${({ noHover }) =>
    !noHover &&
    `&:hover {
    background-color: ${({ theme }) => theme.colors.cardGridItemBgHover};
  }`}
`;

export const StyledCardGridItemText = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
