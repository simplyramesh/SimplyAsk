import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/skill-type';

export const getAllSkillTypes = () => {
  return axios
    .get(`${PATH_NAME}/all`)
    .then((res) => res.data);
};
