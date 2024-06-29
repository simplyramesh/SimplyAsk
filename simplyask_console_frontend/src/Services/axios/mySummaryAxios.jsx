import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/my-summary';

export const getAllInsights = () => {
  return axios
    .get(`${PATH_NAME}/getAllInsights`)
    .then((res) => res.data);
};
