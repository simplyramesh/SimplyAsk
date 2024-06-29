import FileDownload from 'js-file-download';
import { toast } from 'react-toastify';

import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { fileToBase64 } from '../../utils/helperFunctions';

import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/files';
export const DATA_TYPES = { FILE: 'file', FILE_INFO: 'fileInfo', FILE_PFP: 'filepfp' };
const STORAGES = { FILE_SYSTEM: 'FILE_SYSTEM' };

export const TICKETS_FILE_FORMAT = { PDF: 'PDF', CSV: 'CSV' };

export const getFileInfo = (
  parent,
  uploadBy,
  stringify = false,
  name = null,
  description = '',
  storageSystem = STORAGES.FILE_SYSTEM
) =>
  stringify
    ? JSON.stringify({
        name,
        description,
        storageSystem,
        parent,
        uploadBy,
      })
    : {
        name,
        description,
        storageSystem,
        parent,
        uploadBy,
      };

export const downloadTicketDetails = async (format) => {
  try {
    const result = await axios.get(`${PATH_NAME}/requests-${format}-download`);

    if (result?.data) {
      window.open(result.data, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Server response error');
    }
  } catch {
    toast.error('Server response error');
  }
};

export const getFileDonwloadLink = (fileId) =>
  `${import.meta.env.VITE_BACKEND_BASE_URL}${PATH_NAME}/${fileId}/downloadFile`;

const setAuthorization = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const downloadApiFile = async (fileId, name) => {
  // add bearer token to the header
  setAuthorization();

  return axios({
    url: getFileDonwloadLink(fileId),
    method: 'GET',
    responseType: 'blob', // important
  }).then((response) => {
    FileDownload(response.data, `${name}`);
  });
};

export const getApiFile = async (fileId) => {
  // add bearer token to the header
  setAuthorization();

  return axios({
    url: getFileDonwloadLink(fileId),
    method: 'GET',
    responseType: 'blob',
  }).then((response) => response.data);
};

export const saveFile = async (files, parentId, parentFolderName = '', userId) => {
  const data = new FormData();
  const fileInfo = [];
  // creating the file info array for each file and adding files
  for (let i = 0; i < files.length; i++) {
    fileInfo.push(getFileInfo({ id: parentId, name: parentFolderName, type: 'FILE' }, userId));
    data.append(DATA_TYPES.FILE, files[i]);
  }
  data.append(DATA_TYPES.FILE_INFO, JSON.stringify(fileInfo));

  return axios.post(`${PATH_NAME}/uploadFile`, data).then((res) => res.data);
};

export const saveFolder = async (folderName, parentId, userId) => {
  const data = new FormData();

  data.append(DATA_TYPES.FILE_INFO, getFileInfo(parentId, userId, true, folderName));

  return axios.post(`${PATH_NAME}/createFolder`, data);
};

export const renameFileOrFolder = async (newName, fileId) =>
  axios.post(`${PATH_NAME}/rename`, null, {
    params: { name: newName, id: fileId },
  });

export const deleteFileOrFolder = async (fileId) => axios.delete(`${PATH_NAME}/delete/${fileId}`);

export const getFileParentOrSearchKey = (getURL) => axios.get(getURL).then((res) => res.data);

export const getUserAvatar = async (link) => {
  const response = await axios({
    method: 'GET',
    url: getFileDonwloadLink(link),
    responseType: 'blob',
  });

  return fileToBase64(response.data);
};

export const saveImgFile = async (fileArr, parentId, userId, isPfp) => {
  const data = new FormData();
  const fileInfo = [];
  for (let i = 0; i < fileArr.length; i++) {
    const splitImgType = fileArr[i].type.split('/');
    const imgType = splitImgType[1].toUpperCase();
    const capitalizeImage = `${splitImgType[0].charAt(0).toUpperCase()}${splitImgType[0].slice(1)}`;

    fileInfo.push(getFileInfo(parentId, userId, false, fileArr[i].name, `Profile ${capitalizeImage} ${imgType}`));
    data.append(DATA_TYPES.FILE, fileArr[i]);
  }
  data.append(DATA_TYPES.FILE_INFO, JSON.stringify(fileInfo));
  data.append(DATA_TYPES.FILE_PFP, isPfp);

  return axios.post(`${PATH_NAME}/uploadFile`, data).then((res) => res.data);
};

export const downloadIssueAllAttachments = async (params) =>
  axios
    .get(`${PATH_NAME}/downloadAllFiles`, { params, responseType: 'blob' })
    .then((res) => FileDownload(res?.data, `${params.issueId} - Attachments.zip`));

export const getAllIssueAttachments = async (params) =>
  axios.get(`${PATH_NAME}/getFileInfoMetaDataForServiceTicket`, { params }).then((res) => res?.data);

export const deleteUploadedFile = async (payload) =>
  axios.delete(`${PATH_NAME}/delete/${payload.fileId}`).then((res) => res?.data);

export const saveFileToIssues = async (data) => axios.post(`${PATH_NAME}/uploadFile`, data).then((res) => res.data);

export const getFileInfoMetadata = async (fileId) =>
  axios.get(`${PATH_NAME}/${fileId}/getFileInfoMetadata`).then((res) => res.data);

export const getAllFileLinkages = async (folderId) =>
  axios.get(`${PATH_NAME}/verify/${folderId}`).then((res) => res.data);
