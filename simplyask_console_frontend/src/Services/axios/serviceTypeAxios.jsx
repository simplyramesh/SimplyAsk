import { DEFAULT_API as axios } from './AxiosInstance';

const SERVICE_TYPE_PATH_NAME = '/service-type';

export const getAllServiceType = () => {
  return axios
    .get(`${SERVICE_TYPE_PATH_NAME}/all`)
    .then((res) => res.data);
};
