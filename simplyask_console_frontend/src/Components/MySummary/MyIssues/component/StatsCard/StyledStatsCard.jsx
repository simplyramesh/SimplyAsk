import styled from '@emotion/styled';

import { StyledCard } from '../../../../shared/styles/styled';

export const StyledStatsCard = styled(StyledCard)`
  width: 100%;
  gap: 20px;
  flex-grow: 1;
  margin: 0;
  align-items: center;
`;

export const StyledStatsCardIcon = styled.div``;

export const StyledStatsCardTitle = styled.div`
  // display: flex;
  // align-items: center;
  // gap: 8px;
  //
  // svg {
  //   cursor: pointer;
  //   fill: ${({ theme }) => theme.colors.primary};
  // }
`;

export const StyledStatsCardCount = styled.div`
  margin-top: auto;
`;
