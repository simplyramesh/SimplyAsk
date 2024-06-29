import { DEFAULT_API as axios } from './AxiosInstance';

export const searchEntities = async (params) => {
  return axios.get('/search/shortcuts', { params }).then((res) => res.data);
};