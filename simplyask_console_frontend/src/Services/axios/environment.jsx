import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/environments';

export const getEnvironments = async (filter) =>
  axios.get(`${PATH_NAME}/filter${filter ? `?${filter}` : ''}`).then(({ data }) => data);

export const deleteEnvironment = async (id) =>
  axios
    .delete(`${PATH_NAME}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      if (err.status === 204) {
        return err.data;
      } else {
        throw err;
      }
    });

export const createEnvironment = async (request) => axios.post(PATH_NAME, request).then((res) => res?.data);

export const updateEnvironment = async (envId, request) => axios.post(`${PATH_NAME}/${envId}`, request);

export const getParametersSets = async (filterQuery) =>
  axios.get(`${PATH_NAME}/parameters/filter?${filterQuery}`).then((res) => res.data);

export const createParametersSet = async (payload) => axios.post(`${PATH_NAME}/parameters`, payload);

export const updateParametersSet = async (id, payload) => axios.post(`${PATH_NAME}/parameters/${id}`, payload);

export const deleteParametersSet = async (id) =>
  axios
    .delete(`${PATH_NAME}/parameters/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      if (err.status === 204) {
        return err.data;
      } else {
        throw err;
      }
    });
