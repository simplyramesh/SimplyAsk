import { CATALOG_API as axios, DEFAULT_API as consoleBackend } from './AxiosInstance';

export const cancelScheduledProcess = async (fileId) => axios.get(`/workflow/file/${fileId}/cancel`);

export const getUserByUserId = (userId) =>
  consoleBackend.get(`/user/findUser?userId=${userId}`).then((res) => res.data);

export const getProcessExecutions = (filtersQuery) =>
  axios.get(`/workflow/file?${filtersQuery}`).then((res) => res.data);

export const getFileProcessExecutions = (fileId, filtersQuery) =>
  axios.get(`/workflow/file/${fileId}/processes?${filtersQuery}`).then((res) => res.data);

export const updateProcesses = async (ids, action) =>
  axios.post(`/workflow/file/action/${action}`, ids).then((res) => res?.data);

export const getAllProcessTriggers = async () => axios.get('workflow/config/process-trigger').then((res) => res.data);

export const cancelProcessExecutions = async (processIds) =>
  axios.get('/process/cancel', { params: { processIds } }).then((res) => res?.data);
