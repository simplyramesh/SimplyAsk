import { ISSUE_ENTITY_TYPE } from '../../../Issues/constants/core';
import { DUPLICATE_NAME_COPY } from '../../AgentManager/GenerativeEditor/constants/core';
import {
  TEST_CASE_EXECUTION_STATUS,
  TEST_ENTITY_TYPE,
  TEST_GROUP_EXECUTION_STATUS,
  TEST_SUITE_EXECUTION_STATUS,
} from '../constants/constants';

export const getPercentage = (value, total, toFixed = 0) => {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100).toFixed(toFixed);
};

export const testEntityTypeToLinkedItemsAdapter = (type) => {
  if (type === TEST_ENTITY_TYPE.GROUP) {
    return ISSUE_ENTITY_TYPE.TEST_GROUP;
  }
  if (type === TEST_ENTITY_TYPE.SUITE) {
    return ISSUE_ENTITY_TYPE.TEST_SUITE;
  }
  if (type === TEST_ENTITY_TYPE.CASE) {
    return ISSUE_ENTITY_TYPE.TEST_CASE;
  }
};

export const linkedTestEntityMapper = (test) => ({
  name: test.displayName,
  testId: test.id,
  description: test.id,
  type: testEntityTypeToLinkedItemsAdapter(test.genericTestType),
});

export const getPayloadPropKeyByTestType = (type) => {
  if (type === TEST_ENTITY_TYPE.CASE) {
    return 'testCaseId';
  }
  if (type === TEST_ENTITY_TYPE.SUITE) {
    return 'testSuiteId';
  }
  if (type === TEST_ENTITY_TYPE.GROUP) {
    return 'testGroupId';
  }
};

export const getPayloadPropKeyByTestExecutionType = (type) => {
  if (type === TEST_ENTITY_TYPE.CASE) {
    return 'testCaseExecutionId';
  }
  if (type === TEST_ENTITY_TYPE.SUITE) {
    return 'testSuiteExecutionId';
  }
  if (type === TEST_ENTITY_TYPE.GROUP) {
    return 'testGroupExecutionId';
  }
};

export const testStatusToLabelMapper = (status) => {
  switch (status) {
    case TEST_SUITE_EXECUTION_STATUS.PREPARING:
      return 'Preparing';
    case TEST_CASE_EXECUTION_STATUS.EXECUTING:
    case TEST_SUITE_EXECUTION_STATUS.EXECUTING:
    case TEST_GROUP_EXECUTION_STATUS.EXECUTING:
      return 'Executing';
    case TEST_CASE_EXECUTION_STATUS.FAILED:
    case TEST_SUITE_EXECUTION_STATUS.FAILED:
      return 'Failed';
    case TEST_CASE_EXECUTION_STATUS.DONE:
    case TEST_SUITE_EXECUTION_STATUS.DONE:
    case TEST_GROUP_EXECUTION_STATUS.DONE:
      return 'Passed';
    case TEST_CASE_EXECUTION_STATUS.FINALIZING:
    case TEST_SUITE_EXECUTION_STATUS.FINALIZING:
      return 'Finalizing';
    case TEST_CASE_EXECUTION_STATUS.STOPPED:
    case TEST_SUITE_EXECUTION_STATUS.STOPPED:
    case TEST_GROUP_EXECUTION_STATUS.STOPPED:
      return 'Stopped';
    default:
      return '';
  }
};

