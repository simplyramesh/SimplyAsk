import colors from './colors';

export const TEST_HISTORY_KEYS = {
  START_AT: 'startAt',
  START_TIME: 'startTime',
  END_TIME: 'endTime',
  END_AT: 'endAt',
  METHOD: 'method',
  STATUS: 'status',
  ERROR_SUMMARY: 'errorSummary',
  TYPE: 'type',
  CREATED_DATE: 'createdDate',
  LOG: 'log',
  DESCRIPTION: 'description',
  TITLE: 'title',
};

export const TEST_HISTORY_STATUSES = {
  PREPARING: 'PREPARING',
  EXECUTING: 'EXECUTING',
  FINALIZING: 'FINALIZING',
  ACTIVE: 'ACTIVE',
  DONE: 'DONE',
  FAILED: 'FAILED',
  PASS: 'PASS',
  FAIL: 'FAIL',
};

const TEST_HISTORY_EXECUTION_LOGS_KEYS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

export const TEST_HISTORY_EXECUTION_LOGS_KEYS_MAP = [
  {
    value: TEST_HISTORY_EXECUTION_LOGS_KEYS.INFO, label: 'Step Passed',
  },
  {
    value: TEST_HISTORY_EXECUTION_LOGS_KEYS.WARNING, label: 'Step Warning',
  },
  {
    value: TEST_HISTORY_EXECUTION_LOGS_KEYS.ERROR, label: 'Step Error',
  },
  {
    value: TEST_HISTORY_STATUSES.FAIL, label: 'Step Failed',
  },
];

export const TEST_HISTORY_METHODS_MAP = [
  {
    value: 'MANUAL', label: 'Manual Execution',
  },
  {
    value: 'API', label: 'Api Execution',
  },
  {
    value: 'CI_CD', label: 'CI, CD Execution',
  },
];

export const TEST_HISTORY_SIDE_MODAL_TABLE_FILTER = [
  {
    value: TEST_HISTORY_STATUSES.PASS,
    label: 'Success',
  },
  {
    value: TEST_HISTORY_STATUSES.FAIL,
    label: 'Failed',
  },
];

export const TEST_HISTORY_STATUSES_MAP = [
  {
    value: TEST_HISTORY_STATUSES.PREPARING, label: 'Preparing', chartLabel: 'Preparing to execute test cases',
  },
  {
    value: TEST_HISTORY_STATUSES.EXECUTING, label: 'Executing', chartLabel: 'Currently executing test cases',
  },
  {
    value: TEST_HISTORY_STATUSES.FINALIZING, label: 'Finalizing', chartLabel: 'Finalizing execution...',
  },
  {
    value: TEST_HISTORY_STATUSES.PASS, label: 'Success',
  },
  {
    value: TEST_HISTORY_STATUSES.FAIL, label: 'Failed',
  },
  {
    value: TEST_HISTORY_STATUSES.FAILED, label: 'Failed',
  },
  {
    value: TEST_HISTORY_STATUSES.ACTIVE, label: 'Executing',
  },
  {
    value: TEST_HISTORY_STATUSES.DONE, label: 'Done',
  },
];

export const getTitleForTimeline = (data) => {
  if (!data) return '---';
  return TEST_HISTORY_EXECUTION_LOGS_KEYS_MAP.find((item) => item.value === data)?.label;
};

export const getColorByType = (type) => {
  switch (type) {
  case TEST_HISTORY_EXECUTION_LOGS_KEYS.INFO:
    return colors.statusResolved;
  case TEST_HISTORY_EXECUTION_LOGS_KEYS.WARNING:
    return colors.statusAssigned;
  case TEST_HISTORY_EXECUTION_LOGS_KEYS.ERROR:
    return colors.statusOverdue;
  case TEST_HISTORY_STATUSES.FAIL:
    return colors.statusOverdue;
  default:
    return colors.information;
  }
};
