import { labelWithIcon } from '../../../Issues/constants/options';
import TestIcon from '../components/TestIcon/TestIcon';
import { TEST_ENTITY_TYPE } from '../constants/constants';

export const TEST_TYPE = {
  TEST_CASE: 'Test Case',
  TEST_SUITE: 'Test Suite',
  TEST_GROUP: 'Test Group',
  CASE: 'CASE',
  SUITE: 'SUITE',
  GROUP: 'GROUP',
  TEST_CASES: 'Test Cases',
  TEST_SUITES: 'Test Suites',
  TEST_GROUPS: 'Test Groups',
};

export const TEST_HISTORY_FILTERS_KEY = 'sideFilter';

export const TEST_HISTORY_FILTERS = {
  EXECUTION_NAME: 'executionName',
  TEST_CASE_COUNT: 'testCaseCount',
  DURATION: 'duration',
  EXECUTION_TYPE: 'types',
  EXECUTION_PROGRESS: 'executionMap',
  STATUS: 'status',
  ENVIRONMENT: 'environment',
  START_TIME: 'startTime',
  END_TIME: 'endTime',
  TAGS: 'tags',
  ACTIONS: 'actions',
  CREATED_AFTER: 'startDateAfter',
  CREATED_BEFORE: 'startDateBefore',
  EXECUTED_AFTER: 'endDateAfter',
  EXECUTED_BEFORE: 'endDateBefore',
};

export const TEST_HISTORY_SIDE_FILTER_INITIAL_VALUES = {
  [TEST_HISTORY_FILTERS.EXECUTION_TYPE]: [],
  [TEST_HISTORY_FILTERS.STATUS]: [],
  [TEST_HISTORY_FILTERS.ENVIRONMENT]: [],
  [TEST_HISTORY_FILTERS.START_TIME]: '',
  [TEST_HISTORY_FILTERS.END_TIME]: '',
  [TEST_HISTORY_FILTERS.TAGS]: [],
};

export const TEST_HISTORY_FILTERS_INITIAL_VALUES = {
  [TEST_HISTORY_FILTERS_KEY]: TEST_HISTORY_SIDE_FILTER_INITIAL_VALUES,
  [TEST_HISTORY_FILTERS.CREATED_AFTER]: '',
  [TEST_HISTORY_FILTERS.CREATED_BEFORE]: '',
  [TEST_HISTORY_FILTERS.EXECUTED_AFTER]: '',
  [TEST_HISTORY_FILTERS.EXECUTED_BEFORE]: '',
};

export const EXECUTION_TYPES_OPTIONS = [
  {
    label: TEST_TYPE.TEST_CASES,
    Icon: () => <TestIcon entityType={TEST_ENTITY_TYPE.CASE} />,
    labelWithIcon: labelWithIcon(TEST_TYPE.TEST_CASES, () => <TestIcon entityType={TEST_ENTITY_TYPE.CASE} />),
    value: TEST_TYPE.CASE,
  },
  {
    label: TEST_TYPE.TEST_SUITES,
    Icon: () => <TestIcon entityType={TEST_ENTITY_TYPE.SUITE} />,
    labelWithIcon: labelWithIcon(TEST_TYPE.TEST_SUITES, () => <TestIcon entityType={TEST_ENTITY_TYPE.SUITE} />),
    value: TEST_TYPE.SUITE,
  },
  {
    label: TEST_TYPE.TEST_GROUPS,
    Icon: () => <TestIcon entityType={TEST_ENTITY_TYPE.GROUP} />,
    labelWithIcon: labelWithIcon(TEST_TYPE.TEST_GROUPS, () => <TestIcon entityType={TEST_ENTITY_TYPE.GROUP} />),
    value: TEST_TYPE.GROUP,
  },
];

export const EXECUTION_PROGRESS = [
  { value: 'Preparing', label: 'Preparing', color: 'blue' },
  { value: 'Executing', label: 'Executing', color: 'yellow' },
  { value: 'Done', label: 'Done', color: 'green' },
  { value: 'Canceled', label: 'Canceled', color: 'grey' },
  { value: 'Error', label: 'Error', color: 'red' },
];

export const TEST_CASE_IMPORT_TOAST_MSGS = {
  JSON_ALLOWED: 'Only "json" files are accepted',
  INVALID_FILE: 'Test Case file is invalid',
};