import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/web-pages';

export const saveWebPage = async (webPage) => {
  return axios.post(PATH_NAME, webPage);
};

export const deleteWebPage = async (webPageId) => {
  return axios.delete(`${PATH_NAME}/${webPageId}`);
};

export const getAllWebPages = () => {
  return axios
    .get(`${PATH_NAME}/all`)
    .then((res) => res.data);
};
