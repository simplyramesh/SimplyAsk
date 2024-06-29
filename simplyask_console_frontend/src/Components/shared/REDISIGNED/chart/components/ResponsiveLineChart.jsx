import { useTheme } from '@emotion/react';
import { CartesianGrid, LineChart, ResponsiveContainer } from 'recharts';
import { StyledResponsiveChartWrapper } from '../StyledChart';

const ResponsiveLineChart = ({ data, children }) => {
  const { colors } = useTheme();

  return (
    <StyledResponsiveChartWrapper>
      <ResponsiveContainer>
        <LineChart
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
          {/* Line */}
          {/* Brush */}
          {children}
        </LineChart>
      </ResponsiveContainer>
    </StyledResponsiveChartWrapper>
  );
};

export default ResponsiveLineChart;
