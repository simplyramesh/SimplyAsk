import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/agent';

export const getAgentDefaultConfig = async () => axios.get(`${PATH_NAME}/default-config`).then((res) => res?.data);

export const updateAgentDefaultConfig = async (payload) => axios.patch(`${PATH_NAME}/update-default-config`, payload).then((res) => res?.data);

export const getAgentIntentsById = async (params) => axios.get(`${PATH_NAME}/intent`, { params }).then((res) => res?.data);

export const getAgentIntentsByFilter = async (params) => axios.get(`${PATH_NAME}/intent/filter`, { params }).then((res) => res?.data);

export const submitAndGetTrainingPhrases = async (params, body) => axios.post(`${PATH_NAME}/training-phrases?${params}`, body).then((res) => res?.data);

export const createNewIntent = async (payload) => axios.post(`${PATH_NAME}/intent?${payload.params}`, payload.body).then((res) => res?.data);

export const updateIntent = async (payload) => axios.put(`${PATH_NAME}/intent`, payload).then((res) => res?.data);

export const deleteIntent = async (payload) => axios.delete(`${PATH_NAME}/intent/${payload.intentId}`).then((res) => res?.data);
