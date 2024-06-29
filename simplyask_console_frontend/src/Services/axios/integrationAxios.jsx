import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/rest-mapping';

export const saveIntegration = async (integration) => {
  return axios.post(PATH_NAME, integration);
};

export const deleteIntegration = async (id) => {
  return axios.delete(`${PATH_NAME}/${id}`);
};

export const getAllIntegrations = () => {
  return axios
    .get(`${PATH_NAME}/all`)
    .then((res) => res.data);
};
