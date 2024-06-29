import { constructUrlSearchString } from '../../Components/Settings/AccessManagement/utils/formatters';

import { TEST_ENGINE_API as axios } from './AxiosInstance';

export const getTestData = async (filterQuery) => axios.get(`/generic/filter?${filterQuery}`).then((res) => res?.data);

export const getFilteredTestData = async (params) => axios.get(`/generic/filter`, { params }).then((res) => res?.data);

export const getTestCase = async (id) => axios.get(`/case/${id}`).then((res) => res?.data);

export const duplicateTestCase = async (data) =>
  axios.post(`/case/${data.workFlowId}/duplicate`, data).then((res) => res?.data);

export const getTags = async (filterQuery) =>
  axios.get(`/generic/tag${filterQuery ? `?${filterQuery}` : ''}`).then((res) => res?.data);

export const getTestCaseExecutions = async (filter) =>
  axios.get(`/case/execution/filter?${filter}`).then((res) => res?.data);

export const getTestCaseExecutionsId = async (id) =>
  axios.get(`/case/execution/filter?testCaseExecutionId=${id}`).then((res) => res?.data);

export const getTestHistory = async (filterQuery) =>
  axios.get(`/generic/execution/filter?${filterQuery}`).then((res) => res?.data);

export const getExecutedTestSuiteById = async (testSuiteId) =>
  axios.get(`/suite/${testSuiteId}/execution`).then((res) => res?.data);

export const getExecutedTestGroupById = async (testGroupId) =>
  axios.get(`/group/${testGroupId}/executions`).then((res) => res?.data);

export const getExecutedTestCaseById = async (testCaseId) =>
  axios.get(`/case/${testCaseId}/execution`).then((res) => res?.data);

export const getExecutedTestCaseByExecutionId = async (executionId) =>
  axios.get(`/case/execution/${executionId}`).then((res) => res?.data);

export const updateTestCase = async (id, data) => axios.post(`/case/${id}`, data).then((res) => res?.data);

export const getTestGroup = async (id) => axios.get(`/group/${id}`).then((res) => res?.data);
export const createNewTestSuite = async (data) => axios.post('/suite', data).then((res) => res?.data);

export const createNewTestGroup = async (data) => axios.post('/group', data).then((res) => res?.data);

export const updateTestGroup = async (id, data) => axios.post(`/group/${id}`, data).then((res) => res?.data);

export const getTestGroupExecutions = async (id, filter) =>
  axios.get(`/group/${id}/executions?${filter}`).then((res) => res?.data);

export const performTestAction = async (action, payload, params = {}) =>
  axios.post(`/generic/action/${action}`, payload, { params }).then((res) => res?.data);

export const getTestSuite = async (id) => axios.get(`/suite/filter?searchText=${id}`).then((res) => res?.data);

export const updateTestSuite = async (id, data) => axios.post(`/suite/${id}`, data).then((res) => res?.data);

export const deleteTestSuite = async (testSuiteId) => axios.delete(`/suite/${testSuiteId}`).then((res) => res?.data);

export const executeTestSuite = async (test_suite_uuid, environment) =>
  axios.post(`/suite/${test_suite_uuid}/execute/${environment}`).then((res) => res?.data);

export const getTestCasesByTestSuiteId = async (testSuiteId) =>
  axios.get(`/case/suite/${testSuiteId}`).then((res) => res?.data?.content);

export const createNewTestCase = async (data) => axios.post('/case', data).then((res) => res?.data);

export const deleteTestCase = async (id) => axios.delete(`/case/${id}`).then((res) => res?.data);

export const getTestSuiteStatistics = async (
  timezone = '',
  startDate = '',
  endDate = '',
  id = '',
  inclusiveEndDate = true
) =>
  axios
    .get(
      `/suite/executionStats?timezone=${timezone}&after=${startDate}&before=${endDate}&inclusiveEndDate=${inclusiveEndDate}&id=${id}`
    )
    .then((res) => res?.data);

export const getAllTestSuitesNames = async () => axios.get('/suite/names').then((res) => res?.data);

export const getTestSuiteExecutionFilter = async (filterParams = {}) => {
  const params = constructUrlSearchString(filterParams);

  return axios.get(`/suite/execution/filter?${params}`).then((res) => res.data);
};

export const getTestSuiteExecutions = async (filterQuery) =>
  axios.get(`/suite/execution/filter?${filterQuery}`).then((res) => res.data);

export const getAllTestRuns = async () => axios.get('/run').then((res) => res.data);

export const postTestRun = async (data) => axios.post('/run', data).then((res) => res?.data);

export const getTestRunById = async (testRunId) => axios.get(`/run/${testRunId}`).then((res) => res?.data);

export const deleteTestRunById = async (testRunId) => axios.delete(`/run/${testRunId}`).then((res) => res?.data);

export const deleteTestExecutionById = (id) => axios.delete(`/execution/${id}`).then((res) => res?.data);

export const getTestCaseExecutionId = (id) => axios.get(`/case/execution/${id}`).then((res) => res?.data);

export const getAllTestExecutions = () =>
  axios.get('/execution/filter?searchText=&status=&pageSize=10&pageNumber=0').then((res) => res?.data);

export const patchTestRunCaseComment = async (testRunCaseId, comments) => {
  const commentsParams = constructUrlSearchString({ comments });

  return axios.patch(`/run/${testRunCaseId}?${commentsParams}`).then((res) => res?.data);
};

export const getTestGenericType = async (type, text, recordSize = '25') =>
  axios
    .get(`/generic/linkage?genericTestType=${type}&searchText=${text}&recordSize=${recordSize}`)
    .then((res) => res?.data);

export const getBulkedLinkedData = async (request) => axios.post('/generic/bulk', request).then((res) => res?.data);

export const getTestSuiteByExecutionId = async (executionId) =>
  axios.get(`/suite/execution/${executionId}`).then((res) => res?.data);

export const exportTestApi = async (testCaseId) => axios.get(`/case/${testCaseId}/export`).then((res) => res?.data);

export const importAndReplaceTestCaseApi = async (displayName, params, file) =>
  axios.post(`/case/${displayName}/import?${params}`, file).then((res) => res?.data);

export const importNewTestCaseApi = async (params, file) =>
  axios.post(`/case/import?${params}`, file).then((res) => res?.data);
