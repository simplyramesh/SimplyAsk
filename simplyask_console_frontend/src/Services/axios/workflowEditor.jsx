import { CATALOG_API, TEST_ENGINE_API } from './AxiosInstance';

const PATH_NAME = '/workflow/config';

export const getWorkflow = (workflowId) => CATALOG_API.get(`${PATH_NAME}/${workflowId}`).then((res) => res.data);

export const getWorkflowGraph = (workflowId, processInstanceId) =>
  CATALOG_API.get(
    `${PATH_NAME}/${workflowId}/graph${processInstanceId ? `?processInstanceId=${processInstanceId}` : ''}`
  ).then((res) => res.data);

export const getWorkflowProcessTypes = () => CATALOG_API.get(`${PATH_NAME}/processType`).then((res) => res?.data);

export const getWorkflowStepDelegates = (workflowId) =>
  CATALOG_API.get(`${PATH_NAME}/stepDelegate`, { params: { workflowId } }).then((res) => res.data);

export const getWorkflowStepDelegatesStructure = (workflowId) =>
  CATALOG_API.get(`${PATH_NAME}/stepDelegateWithCategory`, { params: { workflowId } }).then((res) => res.data);

export const getWorkflowStepDelegatesFilter = (filterName) => {
  const filterParams = typeof filterName === 'object' ? filterName : { stepDelegateName: filterName };

  return CATALOG_API.get(`${PATH_NAME}/stepDelegateWithCategory/filter`, { params: filterParams }).then(
    (res) => res.data
  );
};

// update workflow
export const updateWorkflow = (workflowId, workflow) =>
  CATALOG_API.post(`${PATH_NAME}/${workflowId}`, workflow).then((res) => res.data);

export const getProxyDefinitions = (type) =>
  CATALOG_API.get(`${PATH_NAME}/dynamicDropdownProxy`, { params: { type } }).then((res) => res.data);

/* TEST EDITOR */

export const getTestWorkflow = (workflowId) => TEST_ENGINE_API.get(`/case/${workflowId}`).then((res) => res.data);

export const getTestWorkflowGraph = (testCaseId, testCaseExecutionId) =>
  TEST_ENGINE_API.get(
    `/case/${testCaseId}/graph${testCaseExecutionId ? `?testCaseExecutionId=${testCaseExecutionId}` : ''}`
  ).then((res) => res.data);

export const getTestWorkflowStepDelegates = () => TEST_ENGINE_API.get('/step-delegate').then((res) => res.data);

export const getTestWorkflowStepDelegatesStructure = () =>
  TEST_ENGINE_API.get('/step-delegate/stepDelegateWithCategory', {
    params: {
      pageSize: 1000,
    },
  }).then((res) => res.data);

export const getTestWorkflowStepDelegatesFilter = (filterName) => {
  const filterParams = typeof filterName === 'object' ? filterName : { stepDelegateName: filterName };
  return TEST_ENGINE_API.get('/step-delegate/stepDelegateWithCategory/filter', { params: filterParams }).then(
    (res) => res.data
  );
};

export const updateTestWorkflow = (workflowId, workflow) =>
  TEST_ENGINE_API.post(`/case/${workflowId}/graph`, workflow).then((res) => res.data);

export const getPublicFormConfig = () => CATALOG_API.get(`${PATH_NAME}/psfConfiguration`).then((res) => res.data);

export const submitPublicFormConfig = (payload) =>
  CATALOG_API.post(`${PATH_NAME}/psfConfiguration`, payload).then((res) => res.data);
