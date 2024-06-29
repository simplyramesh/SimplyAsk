import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import DownloadIcon from '../../../../Assets/icons/Process_History_Process_Details_Download_Icon.png';
import { useUser } from '../../../../contexts/UserContext';
import {
  convertUserTimeZoneToAbbr,
  isTwoTimeStampsEqual,
  modifyDateTimeToDescriptive,
} from '../../../../utils/helperFunctions';
import Spinner from '../../../shared/Spinner/Spinner';
import TicketStatus from '../../ProcessHistoryStatus/TicketsStatus';
import { BULK_EXECUTION_KEYS, getFormattedEndTime } from '../../requestHeadersSchemaBulkView';

import ChartView from './ChartView/ChartView';
import classes from './ProcessDetails.module.css';

const FULFILLMENT_PATH = '/fulfillment';

const ProcessDetails = ({
  setDeleteModal,
  chartSectionApiOriginalResp,
  isLoadingChartSection,
  errorChart,
  chartApiKeys,
}) => {
  const { user } = useUser();

  const [chartDataValues, setChartDataValues] = useState();
  const [singleExecutionFileDownloadUrl, setSingleExecutionFileDownloadUrl] = useState();

  const calculatePercentage = (stat, total) => {
    if (!total || !stat) return 0;

    const statNumber = Number(stat);
    const totalNumber = Number(total);
    return (statNumber / totalNumber) * 100;
  };

  useEffect(() => {
    const setChartData = () => {
      const statistics = chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.statistic];
      const isScheduled = chartSectionApiOriginalResp?.[BULK_EXECUTION_KEYS.SCHEDULED];
      const isCancelled = chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.EXECUTION_STATUS] === BULK_EXECUTION_KEYS.CANCELLED ?? false;
      const isFailed = chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.EXECUTION_STATUS] === BULK_EXECUTION_KEYS.FAILED ?? false;

      if (isFailed) {
        setChartDataValues({
          isScheduled: 0,
          completed: 0,
          inProgress: 0,
          failed: 100,
          success_count: 0,
          failed_count: 0,
          executed_count: 0,
          inProgress_count: 0,
          total_count: 0,
          failureReason: 0,
          canceled: 0,
          waitingToExecute: 0,
        });
        return;
      }

      if (!statistics && !isScheduled && !isCancelled) {
        setChartDataValues({
          isScheduled: 0,
          completed: 0,
          inProgress: 0,
          failed: 0,
          success_count: 0,
          failed_count: 0,
          executed_count: 0,
          inProgress_count: 0,
          total_count: 0,
          failureReason: 0,
          canceled: 0,
          waitingToExecute: 100,
        });
        return;
      }

      const total_count = chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.statistic]?.[BULK_EXECUTION_KEYS.total];

      const inProgressWithoutPercentage = chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.statistic]?.[BULK_EXECUTION_KEYS.processing];

      const failedWithoutPercentage = chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.statistic]?.[BULK_EXECUTION_KEYS.failed];

      const success_count = chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.statistic]?.[BULK_EXECUTION_KEYS.success];

      const failed_count = failedWithoutPercentage;
      const executed_count = success_count + failedWithoutPercentage;

      const fileRejected = chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.EXECUTION_STATUS] === BULK_EXECUTION_KEYS.FAILED ?? false;

      const inProgress = calculatePercentage(inProgressWithoutPercentage, total_count);
      const failed = calculatePercentage(failedWithoutPercentage, total_count);
      const completed = calculatePercentage(success_count, total_count);

      if (isCancelled) {
        setChartDataValues({
          isScheduled: 0,
          completed: 0,
          inProgress: 0,
          failed: 0,
          success_count: 0,
          failed_count: 0,
          executed_count: 0,
          inProgress_count: 0,
          total_count: 0,
          failureReason: 0,
          canceled: 100,
        });
      } else if (fileRejected) {
        setChartDataValues({
          isScheduled: 0,
          completed: 0,
          inProgress: 0,
          failed: 0,
          success_count: 0,
          failed_count: 0,
          executed_count: 0,
          inProgress_count: 0,
          total_count: 0,
          failureReason: 100,
          canceled: 0,
        });
      } else if (isScheduled) {
        setChartDataValues({
          isScheduled: 100,
          completed: 0,
          inProgress: 0,
          failed: 0,
          success_count: 0,
          failed_count: 0,
          executed_count: 0,
          inProgress_count: 0,
          total_count: 0,
          failureReason: 0,
          canceled: 0,
        });
      } else {
        setChartDataValues({
          isScheduled: 0,
          inProgress,
          completed,
          failed,
          success_count,
          failed_count,
          executed_count,
          inProgress_count: inProgressWithoutPercentage,
          total_count,
          failureReason: 0,
          canceled: 0,
        });
      }
    };
    if (chartSectionApiOriginalResp && !isLoadingChartSection && user) {
      setSingleExecutionFileDownloadUrl(`${chartSectionApiOriginalResp?.[chartApiKeys.URL]}?timezone=${user.timezone}`);
      setChartData();
    }
  }, [isLoadingChartSection, chartSectionApiOriginalResp, user]);

  useEffect(() => {
    if (singleExecutionFileDownloadUrl?.startsWith(FULFILLMENT_PATH)) {
      const filteredDownloadUrl = `${import.meta.env.VITE_CATALOG_URL}${singleExecutionFileDownloadUrl.replace(FULFILLMENT_PATH, '')}`;
      setSingleExecutionFileDownloadUrl(filteredDownloadUrl);
    }
  }, [singleExecutionFileDownloadUrl]);

  const getFormattedStartTime = (creationTime, executionTime) => {
    if (!creationTime) return '---';

    if (isTwoTimeStampsEqual(creationTime, executionTime)) {
      return `${modifyDateTimeToDescriptive(creationTime)} ${convertUserTimeZoneToAbbr(user?.timezone)}`;
    }

    return `${modifyDateTimeToDescriptive(executionTime)} ${convertUserTimeZoneToAbbr(user?.timezone)}`;
  };

  const confirmCancelScheduledProcess = async () => {
    setDeleteModal(true);
  };

  const ProcessDetailsTopSection = () => (
    <div className={classes.process_details_gap}>
      <div>
        <div className={classes.file_name_header_font_format}>
          {chartSectionApiOriginalResp[chartApiKeys.FILE_NAME] ?? '---'}
        </div>
        {chartSectionApiOriginalResp?.[chartApiKeys.SOURCE] === chartApiKeys.FILE_UPLOAD && (
          <a
            href={chartSectionApiOriginalResp?.[chartApiKeys.URL]}
            target="_blank"
            className={`${classes.justify_center} ${classes.falloutReportExportButtons} ${classes.flex_row} ${classes.process_details_button_alignment}`}
            rel="noreferrer"
          >
            <div className={classes.downloadImgParent}>
              <img src={DownloadIcon} alt="" />
            </div>
            <div className="">
              <div>Download Bulk File</div>
            </div>
          </a>
        )}
        {chartSectionApiOriginalResp?.[chartApiKeys.SOURCE] === chartApiKeys.MANUAL_ENTRY && (
          <a
            href={singleExecutionFileDownloadUrl}
            target="_blank"
            className={`${classes.justify_center} ${classes.falloutReportExportButtons} ${classes.flex_row} ${classes.process_details_button_alignment}`}
            rel="noreferrer"
          >
            <div className={classes.downloadImgParent}>
              <img src={DownloadIcon} alt="" />
            </div>
            <div className="">
              <div>Download Bulk File</div>
            </div>
          </a>
        )}
      </div>
      <div className={`${classes.flex_row} ${classes.justify_between}`}>
        <div className={classes.process_details_left_side_text_format}> Upload Status</div>
        <div>
          <TicketStatus
            status={
              chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.EXECUTION_STATUS] === BULK_EXECUTION_KEYS.FAILED
                ? 'Rejected'
                : 'Accepted'
            }
          />
        </div>
      </div>
      <div className={`${classes.justify_between} ${classes.flex_row}`}>
        <div className={classes.process_details_left_side_text_format}> Execution Status</div>
        <div className={classes.capitalize}>
          {chartSectionApiOriginalResp[BULK_EXECUTION_KEYS.EXECUTION_STATUS]?.toLowerCase()}
        </div>
      </div>
    </div>
  );

  const ProcessDetailsBottomSection = () => (
    <div className={classes.process_details_gap_bottom}>
      <div className={`${classes.justify_between} ${classes.flex_row}`}>
        <div className={classes.process_details_left_side_text_format}> Workflow Name</div>
        <div>{chartSectionApiOriginalResp[chartApiKeys.PROCESS_NAME] ?? '---'}</div>
      </div>
      <div className={`${classes.justify_between} ${classes.flex_row}`}>
        <div className={classes.process_details_left_side_text_format}> Execution Method</div>
        <div>{chartSectionApiOriginalResp[chartApiKeys.SOURCE] ?? '---'}</div>
      </div>
      <div className={`${classes.justify_between} ${classes.flex_row}`}>
        <div className={classes.process_details_left_side_text_format}> Start Time</div>
        <div>
          {getFormattedStartTime(
            chartSectionApiOriginalResp[chartApiKeys.CREATION_TIME],
            chartSectionApiOriginalResp?.[BULK_EXECUTION_KEYS.EXECUTION_TIME],
          )}
        </div>
      </div>
      <div className={`${classes.justify_between} ${classes.flex_row}`}>
        <div className={classes.process_details_left_side_text_format}> End Time</div>
        <div>
          {getFormattedEndTime(
            chartSectionApiOriginalResp?.[BULK_EXECUTION_KEYS.COMPLETED_AT],
            chartSectionApiOriginalResp?.[BULK_EXECUTION_KEYS.EXECUTION_STATUS],
            chartSectionApiOriginalResp?.[BULK_EXECUTION_KEYS.SCHEDULED],
          )}
          {' '}
        </div>
      </div>
      {chartSectionApiOriginalResp?.scheduled === true
          && chartSectionApiOriginalResp?.bulk_status !== chartApiKeys.CANCELED && (
        <div className={`${classes.justify_between} ${classes.flex_row}`}>
            <div className={classes.link_color} onClick={confirmCancelScheduledProcess}>
            Cancel Scheduled Execution
          </div>
          </div>
      )}
    </div>
  );

  if (errorChart) return <div>{errorChart}</div>;
  if (!chartSectionApiOriginalResp || isLoadingChartSection) {
    return (
      <div className={`${classes.root_loader}`}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={`${classes.root} ${classes.process_details_margin_right_full_section}`}>
      <div className={classes.process_details_top_property}>
        <ProcessDetailsTopSection />
        <div className={classes.margin_top_35px}>
          <ChartView chartSectionApiOriginalResp={chartSectionApiOriginalResp} chartDataValues={chartDataValues} />
        </div>
      </div>
      <div className={classes.process_details_bottom_property}>
        <ProcessDetailsBottomSection />
        {' '}
      </div>
    </div>
  );
};

