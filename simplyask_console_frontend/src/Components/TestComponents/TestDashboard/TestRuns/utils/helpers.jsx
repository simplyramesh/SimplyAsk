import moment from 'moment';

import { environmentStatusColumns, testRunsTableColumns } from './formatters';

/* Column and Row manipulation  */
export const TEST_SUITES = 'testRunSuites';
export const TEST_RUN = 'testRuns';
export const TEST_SUITE_CASES = 'testRunCases';
export const TEST_CASE_ENVIRONMENT_STATUS = 'envStatuses';

export const TEST_RUN_COLUMN_KEYS = {
  TEST_RUN_NAME: 'displayName',
  TEST_SUITE_NAME: 'testSuiteName',
  TEST_SUITE_EXECUTED_AT: 'executionDate',
  TEST_SUITE_CASES_PASSED: 'numOfTestCasesPassed',
  TEST_SUITE_CASES_FAILED: 'numOfTestCasesFailed',
  TEST_SUITE_CASES_PARTIAL: 'numOfTestCasesPart',
  TEST_SUITE_CASES_TOTAL: 'numOfTestCases',
  CREATED_AT: 'createdAt',
  MODIFIED_AT: 'modifiedAt',
  TEST_CASE_NAME: 'name',
  TEST_CASE_ENVIRONMENT: 'environment',
  TEST_CASE_ENVIRONMENT_STATUS: 'result',
  TEST_CASE_COMMENT: 'comments',
};

const getCurrentEnvs = (data, cb) => {
  if (data[TEST_SUITES] == null) return [];

  const currentEnvs = [];
  const cbEnvs = [];

  data[TEST_SUITES].forEach((suite) => {
    suite[TEST_SUITE_CASES].forEach((item) => {
      item[TEST_CASE_ENVIRONMENT_STATUS].forEach((env) => {
        if (!currentEnvs.includes(env[TEST_RUN_COLUMN_KEYS.TEST_CASE_ENVIRONMENT])) {
          currentEnvs.push(env[TEST_RUN_COLUMN_KEYS.TEST_CASE_ENVIRONMENT]);

          if (cb) cbEnvs.push(cb(env));
        }
      });
    });
  });

  if (cbEnvs.length > 0) return cbEnvs;

  return currentEnvs;
};

export const addEnvironmentStatusColumns = (data = []) => {
  const columns = testRunsTableColumns.map((col) => {
    if (col.id === 'environmentStatus') {
      return {
        ...col,
        columns: getCurrentEnvs(data, environmentStatusColumns),
      };
    }

    return col;
  });

  return columns;
};

export const testRunInfo = (data) => {
  if (data[TEST_SUITES] == null) return data;

  const addedStats = data[TEST_SUITES].reduce((acc, curr) => {
    return {
      totalTestCases: acc.totalTestCases + curr[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_TOTAL],
      totalTestCasesPassed: acc.totalTestCasesPassed + curr[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_PASSED],
      totalTestCasesFailed: acc.totalTestCasesFailed + curr[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_FAILED],
      totalTestCasesPartialPassed: acc.totalTestCasesPartialPassed + curr[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_PARTIAL],
    };
  }, {
    totalTestCases: 0,
    totalTestCasesPassed: 0,
    totalTestCasesFailed: 0,
    totalTestCasesPartialPassed: 0,
  });

  const testRunInfo = {
    displayName: data[TEST_RUN_COLUMN_KEYS.TEST_RUN_NAME],
    createdAt: data[TEST_RUN_COLUMN_KEYS.CREATED_AT],
    modifiedAt: data[TEST_RUN_COLUMN_KEYS.MODIFIED_AT],
    ...addedStats,
  };

  return testRunInfo;
};

export const testRunTableData = (data) => {
  if (data[TEST_SUITES] == null) return data;

  return data[TEST_SUITES].map((suite) => {
    const testCaseEnvPassFail = suite[TEST_SUITE_CASES].map((item) => {
      const envPassFail = item[TEST_CASE_ENVIRONMENT_STATUS].reduce((acc, env) => {
        return {
          ...acc,
          comments: item[TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT] || '',
          [env[TEST_RUN_COLUMN_KEYS.TEST_CASE_ENVIRONMENT]]: env[TEST_RUN_COLUMN_KEYS.TEST_CASE_ENVIRONMENT_STATUS],
        };
      }, {});

      return {
        ...item,
        ...envPassFail,
      };
    });

    return {
      ...suite,
      [TEST_SUITE_CASES]: [...testCaseEnvPassFail].sort((a, b) => a.name.localeCompare(b.name)),
    };
  });
};