export const testStatusToColorMapper = (label, theme) => {
  switch (label) {
    case TEST_CASE_EXECUTION_STATUS.EXECUTING:
    case TEST_SUITE_EXECUTION_STATUS.EXECUTING:
    case TEST_GROUP_EXECUTION_STATUS.EXECUTING:
      return theme.executionStatusesColors.yellow;
    case TEST_CASE_EXECUTION_STATUS.FAILED:
    case TEST_SUITE_EXECUTION_STATUS.FAILED:
      return theme.executionStatusesColors.red;
    case TEST_CASE_EXECUTION_STATUS.DONE:
    case TEST_SUITE_EXECUTION_STATUS.DONE:
    case TEST_GROUP_EXECUTION_STATUS.DONE:
      return theme.executionStatusesColors.green;
    case TEST_CASE_EXECUTION_STATUS.FINALIZING:
    case TEST_SUITE_EXECUTION_STATUS.FINALIZING:
    case TEST_SUITE_EXECUTION_STATUS.PREPARING:
    case TEST_GROUP_EXECUTION_STATUS.PREPARING:
      return theme.executionStatusesColors.blue;
    case TEST_CASE_EXECUTION_STATUS.STOPPED:
    case TEST_GROUP_EXECUTION_STATUS.STOPPED:
    case TEST_SUITE_EXECUTION_STATUS.STOPPED:
      return theme.executionStatusesColors.charcoal;
    default:
      return '';
  }
};

export const executionToProgressBarDataMapper = (type, executionData, theme) => {
  if (type === TEST_ENTITY_TYPE.CASE) {
    const status = executionData.testCaseExecutionStatus;

    return [
      {
        count: 1,
        color: testStatusToColorMapper(status, theme),
        label: testStatusToLabelMapper(status),
      },
    ];
  }
  if (type === TEST_ENTITY_TYPE.SUITE) {
    const inProgress = executionData.testCaseExecutions - (executionData.testCasePass + executionData.testCaseFail);

    return [
      {
        count: executionData.testCasePass,
        color: testStatusToColorMapper(TEST_SUITE_EXECUTION_STATUS.DONE, theme),
        label: testStatusToLabelMapper(TEST_SUITE_EXECUTION_STATUS.DONE),
      },
      {
        count: executionData.testCaseFail,
        color: testStatusToColorMapper(TEST_SUITE_EXECUTION_STATUS.FAILED, theme),
        label: testStatusToLabelMapper(TEST_SUITE_EXECUTION_STATUS.FAILED),
      },
      {
        count: inProgress,
        color: testStatusToColorMapper(TEST_SUITE_EXECUTION_STATUS.EXECUTING, theme),
        label: testStatusToLabelMapper(TEST_SUITE_EXECUTION_STATUS.EXECUTING),
      },
    ];
  }
  if (type === TEST_ENTITY_TYPE.GROUP) {
    return [
      {
        count: executionData.testCasePass,
        color: testStatusToColorMapper(TEST_CASE_EXECUTION_STATUS.DONE, theme),
        label: testStatusToLabelMapper(TEST_CASE_EXECUTION_STATUS.DONE),
      },
      {
        count: executionData.testCaseFail,
        color: testStatusToColorMapper(TEST_CASE_EXECUTION_STATUS.FAILED, theme),
        label: testStatusToLabelMapper(TEST_CASE_EXECUTION_STATUS.FAILED),
      },
      {
        count: executionData.testCaseStopped,
        color: testStatusToColorMapper(TEST_GROUP_EXECUTION_STATUS.STOPPED, theme),
        label: testStatusToLabelMapper(TEST_GROUP_EXECUTION_STATUS.STOPPED),
      },
      {
        count: executionData.testCaseInProgress,
        color: testStatusToColorMapper(TEST_GROUP_EXECUTION_STATUS.EXECUTING, theme),
        label: testStatusToLabelMapper(TEST_GROUP_EXECUTION_STATUS.EXECUTING),
      },
    ];
  }
};

export const getUniqueTestCaseNameRecursively = (baseName, testCaseOptions = [], index = 1) => {
  const duplicateName =
    index === 1 ? `${baseName}${DUPLICATE_NAME_COPY}` : `${baseName}${DUPLICATE_NAME_COPY} ${index}`;

  const baseNameExists = testCaseOptions.some((obj) => obj.displayName === duplicateName);

  if (baseNameExists) {
    return getUniqueTestCaseNameRecursively(baseName, testCaseOptions, index + 1);
  }

  return duplicateName;
};