export default ProcessDetails;

ProcessDetails.propTypes = {
  setDeleteModal: PropTypes.func,
  // fileID: PropTypes.arrayOf(PropTypes.string),
  chartSectionApiOriginalResp: PropTypes.shape({
    completedAt: PropTypes.string,
    contentType: PropTypes.string,
    createdAt: PropTypes.string,
    executedAt: PropTypes.string,
    executionDetails: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.string,
        executionStatus: PropTypes.string,
        header: PropTypes.string,
        processInstanceId: PropTypes.string,
        serialNumber: PropTypes.string,
        serviceRequestId: PropTypes.string,
      }),
    ),
    executionStatus: PropTypes.string,
    executionTime: PropTypes.string,
    filename: PropTypes.string,
    id: PropTypes.string,
    orgId: PropTypes.string,
    parsedData: PropTypes.shape({
      leadId: PropTypes.string,
      status: PropTypes.string,
    }),
    previewData: PropTypes.arrayOf(PropTypes.string),
    processId: PropTypes.string,
    bulk_status: PropTypes.string,
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
  isLoadingChartSection: PropTypes.bool,
  errorChart: PropTypes.string,
  chartApiKeys: PropTypes.shape({
    CANCELED: PropTypes.string,
    COMPLETED: PropTypes.string,
    CREATION_TIME: PropTypes.string,
    EXECUTION_TIME: PropTypes.string,
    FAILED: PropTypes.string,
    FAILED_COUNT: PropTypes.string,
    FAILURE_REASON: PropTypes.string,
    FILE_ID: PropTypes.string,
    FILE_NAME: PropTypes.string,
    FILE_UPLOAD: PropTypes.string,
    INPROGRESS: PropTypes.string,
    INPROGRESS_COUNT: PropTypes.string,
    IS_SCHEDULED: PropTypes.string,
    MANUAL_ENTRY: PropTypes.string,
    PROCESS_NAME: PropTypes.string,
    SOURCE: PropTypes.string,
    STATUS: PropTypes.string,
    SUCCESS_COUNT: PropTypes.string,
    TOTAL_COUNT: PropTypes.string,
    URL: PropTypes.string,
    USER_ID: PropTypes.string,
  }),
};
