import styled from '@emotion/styled';

import { StyledFlex } from '../../../../../../../shared/styles/styled';

export const StyledActionsExecutionSection = styled('section', {
  shouldForwardProp: (prop) => prop !== 'width',
})`
  width: ${({ width }) => width || 'auto'};
  display: flex;
  flex-direction: column;
  flex-grow: ${({ width }) => (width ? '0' : '1')};
  flex-shrink: ${({ width }) => (width ? '0' : '1')};
  flex-basis: ${({ width }) => width || 'auto'};
  z-index: 1;
  border-right: 2px solid #dfe4ed;
`;

export const StyledActionsExecutionHeader = styled('header', {
  shouldForwardProp: (prop) => !['height', 'padding'].includes(prop),
})`
  padding: ${({ padding }) => padding ?? '15px 22px 15px'};
  height: ${({ height }) => height || 'auto'};
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: ${({ theme }) => theme.colors.bgColorOptionTwo};
`;

export const StyledActionsExecutionContent = styled.div`
  flex-grow: 1;
  padding: 10px 0 10px 22px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StyledActionsExecutionFilters = styled(StyledFlex)`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => `${theme.colors.background}`};
`;
