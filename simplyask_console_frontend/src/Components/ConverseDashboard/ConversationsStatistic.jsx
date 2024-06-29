import { useTheme } from '@emotion/react';
import { parseISO } from 'date-fns';
import React, { useState } from 'react';

import { useGetCurrentUser } from '../../hooks/useGetCurrentUser';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getInFormattedUserTimezone } from '../../utils/timeUtil';
import { StyledCheckoutAccordion } from '../Sell/Orders/ProductOfferings/ProductOfferingsCheckout/StyledProductOfferingsCheckout';
import Spinner from '../shared/Spinner/Spinner';
import { StyledDivider, StyledFlex, StyledText } from '../shared/styles/styled';

import ChartFilters from './shared/ChartFilters/ChartFilters';
import FOABarChart from './shared/Charts/FOABarChart';
import FOAComposedChart from './shared/Charts/FOAComposedChart';
import FOALineChart from './shared/Charts/FOALineChart';
import useChartBrush from './shared/Charts/hooks/useChartBrush';
import TimeSelectionLine from './TimeSelectionLine';
import {
  BAR_OR_LINE_GRAPH_TYPES,
  CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS,
  TIME_RANGE_TYPES,
} from './utils/constants';
import {
  getDefaultFrequencyVal,
  getFormikFiltersInitialValues,
  getShowFiltersType,
  TIME_RANGE_PRESENT_DAYS_OPTIONS,
} from './utils/initialValuesHelpers';
import { getTimeFormat, roundDownTime } from './utils/timeUtil';

const ConversationsStatistic = ({
  chartData,
  isChartDataFetching,
  title,
  filterTypes,
  xDataKeys,
  yLabel,
  withAverage,
  initialSavedFilter,
  legendLabels,
}) => {
  const { colors } = useTheme();

  const { currentUser } = useGetCurrentUser();

  const filterKey = title.split(/\s/).join('_').toUpperCase();

  const [filters, setFilters] = useLocalStorage(filterKey);
  const { endIndex, startIndex, isBrushUpdating } = useChartBrush({ filters });

  const [timeSelection, setTimeSelection] = useState(
    filters?.timeRange || TIME_RANGE_PRESENT_DAYS_OPTIONS?.find((range) => range.value === TIME_RANGE_TYPES.TODAY)
  );

  const isBarGraph = !withAverage && filters?.barOrLineGraph === BAR_OR_LINE_GRAPH_TYPES.BAR_GRAPH;
  const isLineGraph = !withAverage && filters?.barOrLineGraph === BAR_OR_LINE_GRAPH_TYPES.LINE_GRAPH;

  const renderChart = (data, frequency, indices) => {
    if (isBrushUpdating || isChartDataFetching) return <Spinner inline />;

    const frequencyValue = frequency?.value ?? 'data';

    const chartColors = [
      {
        color: colors.secondary,
        hoverColor: colors.reddishOrange,
      },
      {
        color: colors.primary,
        hoverColor: colors.raven,
      },
    ];

    const sharedProps = {
      data: data?.[frequencyValue],
      xAxisDataKey: 'startTime',
      xValueFormat: xDataKeys.map((key, index) => ({
        key,
        ...chartColors[index],
      })),

      tickFormatter: (value) => {
        if (value !== 'auto') {
          const parsedValue = parseISO(value);
          const roundedTime = roundDownTime(parsedValue, frequencyValue);

          return getInFormattedUserTimezone(roundedTime, currentUser?.timezone, getTimeFormat(frequencyValue));
        }

        return '';
      },
      startIndex: indices.startIndex,
      endIndex: indices.endIndex,
      yLabel,
      legendLabels,
    };

    if (isBarGraph) return <FOABarChart {...sharedProps} />;

    if (isLineGraph) return <FOALineChart {...sharedProps} />;

    return (
      <FOAComposedChart
        {...sharedProps}
        chartType={filters?.barOrLineGraph}
        movingAvgKey={
          filters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE] ? 'movingAverage' : ''
        }
      />
    );
  };

  return (
    <StyledCheckoutAccordion expanded>
      <StyledFlex gap="30px 0" px="23px">
        <StyledFlex direction="row" gap="10px" alignItems="center" flex="1 1 auto">
          <StyledText size={19} weight={700} lh={23} color={colors.primary}>
            {title}
          </StyledText>
        </StyledFlex>
        <StyledFlex>
          <TimeSelectionLine
            currentSelection={timeSelection.value}
            handleChange={(timeRangeValue) => {
              const timeRange = TIME_RANGE_PRESENT_DAYS_OPTIONS?.find((range) => range.value === timeRangeValue);

              const newShowFiltersType = getShowFiltersType(filterTypes);
              const newFilterValue = getFormikFiltersInitialValues(newShowFiltersType, filters, timeRange);

              setTimeSelection(timeRange);

              if (timeRangeValue === TIME_RANGE_TYPES.CUSTOM) {
                setFilters((prev) => ({ ...prev, timeRange }));
                return;
              }

              setFilters({ ...newFilterValue, timeRange });
            }}
            options={TIME_RANGE_PRESENT_DAYS_OPTIONS}
          />
          <StyledDivider borderWidth={2} color={colors.cardGridItemBorder} flexItem />
        </StyledFlex>
      </StyledFlex>
      <StyledFlex m="28px 0 0 0">
        <StyledFlex mb="24px">
          <StyledFlex padding="0 30px">
            <ChartFilters
              filters={filters}
              setFilters={setFilters}
              timeRangeTab={timeSelection}
              filterTypes={filterTypes}
              onTimeframeChange={(val, { name }) => {
                const customTimeRange = TIME_RANGE_PRESENT_DAYS_OPTIONS?.find(
                  (range) => range.value === TIME_RANGE_TYPES.CUSTOM
                );

                setFilters((prev) => ({
                  ...prev,
                  [name]: val,
                  timeRange: customTimeRange,
                  [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY]: getDefaultFrequencyVal(
                    val?.filterValue?.startTime,
                    val?.filterValue?.endTime
                  ),
                }));
                setTimeSelection(customTimeRange);
              }}
              initialSavedFilter={initialSavedFilter}
            />
          </StyledFlex>
        </StyledFlex>
        <StyledFlex minHeight="485px">
          {renderChart(chartData, filters?.frequency, { startIndex, endIndex })}
        </StyledFlex>
      </StyledFlex>
    </StyledCheckoutAccordion>
  );
};

export default React.memo(ConversationsStatistic);
