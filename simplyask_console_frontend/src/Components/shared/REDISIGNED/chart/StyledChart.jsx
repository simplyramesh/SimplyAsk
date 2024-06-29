import styled from '@emotion/styled';

import { StyledFlex } from '../../styles/styled';

export const StyledResponsiveChartWrapper = styled(StyledFlex)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  paddingRight: '4px',
  marginLeft: '-14px',
  marginBottom: '-8px',
  width: '100%',
  height: '500px',
  '& .recharts-brush-texts .recharts-text': {
    fontSize: '14px',
    lineHeight: '35px',
    fontWeight: 600,
    fill: theme.colors.primary,
  },
}));
