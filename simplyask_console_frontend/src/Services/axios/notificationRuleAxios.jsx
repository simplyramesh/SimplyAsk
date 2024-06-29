import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/notification-rule';

export const saveNotificationRule = async (skill) => {
  return axios.post(PATH_NAME, skill);
};

export const getAllNotificationRules = () => {
  return axios
    .get(`${PATH_NAME}/all`)
    .then((res) => res.data);
};
