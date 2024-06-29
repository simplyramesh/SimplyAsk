import { useTheme } from '@emotion/react';

import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { renderXAxis, renderYAxis } from '../../../shared/REDISIGNED/chart/components/ChartAxes';
import { renderChartLegend, renderChartTooltip } from '../../../shared/REDISIGNED/chart/components/ChartContextualization/ChartContextualization';
import {
  renderAvgLine,
  renderBar,
  renderBrushSlide,
  renderLine,
} from '../../../shared/REDISIGNED/chart/components/ChartDataVisualization';
import ResponsiveComposedChart from '../../../shared/REDISIGNED/chart/components/ResponsiveComposedChart';
import { BAR_OR_LINE_GRAPH_TYPES } from '../../utils/constants';

const FOAComposedChart = ({
  data,
  chartType,
  xAxisDataKey,
  xValueFormat,
  tickFormatter,
  movingAvgKey,
  yLabel,
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

  const renderLines = (keys) => {
    const xValueFormatArr = Array.isArray(keys) ? keys : [keys];

    const lines = xValueFormatArr.reduce((acc, v, index) => {
      const lineProps = {
        dataKey: v.key,
        color: v.color,
        hoverColor: v.hoverColor,
        key: index,
        colors,
        ...(v.stackId ? { stackId: v.stackId } : {}),
      };

      return [...acc, renderLine(lineProps)];
    }, []);

    return lines;
  };

  return (
    <ResponsiveComposedChart data={data}>
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
      {chartType === BAR_OR_LINE_GRAPH_TYPES.BAR_GRAPH ? renderBars(xValueFormat) : null}
      {chartType === BAR_OR_LINE_GRAPH_TYPES.LINE_GRAPH ? renderLines(xValueFormat) : null}
      {renderAvgLine({ dataKey: movingAvgKey, colors })}
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
    </ResponsiveComposedChart>
  );
};

export default FOAComposedChart;
