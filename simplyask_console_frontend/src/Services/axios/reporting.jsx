import { CATALOG_API } from './AxiosInstance';

const PATH_NAME = '/scheduler';

export const getSchedulers = () => {
  return CATALOG_API.get(`${PATH_NAME}`).then(({ data }) => data);
};

export const createScheduler = (data) => {
  return CATALOG_API.post(`${PATH_NAME}`, data).then(({ data }) => data);
};

export const updateScheduler = (data) => {
  return CATALOG_API.put(`${PATH_NAME}/${data.name}`, data).then(({ data }) => data);
};

export const deleteScheduler = (name) => {
  return CATALOG_API.delete(`${PATH_NAME}/${name}`).then(({ data }) => data);
};
