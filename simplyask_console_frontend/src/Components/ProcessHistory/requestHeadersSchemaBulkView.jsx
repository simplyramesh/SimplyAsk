import { isTwoTimeStampsEqual, modifyDateTimeToDescriptive, OBJECT_WILD_CARD_KEY } from '../../utils/helperFunctions';
import { processHistoryKeys } from '../../utils/serviceRequests';
import classes from './ProcessHistory.module.css';
import TicketsStatus from './ProcessHistoryStatus/TicketsStatus';

export const BULK_EXECUTION_KEYS = {
  SCHEDULED: 'scheduled',
  FAILURE_REASON: 'failure_reason',
  CREATION_TIME: 'createdAt',
  COMPLETED_AT: 'completedAt',
  ENDING_TIME: 'executedAt',
  EXECUTION_TIME: 'executionTime',
  CANCELLED: 'CANCELLED',
  EXECUTION_STATUS: 'executionStatus',
  FAILED: 'FAILED',
  ACCEPTED: 'ACCEPTED',
  PROCESSING: 'PROCESSING',
  statistic: 'statistic',
  failed: 'failed',
  success: 'success',
  processing: 'processing',
  total: 'total',

};

export const uniqueId = processHistoryKeys.PROCESS_ID;

export const getFormattedEndTime = (endingTime, executionStatus, isScheduled = false) => {
  if (isScheduled) return 'TBD (Scheduled)';
  if (executionStatus === BULK_EXECUTION_KEYS.CANCELLED) return 'Cancelled';
  if (executionStatus === BULK_EXECUTION_KEYS.FAILED) return '---';
  if (executionStatus === BULK_EXECUTION_KEYS.ACCEPTED) return 'TBD (Waiting To Execute)';
  if (executionStatus === BULK_EXECUTION_KEYS.PROCESSING) return 'TBD (In Progress)';

  if (!endingTime) return '---';
  return `${modifyDateTimeToDescriptive(endingTime)}`;
};

export const modifyTimeStamp = (val) => {
  if (!val) return <p>---</p>;

  const isScheduled = val[BULK_EXECUTION_KEYS.SCHEDULED];
  const creationTime = val[BULK_EXECUTION_KEYS.CREATION_TIME];
  const endTime = val[BULK_EXECUTION_KEYS.COMPLETED_AT];
  const executionStatus = val[BULK_EXECUTION_KEYS.EXECUTION_STATUS];
  const executionTime = val[BULK_EXECUTION_KEYS.EXECUTION_TIME];

  const getFormattedStartTime = (creationTime, executionTime) => {
    if (!creationTime) return '---';

    if (isTwoTimeStampsEqual(creationTime, executionTime)) {
      return `${modifyDateTimeToDescriptive(creationTime)}`;
    }

    return `${modifyDateTimeToDescriptive(executionTime)}`;
  };

  const formattedStartTime = getFormattedStartTime(creationTime, executionTime);
  const formattedEndTime = getFormattedEndTime(endTime, executionStatus, isScheduled);

  return (
    <div className={classes.flex_col}>
      <p className={classes.no_wrap}>
        {formattedStartTime}
      </p>
      <p className={classes.timeToBold}>to</p>
      <p className={classes.no_wrap}>
        {formattedEndTime}
      </p>
    </div>
  );
};

const modifyExecutionDetails = (val) => {
  if (!val) return <p>---</p>;

  const projectName = val[processHistoryKeys.PROCESS_NAME];
  const id = val[processHistoryKeys.FILE_ID];
  const source = val[processHistoryKeys.SOURCE];

  return (
    <div className={classes.flex_col}>
      <p className={classes.tableProjectName}>{projectName ?? '---'}</p>
      <p className={classes.tableProjectSource}>{source ?? '---'}</p>
      <p className={classes.tableProjectSource}>{`#${id}` ?? '---'}</p>
    </div>
  );
};

const modifyExecutionStatus = (val) => {
  if (!val) return <p>---</p>;

  let completed = val?.statistic?.success;
  const total = val?.statistic?.total;
  const isScheduled = val[BULK_EXECUTION_KEYS.SCHEDULED];
  const executionStatus = val[BULK_EXECUTION_KEYS.EXECUTION_STATUS];
  const isExecutionStatusFailed = executionStatus === BULK_EXECUTION_KEYS.FAILED;

  if (executionStatus === BULK_EXECUTION_KEYS.CANCELLED) {
    return (
      <div className={classes.flex_col}>
        <p className={`${classes.tableProjectSource} ${classes.centerText}`}>Cancelled</p>
      </div>
    );
  }

  if (isScheduled) return <p className={classes.centerText}>Scheduled</p>;

  if (isExecutionStatusFailed || !val.statistic) return <p className={`${classes.centerText} ${classes.capitalize}`}>{executionStatus?.toLowerCase() ?? '---'}</p>;

  if (total === 0) {
    completed = 0;
  } else { completed = Math.round((parseInt(completed, 10) / total) * 100); }

  const secondString = `${completed}% Success`;

  return (
    <div className={classes.flex_col}>
      <p className={`${classes.tableProjectSource} ${classes.centerText} ${classes.capitalize}`}>{executionStatus?.toLowerCase() ?? '---'}</p>
      <p className={`${classes.tableProjectName} ${classes.centerText}`}>{secondString}</p>
    </div>
  );
};

const formatStatus = (val) => {
  if (!val) return <p>---</p>;
  const isExecutionStatusFailed = val?.executionStatus === BULK_EXECUTION_KEYS.FAILED;

  return <TicketsStatus status={isExecutionStatusFailed ? 'Rejected' : 'Accepted'} />;
};

const tableHeaderKeys = {
  EXECUTION_DETAILS: 'Execution Details',
  UPLOAD_NAME: 'Upload Name',
  START_AND_END_TIME: 'Start & End Time',
  UPLOAD_STATUS: 'Upload Status',
  EXECUTION_STATUS: 'Execution Status',
};

const bulkViewTableHeaders = [
  {
    name: tableHeaderKeys.EXECUTION_DETAILS,
    source: OBJECT_WILD_CARD_KEY,
    formatter: modifyExecutionDetails,
  },
  {
    name: tableHeaderKeys.UPLOAD_NAME,
    source: processHistoryKeys.FILE_NAME_BULK_TABLE,
  },
  {
    name: tableHeaderKeys.START_AND_END_TIME,
    source: OBJECT_WILD_CARD_KEY,
    formatter: modifyTimeStamp,
  },
  {
    name: tableHeaderKeys.UPLOAD_STATUS,
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: formatStatus,
  },
  {
    name: tableHeaderKeys.EXECUTION_STATUS,
    source: OBJECT_WILD_CARD_KEY,
    formatter: modifyExecutionStatus,
  },
];

export default bulkViewTableHeaders;
