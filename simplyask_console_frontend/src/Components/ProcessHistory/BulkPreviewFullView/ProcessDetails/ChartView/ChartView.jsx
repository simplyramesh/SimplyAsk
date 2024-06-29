import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// import DoughnutChart from '../../../../Charts/DoughnutChart/DoughnutChart';
import DoughnutReactChart from '../../../../Charts/DoughnutChart/DoughnutReactChart';
import Spinner from '../../../../shared/Spinner/Spinner';
import { BULK_EXECUTION_KEYS } from '../../../requestHeadersSchemaBulkView';
import classes from './ChartView.module.css';

const ChartView = ({ chartDataValues, chartSectionApiOriginalResp }) => {
  const chartColors = {
    GREEN: '#5F9936',
    RED: '#E03B24',
    BLUE: '#3865a3',
  };

  const chartLabels = {
    SUCCESS: 'Successful',
    FAILED: 'Failed',
    IN_PROGRESS: 'In-Progress',
    SCHEDULED: 'Scheduled',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
    WAITING_TO_EXECUTE: 'Accepted',
    EXECUTED: 'Executed',
  };

  const [loadingChart, setLoadingChart] = useState(true);
  const [isHoveringOnChart, setIsHoveringOnChart] = useState(false);

  const [centerTextManually, setCenterTextManually] = useState();

  useEffect(() => {
    if (chartDataValues && !isHoveringOnChart) {
      if (chartDataValues.executed_count === 0) {
        setCenterTextManually({ value: false });
        return;
      }
      const roundedValue = Math.round((chartDataValues.executed_count
        / chartDataValues.total_count
      ) * 100);

      setCenterTextManually({ value: true, label: `${roundedValue}%`, labelText: chartLabels.EXECUTED });
    }
  }, [chartDataValues, isHoveringOnChart]);

  useEffect(() => {
    if (centerTextManually) setLoadingChart(false);
  }, [centerTextManually]);

  const tooltipLabels = (tooltipItem, data) => {
    const index = tooltipItem?.index;
    const labelText = data.labels[index];
    const renderText = '';
    let processText = 'Processes';

    if (chartLabels.SUCCESS === labelText) {
      const roundedValue = Math.round((chartDataValues.success_count / chartDataValues.total_count) * 100);
      setCenterTextManually({ value: true, label: `${roundedValue}%`, labelText: chartLabels.SUCCESS });
      if (chartDataValues.success_count < 2) processText = 'Process';

      return `   ${chartDataValues.success_count} ${processText} ${labelText}`;
    }
    if (chartLabels.FAILED === labelText) {
      const roundedValue = Math.round((chartDataValues.failed_count / chartDataValues.total_count) * 100);
      setCenterTextManually({ value: true, label: `${roundedValue}%`, labelText: chartLabels.FAILED });
      if (chartDataValues.failed_count < 2) processText = 'Process';

      return `   ${chartDataValues.failed_count} ${processText} ${labelText}`;
    }
    if (chartLabels.IN_PROGRESS === labelText) {
      const roundedValue = Math.round((chartDataValues.inProgress_count / chartDataValues.total_count) * 100);
      setCenterTextManually({ value: true, label: `${roundedValue}%`, labelText: chartLabels.IN_PROGRESS });
      if (chartDataValues.inProgress_count < 2) processText = 'Process';

      return `   ${chartDataValues.inProgress_count} ${processText} ${labelText}`;
    }

    return renderText;
  };

  const config = {
    type: 'doughnut',

    data: {
      labels: [
        chartLabels.SUCCESS,
        chartLabels.FAILED,
        chartLabels.IN_PROGRESS,
        chartLabels.SCHEDULED,
        chartLabels.REJECTED,
        chartLabels.CANCELLED,
        chartLabels.WAITING_TO_EXECUTE,
      ],
      datasets: [
        {
          data: [
            chartDataValues?.completed,
            chartDataValues?.failed,
            chartDataValues?.inProgress,
            chartDataValues?.isScheduled,
            chartDataValues?.failureReason,
            chartDataValues?.canceled,
            chartDataValues?.waitingToExecute,
          ],
          backgroundColor: [
            chartColors.GREEN,
            chartColors.RED,
            chartColors.BLUE,
            chartColors.BLUE,
            chartColors.RED,
            chartColors.RED,
            chartColors.BLUE,
          ],

          borderWidth: [6, 6, 6, 6, 6, 6],
        },
      ],
    },
    options: {
      devicePixelRatio: 2.5,

      cutoutPercentage: 60,

      legend: {
        display: false,
      },

      tooltips: {
        caretPadding: 90,
        bodyFontSize: 15,
        caretSize: 10,
        xPadding: 10,
        yPadding: 12,
        cornerRadius: 10,
        bodyFontFamily: "'Montserrat' ,'Helvetica Neue' , 'Helvetica' , 'Arial', sans-serif",

        callbacks: {
          label: tooltipLabels,
        },
      },
    },
  };

  if (loadingChart) {
    return (
      <div className={`${classes.root} ${classes.chartHeightLoader}`}>
        <Spinner parent />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div
        className={classes.wrapChart}
        onBlur={() => {}}
        onFocus={() => {}}
        onMouseOver={() => setIsHoveringOnChart(true)}
        onMouseOut={() => setIsHoveringOnChart(false)}
      >

        <DoughnutReactChart config={config} chartSize={260} centerTextManually={centerTextManually} />
      </div>
      {(() => {
        if (chartDataValues?.waitingToExecute === 100) {
          return <div className={classes.chart_below_text_width}>Waiting for execution</div>;
        }
        if (chartSectionApiOriginalResp?.[BULK_EXECUTION_KEYS.EXECUTION_STATUS]
      === BULK_EXECUTION_KEYS.FAILED) {
          return <div className={classes.chart_below_text_width}>Executions Failed</div>;
        }
        if (chartSectionApiOriginalResp?.[BULK_EXECUTION_KEYS.EXECUTION_STATUS]
      === BULK_EXECUTION_KEYS.CANCELLED) {
          return <div className={classes.chart_below_text_width}>Executions cancelled</div>;
        }
        if (chartSectionApiOriginalResp?.[BULK_EXECUTION_KEYS.SCHEDULED] === true) {
          return (
            <div className={classes.chart_below_text_width}>Executions scheduled</div>
          );
        }
        return (
          <div className={classes.chart_below_text_width}>
            {chartDataValues.success_count + chartDataValues.failed_count > 0
              ? chartDataValues.success_count + chartDataValues.failed_count : 0}
            {' '}
            out of
            {' '}
            {chartDataValues.total_count > 0 ? chartDataValues.total_count : 0}
            {' '}
            <div> processes executed</div>
          </div>
        );
      })()}
    </div>
  );
};

export default ChartView;

ChartView.propTypes = {
  chartDataValues: PropTypes.shape({
    completed: PropTypes.number,
    failed: PropTypes.number,
    inProgress: PropTypes.number,
    isScheduled: PropTypes.number,
    failureReason: PropTypes.number,
    canceled: PropTypes.number,
    waitingToExecute: PropTypes.number,
    success_count: PropTypes.number,
    total_count: PropTypes.number,
    failed_count: PropTypes.number,
    executed_count: PropTypes.number,
    inProgress_count: PropTypes.number,
  }),
  chartSectionApiOriginalResp: PropTypes.shape({
    completedAt: PropTypes.string,
    contentType: PropTypes.string,
    createdAt: PropTypes.string,
    executedAt: PropTypes.string,
    executionDetails: PropTypes.arrayOf(PropTypes.shape({
      data: PropTypes.string,
      executionStatus: PropTypes.string,
      header: PropTypes.string,
      processInstanceId: PropTypes.string,
      serialNumber: PropTypes.string,
      serviceRequestId: PropTypes.string,
    })),
    executionStatus: PropTypes.string,
    executionTime: PropTypes.string,
    filename: PropTypes.string,
    id: PropTypes.string,
    orgId: PropTypes.string,
    parsedData: PropTypes.shape({
      [PropTypes.number]: PropTypes.shape({
        leadId: PropTypes.string,
        status: PropTypes.string,
      }),
    }),
    processId: PropTypes.string,
    scheduled: PropTypes.bool,
    source: PropTypes.string,
    statistic: PropTypes.shape({
      failed: PropTypes.number,
      processing: PropTypes.number,
      success: PropTypes.number,
      total: PropTypes.number,
    }),
    url: PropTypes.string,
    userId: PropTypes.string,
    workflowName: PropTypes.string,
  }),
};
