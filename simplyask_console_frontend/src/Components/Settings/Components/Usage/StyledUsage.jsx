import styled from '@emotion/styled';

import { StyledNavTabs } from '../../../shared/NavTabs/StyledNavTabs';
import { StyledFlex } from '../../../shared/styles/styled';

export const StyledUsageSectionContainer = styled(StyledFlex)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(558px, 100%), 1fr));
  gap: 36px;
`;

export const StyledUsageSubHeader = styled(StyledNavTabs)`
  height: 55px;
`;

export const StyledUsageIcon = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['as'].includes(prop),
})`
  align-items: center;
  justify-content: center;
  & svg {
    width: 40px;
    height: 40px;
  }
`;
