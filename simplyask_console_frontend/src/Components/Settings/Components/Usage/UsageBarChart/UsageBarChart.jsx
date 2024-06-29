import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Text,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import UsageChartTooltip from '../UsageChartTooltip/UsageChartTooltip';

const UsageBarChart = ({
  data = [],
  barProps = {},
  limitLineProps = {},
  legendProps = {},
  chartProps = {},
  stackedBarProps = {}
}) => {
  const { colors } = useTheme();

  const [tooltipYPos, setTooltipYPos] = useState(0);
  const [barColor, setBarColor] = useState({ date: null, color: barProps.color });

  const axisStyle = {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    color: colors.primary,
  };

  const yAxisStyle = {
    ...axisStyle,
    fontSize: '14px',
  };

  const xAxisStyle = {
    ...axisStyle,
    fontSize: '12px',
    lineHeight: '30px',
    marginTop: '12px',
  };

  const toolTipWrapperStyle = {
    border: 'none',
    outline: 'none',
    '&:focusVisible': { // Removes browser-added outline on focus
      outline: 'none',
    },
  };

  const renderLimitLineText = (value, text) => {
    const yAdjustment = text?.length > 10 ? 10 : 0;
    const x = value.viewBox.width + value.viewBox.x;
    const y = value.viewBox.y - yAdjustment;

    return (
      <Text
        className="recharts-label"
        {...value}
        x={x}
        y={y}
        width={82}
        textAnchor="end"
        verticalAnchor="start"
        fill={colors.primary}
        fontSize="12px"
        fontWeight={600}
      >
        {text ?? ''}
      </Text>
    );
  };

  const renderLimitLine = () => {
    return (
      <>
        {limitLineProps?.tierLimit !== null && (
          <ReferenceLine
            x={0}
            y={limitLineProps?.tierLimit}
            stroke={limitLineProps.color ?? colors.primary}
            strokeWidth="4px"
            strokeLinecap="round"
            isFront
            label={{
              content: (value) => renderLimitLineText(value, limitLineProps?.text),
              dx: 0,
              dy: -24, // viewBox is under ReferenceLine, this moves it above
            }}
          />
        )}
      </>
    );
  };

  const renderBar = (dataKey, fillColor, stackId = '', isStackedBar = false) => {
    const hoverColor = isStackedBar ? stackedBarProps?.hoverColor : barProps?.hoverColor;
    const color = isStackedBar ? stackedBarProps?.color : barProps?.color;

    const handleMouseEnter = (barData) => {
      setBarColor({ date: barData.date, color: hoverColor });
      setTooltipYPos(Math.ceil(barData.tooltipPosition.y / 2));
    };

    const handleMouseLeave = () => {
      setBarColor({ date: null, color });
      tooltipYPos !== 0 ? setTooltipYPos(0) : null;
    };

    return (
      <Bar
        barSize={32}
        dataKey={dataKey}
        stackId={stackId}
        radius={[2, 2, 0, 0]}
        fill={fillColor}
        background={false}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {data?.map((entry, index) => (
          <Cell key={`cell-${index}-${entry?.itemName}`} fill={barColor.date === entry?.date ? fillColor.color : color} />
        ))}
      </Bar>
    );
  };

  const renderLegendContent = () => {
    return (
      <StyledFlex alignItems="center" justifyContent="center">
        <StyledText
          weight={600}
          size={12}
          lh={30}
          textAlign="center"
        >
          {legendProps?.text ?? 'Month'}
        </StyledText>
      </StyledFlex>
    );
  };

  return (
    <ResponsiveContainer
      {...chartProps?.responsiveContainerProps}
      width="100%"
    >
      <BarChart
        data={data ?? []}
        margin={{
          left: 42,
          right: 14,
          top: 23,
          bottom: 0,
        }}
        barGap={72}
      >
        <CartesianGrid
          vertical={false}
          stroke={`${colors.primary}25`}
        />
        <XAxis
          {...chartProps?.xAxisProps}
          style={xAxisStyle}
          padding={{ left: 60, right: 61 }}
        />
        <YAxis
          {...chartProps?.yAxisProps}
          tickCount={7}
          style={yAxisStyle}
          minTickGap={52}
          interval={0}
          allowDecimals={false}
          padding={{ top: 0, bottom: 0 }}
          label={{
            value: chartProps?.yAxisProps?.label,
            angle: -90,
            position: 'left',
            offset: 7,
            dy: -96,
            fill: colors.primary,
            fontSize: '12px',
            fontWeight: 600,
          }}
        />
        <Tooltip
          wrapperStyle={toolTipWrapperStyle}
          content={<UsageChartTooltip yPos={tooltipYPos} />}
          cursor={false}
          isAnimationActive={false}
          allowEscapeViewBox={{ x: true, y: false }}
          position={{ y: tooltipYPos }}
          active={tooltipYPos !== 0}
        />
        {barProps?.stackId && renderBar(barProps?.dataKey, barProps?.stackedBarProps.color, barProps?.stackId)}
        {renderBar(barProps?.dataKey, barColor, barProps?.stackId)}
        {limitLineProps ? renderLimitLine() : null /* ReferenceLine must be after Bar to appear on top because of svg order */ }
        <Legend content={renderLegendContent} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UsageBarChart;

UsageBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  responsiveContainerProps: PropTypes.shape({
    height: PropTypes.number,
  }),
  barProps: PropTypes.shape({
    dataKey: PropTypes.string,
    color: PropTypes.string,
    hoverColor: PropTypes.string,
    stackId: PropTypes.string,
    stackedBarProps: PropTypes.shape({
      dataKey: PropTypes.string,
      color: PropTypes.string,
      hoverColor: PropTypes.string,
      stackId: PropTypes.string,
    }),
  }),
  limitLineProps: PropTypes.shape({
    color: PropTypes.string,
    tierLimit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    text: PropTypes.string,
  }),
  legendProps: PropTypes.shape({
    text: PropTypes.string,
  }),
  chartProps: PropTypes.shape({
    xAxisProps: PropTypes.shape({
      dataKey: PropTypes.string,
    }),
    yAxisProps: PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string,
      domain: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func])),
    }),
  }),
};
