import { CATALOG_API as catalog, DEFAULT_API as axios } from './AxiosInstance';

export const getTicketServiceAgents = () => {
  return axios.get('/ticket/service/getAgents').then((res) => res.data);
};

export const getAllPermissionRoles = () => {
  return axios.get('/permission-role/all').then((res) => res.data);
};

export const deleteFalloutTicket = async (id) => {
  return catalog.delete(`/fallout/${id}`);
};

export const getServiceTaskTypes = () => {
  return axios.get('/ticket/service/task/type');
};
