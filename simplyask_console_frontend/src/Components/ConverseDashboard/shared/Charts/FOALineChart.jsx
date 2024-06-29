import { useTheme } from '@emotion/react';

import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { renderXAxis, renderYAxis } from '../../../shared/REDISIGNED/chart/components/ChartAxes';
import {
  renderChartLegend,
  renderChartTooltip,
} from '../../../shared/REDISIGNED/chart/components/ChartContextualization/ChartContextualization';
import { renderBrushSlide, renderLine } from '../../../shared/REDISIGNED/chart/components/ChartDataVisualization';
import ResponsiveLineChart from '../../../shared/REDISIGNED/chart/components/ResponsiveLineChart';

const FOALineChart = ({
  data,
  xAxisDataKey,
  xValueFormat,
  tickFormatter,
  yLabel,
  startIndex,
  endIndex,
  onBrushUpdate,
  legendLabels,
}) => {
  const { colors } = useTheme();

  const { currentUser } = useGetCurrentUser();

  const renderLines = (keys) => {
    const xValueFormatArr = Array.isArray(keys) ? keys : [keys];

    const lines = xValueFormatArr.reduce((acc, v, index) => {
      const lineProps = {
        dataKey: v.key,
        color: v.color,
        hoverColor: v.hoverColor,
        key: index,
        colors,
      };

      return [...acc, renderLine(lineProps)];
    }, []);

    return lines;
  };

  return (
    <ResponsiveLineChart data={data}>
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
      {renderLines(xValueFormat)}
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
    </ResponsiveLineChart>
  );
};

export default FOALineChart;
