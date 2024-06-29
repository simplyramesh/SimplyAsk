import { XAxis, YAxis } from 'recharts';

// REFERENCE: https://recharts.org/en-US/api/XAxis
export const renderXAxis = ({ dataKey, colors, ...props }) => (
  <XAxis
    includeHidden
    {...props}
    dataKey={dataKey}
    fontFamily="Montserrat"
    fontWeight={500}
    color={`${colors.primary}40`}
    fontSize="12px"
    lineHeight="25px"
    tickMargin={12}
    tickLine={false}
  />
);

// REFERENCE: https://recharts.org/en-US/api/YAxis
export const renderYAxis = ({ colors, ...props }) => (
  <YAxis
    {...props}
    fontFamily="Montserrat"
    fontWeight={500}
    color={`${colors.primary}40`}
    fontSize="14px"
    axisLine={false}
    tickLine={false}
  />
);
