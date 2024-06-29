import { DEFAULT_API as axios } from './axiosInstance';

export const getFileDownloadLink = (fileId) => `/file/download?Id=${fileId}`;

export const saveFile = async (data) => axios.post('/file/upload', data).then((res) => res?.data);

export const getUserAvatar = async (fileId) => {
  return axios({
    method: 'GET',
    url: getFileDownloadLink(fileId),
    responseType: 'blob',
  });
};
