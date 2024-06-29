import { useTheme } from '@emotion/react';
import { CartesianGrid, ComposedChart, ResponsiveContainer } from 'recharts';
import { StyledResponsiveChartWrapper } from '../StyledChart';

const ResponsiveComposedChart = ({ data, children }) => {
  const { colors } = useTheme();

  return (
    <StyledResponsiveChartWrapper>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 50,
            bottom: 20,
            left: 50,
          }}
        >
          <CartesianGrid stroke={`${colors.primary}40`} vertical={false} />
          {/* Order of components should be: */}
          {/* XAxis */}
          {/* YAxis */}
          {/* Tooltip */}
          {/* Legend */}
          {/* Bar */}
          {/* Line */}
          {/* Brush */}
          {children}
        </ComposedChart>
      </ResponsiveContainer>
    </StyledResponsiveChartWrapper>
  );
};

export default ResponsiveComposedChart;
