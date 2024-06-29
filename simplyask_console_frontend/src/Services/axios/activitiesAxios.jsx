import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/activities';

export const getActivities = async (params) => {
  return axios.get(`${PATH_NAME}`, { params }).then((res) => res?.data);
};

export const getActivitiesFilter = async (params) => {
  return axios.get(`${PATH_NAME}?${params}`).then((res) => res?.data);
};

export const createActivity = async (body) => {
  return axios.post(`${PATH_NAME}/save`, body).then((res) => res?.data);
};

export const updateActivity = async (id, body) => {
  return axios.patch(`${PATH_NAME}/${id}`, body).then((res) => res?.data);
};

export const deleteActivity = async (id) => {
  return axios.delete(`${PATH_NAME}/${id}`).then((res) => res?.data);
};

export const getRecentViewedPages = async () => {
  return axios.get(`${PATH_NAME}/recent`).then((res) => res?.data);
};

export const updateActivitiesStatus = async (activityIds, isRead) => {
  return axios
    .post(`${PATH_NAME}/markActivityStatus?activityIds=${activityIds}&isRead=${isRead}`)
    .then((res) => res?.data);
};
