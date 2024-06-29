import styled from '@emotion/styled';
import { Card } from 'simplexiar_react_components';

export const StyledShortcutsSection = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isLoading',
})`
  padding-left: 0;
  padding-right: 0;
  ${({ isLoading }) => !isLoading && { paddingBottom: 0 }}
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledMyShortcutsPart = styled.article`
  &:not(:last-child) {
    padding-bottom: 22px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};
  }
`;

export const StyledMyShortcutsHeader = styled.header`
  margin-bottom: 6px;
  padding: 0 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
