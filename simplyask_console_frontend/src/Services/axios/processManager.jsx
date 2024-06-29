import { CATALOG_API as axios, DEFAULT_API as consoleBackendApi } from './AxiosInstance';

const PATH_NAME = '/workflow/config/';

export const createNewProcessApi = async (data) => axios.post(PATH_NAME, data).then((res) => res?.data);

export const updateExistingProcessApi = async (data, workflowId) => axios.post(`/workflow/config/process/${workflowId}`, data).then((res) => res?.data);

export const updateProcessVariables = async (processInstanceId, data) => axios.put(`/process/${processInstanceId}/variables`, data).then((res) => res?.data);

export const getProcessVariables = async (processInstanceId) => axios.get(`/process/${processInstanceId}/variables`).then((res) => res?.data);

export const restartProcess = async (processInstanceId, body) => axios.post(`/process/${processInstanceId}/restart`, body).then((res) => res?.data);

export const getWorkflows = async (params) => axios.get('/workflow/config/filter', { params }).then((res) => res?.data);

export const deleteProcess = async (workflowId) => axios.delete(`${PATH_NAME}${workflowId}`).then((res) => res?.data);

export const getWorkflowSettingsDTO = async (workflowId) => axios.get(`${PATH_NAME}${workflowId}/settings`).then((res) => res?.data);

export const getWorkflowPfcConfig = async () => axios.get('/workflow/config/psfConfiguration').then((res) => res?.data);

export const getOrganizationApiKey = async () => consoleBackendApi.get('/key/default').then((res) => res?.data);

export const getProcessUrl = async () => axios.get('/process/url').then((res) => res?.data);

export const getFilteredProcesses = async (filterQuery, signal) => axios.get(`/process?${filterQuery}`, { signal }).then((res) => res?.data);

export const postPsfSettings = async (workflowId, payload) => axios.post(`/workflow/config/${workflowId}/psfSettings`, payload).then((res) => res?.data);

export const getIsWorkflowPsfProtected = async (workflowId) => axios.get(`${PATH_NAME}${workflowId}/psfProtected`).then((res) => res?.data);

export const getIsWorkflowPsfPasswordValid = async ({ processId, password }) => axios
  .get(`${PATH_NAME}${processId}/isValidPassword`, { params: { password } })
  .then((res) => res?.data);

export const duplicateProcessApi = async (id, payload) => axios.post(`/workflow/config/${id}/duplicate`, payload).then((res) => res?.data);

export const exportProcessApi = async (id) => axios.get(`/workflow/config/${id}/export`).then((res) => res?.data);

export const importProcessApi = async (payload, params = '') => axios.post(`/workflow/config/import?${params}`, payload).then((res) => res?.data);

export const importAndReplaceProcessApi = async (id, payload) => axios.post(`/workflow/config/${id}/import`, payload).then((res) => res?.data);

export const getFalloutDestinations = async (signal) => axios.get('/workflow/config/falloutDestinations', { signal }).then((res) => res?.data);
