import { DEFAULT_API as axios } from './AxiosInstance';
import { CHAT_API } from './AxiosInstance';

export const updateAgentDetails = async ({ agentId, ...rest }) =>
  axios.post(`/agent/details/${agentId}`, rest).then((res) => res?.data);

export const deleteAgent = async (id) => axios.delete(`/agent/${id}`).then((res) => res?.data);

export const getAgents = async (params) => axios.get('/agent/filter', { params }).then((res) => res?.data);

export const getAgentDetails = async (id) => axios.get(`/agent/${id}/graph`).then((res) => res?.data);
export const getAgentById = async (agentId) => axios.get(`/agent`, { params: { agentId } }).then((res) => res?.data);

export const getAgentActions = async () => axios.get('/agent/actions/all').then((res) => res?.data);

export const updateAgent = async (id, body) => axios.post(`/agent/${id}`, body).then((res) => res?.data);

export const createAgent = async (body) => axios.post('/agent', body).then((res) => res?.data);

export const duplicateAgentApi = async (id, body) =>
  axios.post(`/agent/${id}/duplicate`, body).then((res) => res?.data);

export const exportAgentApi = async (id) => axios.get(`/agent/${id}/export`).then((res) => res?.data);

export const importAgentApi = async (payload) => axios.post('/agent/import', payload).then((res) => res?.data);

export const importAndReplaceAgentApi = async (id, payload) =>
  axios.post(`/agent/${id}/import`, payload).then((res) => res?.data);

export const saveGenerativeAgent = (body) => CHAT_API.post('/generative-agents', body);

export const getGenerativeAgentDetails = async (id) =>
  CHAT_API.get(`/generative-agents/${id}`).then((res) => res?.data);
