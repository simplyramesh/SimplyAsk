import { DEFAULT_API as axios } from './AxiosInstance';

export const listAPIKeys = async (searchParams) => {
  return axios.get(`/key/all?${searchParams}`).then((res) => res.data);
};

export const generateAPIKey = (apiKeyName) => {
  return axios.post(`/key/generate/${apiKeyName}`, {});
};

export const deleteAPIKey = (keyId) => {
  return axios.delete(`/key/delete/${keyId}`);
};

export const setDefaultAPIKey = (keyId) => {
  return axios.put(`/key/setDefault/${keyId}`);
};

export const editAPIKeyName = (keyId, keyName) => {
  return axios.put(`/key/update/${keyId}/name?name=${keyName}`);
};
