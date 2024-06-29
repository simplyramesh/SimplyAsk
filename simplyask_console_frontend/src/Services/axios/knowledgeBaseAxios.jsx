import { SIMPLY_ASSISTANT_API as axios } from "./AxiosInstance";

const PATH_NAME = '/api/simplyassistant'

export const getKnowledgeBase = async (filters = '') => {
  return axios.get(`${PATH_NAME}/knowledgebase?${filters}`).then((res) => res?.data);
}

export const getKnowledgeBaseById = async (knowledgeBaseId) => {
  return axios.get(`${PATH_NAME}/knowledgebase/${knowledgeBaseId}`).then((res) => res?.data);
}

export const createKnowledgeBase = async (body) => {
  return axios.post(`${PATH_NAME}/knowledgebase`, body).then((res) => res?.data);
}

export const deleteKnowledgeBaseById = async (knowledgeBaseId) => {
  return axios.delete(`${PATH_NAME}/knowledgebase/${knowledgeBaseId}`).then((res) => res?.data);
}

export const updateKnowledgeBase = async (body, knowledgeBaseId) => {
  return axios.patch(`${PATH_NAME}/knowledgebase/${knowledgeBaseId}`, body).then((res) => res?.data);
}

export const regenerateKnowledgeBase = async (knowledgeBaseId) => {
  return axios.put(`${PATH_NAME}/knowledgebase/${knowledgeBaseId}`).then((res) => res?.data);
}

export const getAiModels = async () => {
  return axios.get(`${PATH_NAME}/models`).then((res) => res?.data);
}
