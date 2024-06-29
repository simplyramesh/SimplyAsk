import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/skill-configuration';

// This is almost the same as getSkills(), but getSkills() does not work (it returns an empty array).
export const getAllSkillConfigurations = () => {
  return axios.get(`${PATH_NAME}/all`).then((res) => res.data);
};
