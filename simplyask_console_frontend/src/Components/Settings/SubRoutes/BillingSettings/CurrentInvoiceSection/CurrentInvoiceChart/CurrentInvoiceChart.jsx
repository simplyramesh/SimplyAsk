/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import { dynamicSortBasedOnKeys } from '../../../../../../utils/helperFunctions';
import DoughnutReactChart from '../../../../../Charts/DoughnutChart/DoughnutReactChart';
// eslint-disable-next-line no-unused-vars
import Spinner from '../../../../../shared/Spinner/Spinner';
import classes from './CurrentInvoiceChart.module.css';

const AdditionalCostChartCenteredText = (mainText = '', cost = 0, totalCost = 0) => {
  const percentageCost = Math.round((cost / totalCost) * 100);

  return (
    <div className={`${classes.absolute_center} ${classes.text_center} ${classes.fadeIn}`}>
      <div className={classes.center_text}>
        {mainText}: <strong>${cost}</strong>
      </div>
      <div className={classes.percentageCost}>{percentageCost}%</div>
    </div>
  );
};

const CHART_HOVER_SORT_KEY = 'totalCost';
const CHART_SORT_KEY = 'price';

const CurrentInvoiceChart = ({ data }) => {
  const chartColors = {
    PRIMARY: 'rgba(45, 58, 71, 1)',
    SECONDARY: 'rgba(245, 123, 32, 1)',
    LIGHT_BLUE: 'rgba(56, 101, 163, 1)',
  };

  const chartLabels = {
    TRANSACTION_FEES: 'Transaction Fees',
    ADDITIONAL_FEES: 'Add-On Fees',
    PLAN_RATE: 'Plan Rate',
  };

  const CHART_CLICKED_KEYS = {
    INDEX: 'index',
    BACKGROUND_COLOR: 'backgroundColor',
    DATA_SET: 'dataSet',
  };

  const CHART_DATA_INDEX = 0;

  const [totalPrice, setTotalPrice] = useState();

  // eslint-disable-next-line no-unused-vars
  const [, setLoadingChart] = useState(true);

  const [chartBreakDownOrder, setChartBreakDownOrder] = useState();

  const [centerTextManually, setCenterTextManually] = useState();
  const [isHoveringOnChart, setIsHoveringOnChart] = useState(false);
  const [getClickedElementIndex, setGetClickedElementIndex] = useState();

  const setDefaultChartOrder = () => {
    const totalCost = data.additionalCostSum + data.transactionCostSum + data.monthlyPlanCostSum;

    setChartBreakDownOrder(
      [
        {
          [CHART_SORT_KEY]: data.additionalCostSum ?? 0,
          cssCircleClass: 'primaryDot',
          title: chartLabels.ADDITIONAL_FEES,
          backgroundColor: chartColors.PRIMARY,
          fadedBackgroundColor: '#7F8F9F',
          dataArrayKey: [...data.additionalCostBreakdown].sort(dynamicSortBasedOnKeys(CHART_HOVER_SORT_KEY)).reverse(),

          isAdditionalCost: true,
          isPlanRateData: false,
          centeredComponent: () =>
            AdditionalCostChartCenteredText('Additional Fees', data.additionalCostSum, totalCost),
        },
        {
          [CHART_SORT_KEY]: data.transactionCostSum ?? 0,
          cssCircleClass: 'lightBlueDot',
          title: chartLabels.TRANSACTION_FEES,
          backgroundColor: chartColors.LIGHT_BLUE,
          fadedBackgroundColor: 'rgba(175, 200, 235, 1)',
          dataArrayKey: [...data.transactionCostBreakdown].sort(dynamicSortBasedOnKeys(CHART_HOVER_SORT_KEY)).reverse(),
          isPlanRateData: false,
          centeredComponent: () =>
            AdditionalCostChartCenteredText('Transaction Fees', data.transactionCostSum, totalCost),
        },
        {
          [CHART_SORT_KEY]: data.monthlyPlanCostSum ?? 0,
          cssCircleClass: 'planRateDot',
          title: chartLabels.PLAN_RATE,
          backgroundColor: chartColors.SECONDARY,
          fadedBackgroundColor: '#FAC8A2',
          isPlanRateData: true,
          monthlyPlanCostSum: data.monthlyPlanCostSum,
          centeredComponent: () => AdditionalCostChartCenteredText('Plan Rate', data.monthlyPlanCostSum, totalCost),
        },
      ]
        .sort(dynamicSortBasedOnKeys(CHART_SORT_KEY))
        .reverse()
    );
  };

  useEffect(() => {
    if (!isHoveringOnChart && chartBreakDownOrder) {
      const calculateTotalCost = () => {
        const totalPrice = chartBreakDownOrder?.reduce(
          (partialSum, currentPrice) => partialSum + currentPrice?.price,
          0
        );

        return totalPrice ?? 0;
      };

      setTotalPrice(calculateTotalCost());
      setCenterTextManually({ labelText: '', value: true, label: `$${calculateTotalCost()}` });

      setGetClickedElementIndex();
    }
  }, [chartBreakDownOrder, isHoveringOnChart]);

  useEffect(() => {
    if (getClickedElementIndex && chartBreakDownOrder) {
    }
  }, [data, getClickedElementIndex, chartBreakDownOrder]);

  useEffect(() => {
    if (!getClickedElementIndex) {
      setDefaultChartOrder();
    }
  }, [data, getClickedElementIndex]);

  useEffect(() => {
    if (data) {
      setDefaultChartOrder();
    }
  }, [data]);

  useEffect(() => {
    if (totalPrice) setLoadingChart(false);
  }, [totalPrice]);

  const DisplayChartBreakDown = useCallback(() => {
    if (!chartBreakDownOrder) return <></>;

    if (getClickedElementIndex) {
      const planRateData = getClickedElementIndex[CHART_CLICKED_KEYS.DATA_SET];

      if (planRateData.isPlanRateData) {
        return (
          <div className={`${classes.flex_row} ${classes.fadeIn}`}>
            <div
              className={classes.circle_icon}
              style={{
                backgroundColor: getClickedElementIndex[CHART_CLICKED_KEYS.BACKGROUND_COLOR],
              }}
            />
            <div className={classes.chartLabelText}>
              Plan Rate{' '}
              <span className={classes.chartLabelTextBold}>: ${planRateData.monthlyPlanCostSum ?? '---'}</span>
            </div>
          </div>
        );
      }

      return getClickedElementIndex[CHART_CLICKED_KEYS.DATA_SET].dataArrayKey.map((item, index) => {
        return (
          <div className={`${classes.flex_row} ${classes.fadeIn}`} key={index}>
            <div
              className={classes.circle_icon}
              style={{
                backgroundColor: getClickedElementIndex[CHART_CLICKED_KEYS.BACKGROUND_COLOR],
              }}
            />
            <div className={`${classes.chartLabelText} ${classes.breakLine}`}>
              {getClickedElementIndex[CHART_CLICKED_KEYS.DATA_SET].isAdditionalCost && 'Additional '}
              {item.itemName} <span className={classes.chartLabelTextBold}>: ${item?.totalCost ?? '---'}</span>
            </div>
          </div>
        );
      });
    }

    return (
      chartBreakDownOrder?.map((item, index) => {
        return (
          <div className={`${classes.flex_row} ${classes.fadeIn}`} key={index}>
            <div className={classes[item.cssCircleClass]} />
            <div className={classes.chartLabelText}>
              {item.title}{' '}
              <span className={classes.chartLabelTextBold}>
                ($
                {item?.price ?? '---'})
              </span>
            </div>
          </div>
        );
      }) ?? <></>
    );
  }, [chartBreakDownOrder, getClickedElementIndex]);

  if (!chartBreakDownOrder) return <></>;

  const handleClickOnChart = (data) => {
    const getIndex = data[CHART_DATA_INDEX]?._index;
    const getColor = data[CHART_DATA_INDEX]?._options.backgroundColor;
    if (getIndex !== undefined) {
      setGetClickedElementIndex({
        [CHART_CLICKED_KEYS.INDEX]: getIndex,
        [CHART_CLICKED_KEYS.BACKGROUND_COLOR]: getColor,
        [CHART_CLICKED_KEYS.DATA_SET]: chartBreakDownOrder[getIndex],
      });
    }
  };

  const config = {
    type: 'doughnut',

    data: {
      labels: chartBreakDownOrder.map((item) => item.title),
      datasets: [
        {
          data: chartBreakDownOrder.map((item) => item.price),
          backgroundColor: chartBreakDownOrder.map((item) => item.backgroundColor),
          borderWidth: [6, 6, 6],
        },
      ],
    },
    options: {
      devicePixelRatio: 2.5,

      onClick: (e, data) => handleClickOnChart(data),
      cutoutPercentage: 60,

      legend: {
        display: false,
      },
    },
  };

  // if (loadingChart || !centerTextManually) return <Spinner parent />;

  return (
    <div className={classes.root}>
      <div
        className={classes.wrapChart}
        onMouseEnter={() => setIsHoveringOnChart(true)}
        onMouseLeave={() => setIsHoveringOnChart(false)}
      >
        <DoughnutReactChart
          config={config}
          chartSize={280}
          centerTextManually={centerTextManually}
          chartBreakDownOrder={chartBreakDownOrder}
          hideCenterTextTransitions
          unBoldTooltipText
          showCursorOnHover
          ShowNewCenteredComponent={getClickedElementIndex?.[CHART_CLICKED_KEYS.DATA_SET]?.centeredComponent}
        />
      </div>

      <div className={classes.chartLabelParent}>
        <DisplayChartBreakDown />
      </div>
    </div>
  );
};

export default CurrentInvoiceChart;

CurrentInvoiceChart.propTypes = {
  data: PropTypes.object,
};
