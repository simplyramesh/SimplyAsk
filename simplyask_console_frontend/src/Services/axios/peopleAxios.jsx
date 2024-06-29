import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/person';

export const getPersonById = (personId) => {
  return axios
    .get(`${PATH_NAME}/${personId}`)
    .then((res) => res.data);
};

export const getServiceRequestsByPersonId = (personId) => {
  return axios
    .get(`${PATH_NAME}/serviceRequests/${personId}`)
    .then((res) => res.data);
};

export const getFilesByPersonId = (personId) => {
  return axios
    .get(`${PATH_NAME}/files/${personId}`)
    .then((res) => res.data);
};
