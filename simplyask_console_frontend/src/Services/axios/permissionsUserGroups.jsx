import { DEFAULT_API as axios } from './AxiosInstance';

const USER_GROUP_PATH = '/agent-group';

export const getUserGroups = (filterUrl) => {
  return axios
    .get(`${USER_GROUP_PATH}/filter${filterUrl ? `?${filterUrl}` : ''}`)
    .then((res) => res.data);
};

export const deleteUserGroup = (id) => {
  return axios
    .delete(`${USER_GROUP_PATH}/${id}`)
    .then((res) => res.data);
};

export const createUserGroup = (userPayload) => {
  return axios
    .post(`${USER_GROUP_PATH}/create`, userPayload)
    .then((res) => res.data);
};

export const editUserGroups = (userPayload) => {
  return axios
    .post(`${USER_GROUP_PATH}/save`, userPayload)
    .then((res) => res.data);
};

export const getUserGroupsWithFilters = (filterSearchUrl) => {
  return axios
    .get(`${USER_GROUP_PATH}/filter?${filterSearchUrl}`)
    .then((res) => res.data);
};

export const getAllUserGroups = async () => {
  return axios
    .get(`${USER_GROUP_PATH}/all`)
    .then((res) => res.data);
};

export const updateUserGroups = (id, userPayload) => {
  return axios
    .post(`${USER_GROUP_PATH}/${id}/update`, userPayload)
    .then((res) => res.data);
};
