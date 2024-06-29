import { constructUrlSearchString } from '../../Components/Settings/AccessManagement/utils/formatters';
import { DEFAULT_API as axios } from './AxiosInstance';

const PERMISSION_PATH = '/permissions';
const USER_PATH = '/user';
const USER_GROUP_PATH = '/userGroup';
const USER_GROUP_FILTER_PATH = '/agent-group/filter';

export const getUsersWithFilters = async (filterUrl = '', signal) => {
  return axios.get(`${USER_PATH}/filter?${filterUrl}`, { signal }).then((res) => res?.data);
};

export const postInviteUser = async (userPayload) => {
  return axios.post(`${USER_PATH}/invite`, userPayload).then((res) => res.data);
};

export const patchEditUser = async (userId, userPayload) => {
  return axios.patch(`${USER_PATH}/edit/${userId}`, userPayload).then((res) => res.data);
};

export const getUserById = async (userId) => {
  return axios.get(`${USER_PATH}/findUser?userId=${userId}`).then((res) => res.data);
};

export const getUserPermissionsById = async (userId) => {
  return axios.get(`${PERMISSION_PATH}${USER_PATH}/${userId}`).then((res) => res.data);
};

export const patchUserPermissions = async (userId, permissions) => {
  // For reference: {permissionIds, userGroupIds, permissionGroupIds} = permissions;

  const urlRequestParams = constructUrlSearchString({ ...permissions });

  return axios.patch(`${PERMISSION_PATH}${USER_PATH}/${userId}?${urlRequestParams}`).then((res) => res.data);
};

export const getUserGroupPermissionsById = async (userGroupId) => {
  return axios.get(`${PERMISSION_PATH}${USER_GROUP_PATH}/${userGroupId}`).then((res) => res.data);
};

export const patchUserGroupsById = async (userGroupId, filters) => {
  const filterParams = constructUrlSearchString(filters);

  return axios.patch(`${PERMISSION_PATH}${USER_GROUP_PATH}/${userGroupId}?${filterParams}`).then((res) => res.data);
};

export const getFilteredUserGroups = async (params) => {
  return axios.get(`${USER_GROUP_FILTER_PATH}?${params}`).then((res) => res.data);
};
