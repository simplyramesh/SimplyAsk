import styled from '@emotion/styled';
import { Card } from 'simplexiar_react_components';

import { media } from '../../../../shared/styles/media';
import { StyledFlex } from '../../../../shared/styles/styled';

export const StyledMyIssuesPreview = styled(Card)`
  margin: 0;
  width: 100%;
  max-width: 643px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  ${media.lg} {
    max-width: none;
  }
`;

export const StyledMyIssuesPreviewTable = styled(StyledFlex)`
  width: 100%;
`;

export const StyledMyIssuesPreviewTableCell = styled(StyledFlex)`
  padding: 12px 0;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};
  width: 100%;
  align-items: ${({ alignItems }) => alignItems || 'center'};
  justify-content: center;

  &:first-of-type {
    text-align: left;
    cursor: pointer;

    &:hover span {
      color: ${({ theme }) => theme.colors.linkColor};
      text-decoration: underline;
    }
  }
`;
