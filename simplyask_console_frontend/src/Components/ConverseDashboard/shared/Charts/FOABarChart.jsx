import { useTheme } from '@emotion/react';

import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { renderXAxis, renderYAxis } from '../../../shared/REDISIGNED/chart/components/ChartAxes';
import {
  renderChartLegend,
  renderChartTooltip,
} from '../../../shared/REDISIGNED/chart/components/ChartContextualization/ChartContextualization';
import { renderBar, renderBrushSlide } from '../../../shared/REDISIGNED/chart/components/ChartDataVisualization';
import ResponsiveBarChart from '../../../shared/REDISIGNED/chart/components/ResponsiveBarChart';

const FOABarChart = ({
  data,
  xAxisDataKey,
  xValueFormat,
  yLabel,
  tickFormatter,
  startIndex,
  endIndex,
  onBrushUpdate,
  legendLabels,
}) => {
  const { colors } = useTheme();

  const { currentUser } = useGetCurrentUser();

  const renderBars = (keys) => {
    const xValueFormatArr = Array.isArray(keys) ? keys : [keys];

    const bars = xValueFormatArr.reduce((acc, v, index) => {
      const barProps = {
        dataKey: v.key,
        color: v.color,
        hoverColor: v.hoverColor,
        key: index,
        ...(v.stackId ? { stackId: v.stackId } : {}),
      };

      return [...acc, renderBar(barProps)];
    }, []);

    return bars;
  };

  return (
    <ResponsiveBarChart data={data}>
      {renderXAxis({
        dataKey: xAxisDataKey,
        colors,
        minTickGap: 12,
        tickFormatter,
        domain: ['auto', 'auto'],
        interval: 'preserveStartEnd',
        height: 48,
      })}
      {renderYAxis({
        colors,
        tickCount: 6,
        allowDecimals: false,
        label: {
          value: yLabel,
          angle: -90,
          position: 'left',
          offset: 7,
          dy: -96,
          fill: colors.primary,
          fontSize: '14px',
          fontWeight: 600,
        },
      })}
      {renderChartTooltip()}
      {renderChartLegend({ timezone: currentUser?.timezone, legendLabels })}
      {renderBars(xValueFormat)}
      {renderBrushSlide({
        data,
        dataKey: xAxisDataKey,
        colors,
        tickFormatter,
        top: 100,
        startIndex,
        endIndex,
        onChange: onBrushUpdate,
      })}
    </ResponsiveBarChart>
  );
};

export default FOABarChart;
