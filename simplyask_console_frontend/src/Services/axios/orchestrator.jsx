import { DEFAULT_API as axios } from './AxiosInstance';

export const getOrchestratorDetails = (id) => axios.get(`joborchestration/groups/${id}`).then((res) => res?.data);

export const getOrchestratorProcessDetails = (id, executingId) => axios.get(`joborchestration/jobs/${id}/executions/${executingId}`).then((res) => res?.data);

export const updateOrchestrator = (id, body) => axios.post(`joborchestration/groups/${id}/graph`, body).then((res) => res?.data);

export const getOrchestratorGroups = (filterParams) => axios.get(`joborchestration/groups?${filterParams}`).then((res) => res?.data);

export const createOrchestrationGroup = (payload) => axios.post('joborchestration/groups', payload).then((res) => res?.data);

export const updateOrchestrationGroup = (id, body) => axios.patch(`joborchestration/groups/${id}`, body).then((res) => res?.data);

export const deleteOrchestrationGroup = (params) => axios.delete(`joborchestration/groups`, { params }).then((res) => res?.data);

export const executeOrchestratorById = (id) => axios.post(`joborchestration/jobs/${id}/execute`).then((res) => res?.data);

export const executeOrchestratorFromStart = (id) => axios.post(`joborchestration/groups/${id}/execute`).then((res) => res?.data);

export const bulkExecuteOrchestrators = (body) => axios.post(`joborchestration/groups/execute`, body).then((res) => res?.data);

export const getOrchestratorExecutionsById = (id, params) => axios.get(`joborchestration/groups/${id}/executions`, { params }).then((res) => res?.data);

export const getOrchestratorSingleExecution = (id, executingId) => axios.get(`joborchestration/groups/${id}/executions/${executingId}`).then((res) => res?.data);

export const cancelExecution = (id, executingId) => axios.post(`joborchestration/groups/${id}/executions/${executingId}/cancel`).then((res) => res?.data);

