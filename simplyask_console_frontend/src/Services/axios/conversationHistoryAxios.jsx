import { CHAT_API as chat, DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/agent';

export const getAgentSupportClosed = (filters, signal) => {
  return chat.get(`${PATH_NAME}/support/closed?${filters}`, { signal }).then((res) => res.data);
};

export const getConversationHistory = (convId) => {
  return chat.get(`/history/${convId}`).then((res) => res.data);
};

export const getAllAgents = async (filters) => {
  return axios.get(`${PATH_NAME}/filter?${filters}`).then((res) => res?.data);
};
