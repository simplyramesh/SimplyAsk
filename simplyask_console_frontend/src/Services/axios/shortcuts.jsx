import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/shortcuts';

export const getShortcuts = async (params) => {
  return axios.get(`${PATH_NAME}/page`, { params }).then((res) => res?.data);
};

export const searchShortcuts = async (searchText) => {
  return axios
    .get(`/search${PATH_NAME}`, { params: { entityTypes: ['PAGE', 'PROCESS'], searchText } })
    .then((res) => res?.data?.content);
};

export const saveShortcut = async (body) => {
  return axios.post(`${PATH_NAME}`, body).then((res) => res?.data);
};

export const updateShortcuts = async (body) => {
  return axios.post(`${PATH_NAME}/all`, body).then((res) => res?.data);
};

export const deleteShortcut = async (id) => {
  return axios.delete(`${PATH_NAME}/${id}`).then((res) => res?.data);
};
