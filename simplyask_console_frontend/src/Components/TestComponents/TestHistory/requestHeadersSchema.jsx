import { formatInTimeZone } from 'date-fns-tz';
import React from 'react';

import { MANAGER_API_KEYS } from '../../../config/managerKeys';
import {
  TEST_HISTORY_KEYS, TEST_HISTORY_STATUSES, TEST_HISTORY_STATUSES_MAP,
} from '../../../config/test';
import { calculatePercentage, getDescriptiveDateFromDateString, OBJECT_WILD_CARD_KEY } from '../../../utils/helperFunctions';
import Spinner from '../../shared/Spinner/Spinner';
import TicketsStatus from '../../shared/TicketStatus/TicketsStatus';
import ModifyTags from './ModifyTags';
import classes from './TestHistory.module.css';

export const uniqueId = OBJECT_WILD_CARD_KEY;

export const tableHeaderKeys = {
  TEST_SUITE_NAME: 'Test Suite Name',
  TAGS: 'Tags',
  NUM_TEST_CASES: 'Test Cases',
  START_AND_END_TIME: 'Start & End Time',
  STATUS: 'Status',
  EXECUTION_STATUS: 'Execution Results',
};

const EXECUTING_TBD = 'TBD (Executing)';
const PREPARING_TBD = 'TBD (Preparing)';
const FINALIZING_TBD = 'TBD (Finalizing)';

const statusesMap = {
  [TEST_HISTORY_STATUSES.EXECUTING]: EXECUTING_TBD,
  [TEST_HISTORY_STATUSES.PREPARING]: PREPARING_TBD,
  [TEST_HISTORY_STATUSES.FINALIZING]: FINALIZING_TBD,
};

export const computeEndDateAndTime = (status, endTime, timeEnd, returnTextOnly = false) => {
  if (status === TEST_HISTORY_STATUSES.EXECUTING) {
    if (returnTextOnly) return EXECUTING_TBD;

    return (
      <p className={classes.no_wrap}>{EXECUTING_TBD}</p>
    );
  }
  if (status === TEST_HISTORY_STATUSES.PREPARING) {
    if (returnTextOnly) return PREPARING_TBD;

    return (
      <p className={classes.no_wrap}>{PREPARING_TBD}</p>
    );
  }
  if (status === TEST_HISTORY_STATUSES.FINALIZING) {
    if (returnTextOnly) return FINALIZING_TBD;

    return (
      <p className={classes.no_wrap}>{FINALIZING_TBD}</p>
    );
  }

  if (returnTextOnly) return `${getDescriptiveDateFromDateString(endTime)} - ${timeEnd ?? '---'}`;

  return (
    <p className={classes.no_wrap}>
      {getDescriptiveDateFromDateString(endTime)}
      {' '}
      -
      {' '}
      {timeEnd ?? '---'}
    </p>
  );
};

export const ModifyTimeStamp = ({ timezone, val }) => {
  if (!val) return <p>---</p>;

  const startTime = val[TEST_HISTORY_KEYS.START_AT];
  const endTime = val[TEST_HISTORY_KEYS.END_AT];
  const status = val[TEST_HISTORY_KEYS.STATUS];

  let timeStart; let timeEnd; let
    incidentDate;

  if (startTime && startTime !== '---') {
    incidentDate = new Date(startTime);
    timeStart = formatInTimeZone(incidentDate, timezone, 'LLLL d, yyyy - p');
  }

  if (endTime && endTime !== '---') {
    incidentDate = new Date(endTime);

    timeEnd = formatInTimeZone(incidentDate, timezone, 'LLLL d, yyyy - p');
  } else {
    timeEnd = statusesMap[status] || '---';
  }

  return (
    <div className={classes.flex_col}>
      <p className={classes.no_wrap}>
        {timeStart ?? '---'}
      </p>
      <p className={classes.timeToBold}>to</p>
      <p className={classes.no_wrap}>
        {timeEnd ?? '---'}
      </p>
    </div>
  );
};

const modifyExecutionDetails = (val) => {
  if (!val) return <p>---</p>;
  const name = val[MANAGER_API_KEYS.DISPLAY_NAME];
  const id = val[MANAGER_API_KEYS.TEST_CASE_EXECUTION_ID];
  const environment = val[MANAGER_API_KEYS.ENVIRONMENT];

  return (
    <div className={classes.flex_col}>
      <p className={classes.tableProjectName}>{name ?? '---'}</p>
      <p className={classes.tableProjectSource}>{environment ?? '---'}</p>
      <p className={classes.tableProjectSource}>{`#${id}` ?? '---'}</p>
    </div>
  );
};

const modifyExecutionStatus = (val) => {
  const status = val[TEST_HISTORY_KEYS.STATUS];
  const isInProgress = !val[MANAGER_API_KEYS.TEST_CASE_COUNT]
    || (status !== TEST_HISTORY_STATUSES.DONE
      && status !== TEST_HISTORY_STATUSES.FAILED);

  const totalCases = val[MANAGER_API_KEYS.TEST_CASE_EXECUTIONS];
  const testCasePassedCount = val[MANAGER_API_KEYS.TEST_CASE_PASS_STATS] ?? 0;
  const testCaseFailCount = val[MANAGER_API_KEYS.TEST_CASE_FAIL_STATS] ?? 0;

  const successPercentage = calculatePercentage(testCasePassedCount, totalCases);

  return (
    <div className={classes.executionStatsRoot}>
      {isInProgress ? <Spinner small inline /> : (
        <div className={classes.executionStatsSuccess}>
          {successPercentage}
          % Success
        </div>
      )}

      <div className={classes.executionStatsDesc}>
        {testCaseFailCount + testCasePassedCount}
        {' '}
        /
        {' '}
        {totalCases}
        {' '}
        test cases executed
      </div>
    </div>
  );
};

const testViewTableHeaders = (timezone) => [
  {
    name: tableHeaderKeys.TEST_SUITE_NAME,
    source: OBJECT_WILD_CARD_KEY,
    formatter: modifyExecutionDetails,
  },
  {
    name: tableHeaderKeys.TAGS,
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: (val) => {
      return <ModifyTags val={val} />;
    },
  },
  {
    name: tableHeaderKeys.NUM_TEST_CASES,
    source: MANAGER_API_KEYS.TEST_CASE_COUNT,
  },
  {
    name: tableHeaderKeys.START_AND_END_TIME,
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: (val) => <ModifyTimeStamp val={val} timezone={timezone} />,
  },
  {
    name: tableHeaderKeys.STATUS,
    source: TEST_HISTORY_KEYS.STATUS,
    alignCenter: true,
    formatter: (val) => {
      const status = TEST_HISTORY_STATUSES_MAP.find((item) => item.value === val)?.label;
      return <TicketsStatus status={status} />;
    },
  },
  {
    name: tableHeaderKeys.EXECUTION_STATUS,
    source: OBJECT_WILD_CARD_KEY,
    formatter: modifyExecutionStatus,
  },
];

export default testViewTableHeaders;
