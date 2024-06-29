import styled from '@emotion/styled';

import { media } from '../../shared/styles/media';

export const StyledOverviewWelcome = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 48px;
`;

export const StyledOverviewHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const StyledOverviewGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 36px 39px;
  margin-bottom: 36px;

  ${media.sm} {
    flex-direction: column;
  }
`;

export const StyledOverviewWide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 36px 39px;
  align-items: flex-start;

  ${media.lg} {
    flex-direction: column;
  }
`;

export const StyledOverviewNarrow = styled.div`
  width: 472px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 36px 39px;
  padding-bottom: 36px;

  ${media.lg} {
    width: 471px;
  }

  ${media.sm} {
    margin: 0 auto;
    width: 100%;
    max-width: 472px;
  }
`;
