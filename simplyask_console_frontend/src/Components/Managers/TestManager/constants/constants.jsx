import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

export const GET_ALL_TEST_QUERY_KEY = 'getAllTests';

export const GET_TEST_CASES_TABLE_QUERY_KEY = 'GET_TEST_CASES_QUERY';
export const GET_TEST_SUITES_TABLE_QUERY_KEY = 'GET_TEST_SUITES_QUERY';

export const TEST_ENTITY_TYPE = {
  CASE: 'CASE',
  SUITE: 'SUITE',
  GROUP: 'GROUP',
};

export const TEST_CASE_EXECUTION_STATUS = {
  EXECUTING: 'EXECUTING',
  DONE: 'DONE',
  FAILED: 'FAILED',
  FINALIZING: 'FINALIZING',
  STOPPED: 'STOPPED',
  PREPARING: 'PREPARING',
  SUCCESS: 'SUCCESS',
  RESOLVED: 'RESOLVED',
};

export const TEST_SUITE_EXECUTION_STATUS = {
  PREPARING: 'PREPARING',
  EXECUTING: 'EXECUTING',
  FINALIZING: 'FINALIZING',
  DONE: 'DONE',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED',
  STOPPED: 'STOPPED',
};

export const TEST_GROUP_EXECUTION_STATUS = {
  PREPARING: 'PREPARING',
  EXECUTING: 'EXECUTING',
  DONE: 'DONE',
  FAILED: 'FAILED',
  STOPPED: 'STOPPED',
};

export const ACTIVE_STATUSES = [
  TEST_CASE_EXECUTION_STATUS.EXECUTING,
  TEST_SUITE_EXECUTION_STATUS.EXECUTING,
  TEST_GROUP_EXECUTION_STATUS.EXECUTING,
  TEST_SUITE_EXECUTION_STATUS.PREPARING,
  TEST_GROUP_EXECUTION_STATUS.PREPARING,
];

export const DONE_STATUSES = [
  TEST_CASE_EXECUTION_STATUS.DONE,
  TEST_SUITE_EXECUTION_STATUS.DONE,
  TEST_GROUP_EXECUTION_STATUS.DONE,
  TEST_SUITE_EXECUTION_STATUS.FAILED,
  TEST_CASE_EXECUTION_STATUS.FAILED,
  TEST_GROUP_EXECUTION_STATUS.FAILED,
  TEST_SUITE_EXECUTION_STATUS.STOPPED,
  TEST_CASE_EXECUTION_STATUS.STOPPED,
  TEST_GROUP_EXECUTION_STATUS.STOPPED,
];

export const TEST_ACTION = {
  ARCHIVE: 'ARCHIVE',
  UNARCHIVE: 'UNARCHIVE',
  FAVOURITE: 'FAVOURITE',
  UNFAVOURITE: 'UNFAVOURITE',
  DELETE: 'DELETE',
  EXECUTE: 'EXECUTE',
  REEXECUTE: 'REEXECUTE',
  STOP: 'STOP',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

export const TEST_TYPE_OPTIONS = [{
  label: 'Test Case',
  value: TEST_ENTITY_TYPE.CASE,
}, {
  label: 'Test Suite',
  value: TEST_ENTITY_TYPE.SUITE,
}, {
  label: 'Test Group',
  value: TEST_ENTITY_TYPE.GROUP,
}];

export const TEST_MANAGER_LABELS = {
  CASE: 'Test Case',
  SUITE: 'Test Suite',
  GROUP: 'Test Group',
  TEST_CASE: 'Test Case',
  TEST_SUITE: 'Test Suite',
  TEST_GROUP: 'Test Group',
  TEST_CASES: 'Test Cases',
  TEST_SUITES: 'Test Suites',
  TEST_GROUPS: 'Test Groups',
  TEST_CASE_QUERY_KEY: 'testCase',
  TEST_SUITE_QUERY_KEY: 'testSuite',
  TEST_GROUP_QUERY_KEY: 'testGroup',
};

export const TEST_MANAGER_TABS_MODEL = [{
  title: 'All Records',
  Icon: <DashboardOutlinedIcon />,
  value: 'all',
}, {
  title: 'Favourites',
  Icon: <StarBorderRoundedIcon />,
  value: 'favourites',
}, {
  title: 'Archived',
  Icon: <Inventory2OutlinedIcon />,
  value: 'archived',
}];

export const TEST_MANAGER_MODAL_TYPE = {
  EXECUTE: 'execute',
  DELETE: 'delete',
  ARCHIVE: 'archive',
  CANCEL: 'cancel',
};

export const EXECUTION_FRAMEWORK_OPTIONS = [
  {
    label: 'Symphona Test Framework',
    value: 'RPA',
  },
  {
    label: 'Cucumber',
    value: 'CUCUMBER',
  },
];

export const TEST_DATA_FULL_VIEW_CONSTANTS = {
  IS_NOT_BTN: 'isNotBtn',
  IS_BTN: 'isBtn',
  NAME: 'name',
  DESC: 'desc',
};

export const IMPORT_TEST_CASE_MODAL_TYPES = {
  IMPORT_AS_NEW: 'IMPORT_AS_NEW',
  IMPORT_AND_REPLACE_EXISTING: 'IMPORT_AND_REPLACE_EXISTING',
};