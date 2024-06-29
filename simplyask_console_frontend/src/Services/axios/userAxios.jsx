import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/user';

export const setUserPermission = async (permissionReq) => axios.post(`${PATH_NAME}/setRolePermissions`, permissionReq);

export const updatePersonalData = async (email, user) => {
  return axios.post(`${PATH_NAME}/updatePersonalData/${email}`, user);
};

// get user's settings tabs
export const changePassword = async (passwordRequest) => {
  return axios.post(`${PATH_NAME}/changePassword`, passwordRequest);
};

// get data to check is user account is locked out
export const getIsAccountLocked = async () => {
  return axios.get(`${PATH_NAME}/getAccountDisableReason`);
};

export const getUserPlatformConfigurationById = (userId) => {
  return axios.get(`${PATH_NAME}/${userId}/userPlatformConfiguration`).then((res) => res.data);
};

export const getActivePlatformProfileById = (userId) => {
  return axios.get(`${PATH_NAME}/${userId}/getActivePlatformProfile`).then((res) => res?.data);
};

export const getUsers = () => {
  return axios.get(`${PATH_NAME}/getUsers`).then((res) => res?.data);
};

export const getCurrentUser = async () => {
  return axios.get(`${PATH_NAME}/getCurrentUser`).then((res) => res?.data);
};
