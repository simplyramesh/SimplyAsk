import { useTheme } from '@emotion/react';
import { BarChart, CartesianGrid, ResponsiveContainer } from 'recharts';
import { StyledResponsiveChartWrapper } from '../StyledChart';

const ResponsiveBarChart = ({ data, children }) => {
  const { colors } = useTheme();

  return (
    <StyledResponsiveChartWrapper>
      <ResponsiveContainer>
        <BarChart
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
          {/* Brush */}
          {children}
        </BarChart>
      </ResponsiveContainer>
    </StyledResponsiveChartWrapper>
  );
};

export default ResponsiveBarChart;