/* Create Test Run: dropdown */

const sortByCreatedAt = (a, b) => {
  if (a.createdAt == null || b.createdAt == null) return 0;

  const aDate = moment(a.createdAt);
  const bDate = moment(b.createdAt);

  if (aDate.isBefore(bDate)) return 1;
  if (aDate.isAfter(bDate)) return -1;

  return 0;
};

export const getUniqueSuitesAndEnv = (data) => {
  const testSuites = [];
  const environments = [];
  const testSuiteExecutionIds = [];
  const defaultSelected = [];

  const testSuitesAndUniqueEnvs = data.reduce((acc, testSuiteExecution) => {
    const {
      testSuiteId, displayName, environment, testSuiteExecutionId,
    } = testSuiteExecution;

    const testSuiteIndex = acc.findIndex((testSuite) => testSuite.testSuiteId === testSuiteId);
    const environmentIndex = testSuiteIndex !== -1
      ? acc[testSuiteIndex].environments.findIndex((env) => env.environment === environment)
      : -1;

    /* Push logic (first create modal) */
    const environmentsIndex = environments.findIndex((env) => env.environment === environment);

    if (testSuiteIndex === -1) testSuites.push(testSuiteExecution);
    if (environmentIndex === -1 && environmentsIndex === -1) environments.push(testSuiteExecution);

    const isNamePresent = Object.keys(testSuiteExecutionIds?.[environment] ?? {}).includes(displayName);
    const isEnvironmentPresent = Object.keys(testSuiteExecutionIds).includes(environment);

    if (isNamePresent) testSuiteExecutionIds[environment][displayName].push(testSuiteExecutionId);
    if (isEnvironmentPresent && !isNamePresent) testSuiteExecutionIds[environment][displayName] = [testSuiteExecutionId];
    if (!isEnvironmentPresent && !isNamePresent) testSuiteExecutionIds[environment] = { [displayName]: [testSuiteExecutionId] };

    /* */

    const noneObj = {
      ...testSuiteExecution,
      displayName: 'None',
      testSuiteExecutionId: `None-${environment}`,
      createdAt: null,
      testCaseCount: null,
      testCasePass: null,
      status: null,
    };

    if (testSuiteIndex === -1 && environmentIndex === -1) defaultSelected.push({ ...noneObj });

    const envOptions = testSuiteIndex === -1 || environmentIndex === -1
      ? [{ ...noneObj }, testSuiteExecution].sort(sortByCreatedAt)
      : [
        ...acc[testSuiteIndex].environments[environmentIndex].options,
        testSuiteExecution,
      ].sort(sortByCreatedAt);

    const envs = testSuiteIndex === -1 || environmentIndex === -1
      ? [
        ...(acc[testSuiteIndex]?.environments || []),
        {
          environment,
          options: envOptions,
        },
      ]
      : [
        ...acc[testSuiteIndex].environments.slice(0, environmentIndex),
        {
          ...acc[testSuiteIndex].environments[environmentIndex],
          options: envOptions,
        },
        ...acc[testSuiteIndex].environments.slice(environmentIndex + 1),
      ];

    const suites = testSuiteIndex === -1
      ? [
        ...acc,
        {
          testSuiteId,
          displayName,
          environments: envs,
        },
      ]
      : [
        ...acc.slice(0, testSuiteIndex),
        {
          ...acc[testSuiteIndex],
          environments: envs,
        },
        ...acc.slice(testSuiteIndex + 1),
      ];

    return suites;
  }, []);

  return {
    testSuites,
    environments,
    testSuiteExecutionIds,
    original: data,
    nextCreate: testSuitesAndUniqueEnvs,
    defaultSelected,
  };
};

/* Other functions */

export const isUrl = (str) => {
  const urlRegex = /^(http(s)?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  return urlRegex.test(str);
};
