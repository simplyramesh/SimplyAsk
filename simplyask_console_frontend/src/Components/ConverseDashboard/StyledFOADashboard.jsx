import styled from '@emotion/styled';

import { StyledFlex } from '../shared/styles/styled';

export const StyledDashboardHeader = styled(StyledFlex)(({ theme }) => ({
  borderRadius: '10px 10px 0 0',
  flexDirection: 'row',
  flex: '1 1 auto',
  padding: '0 19px 0 19px',
  alignItems: 'center',
  height: '103px',
  background: `linear-gradient(111.33deg, ${theme.colors.darkOrange2} 22.75%, ${theme.colors.shinyOrange} 95.37%)`,
}));
