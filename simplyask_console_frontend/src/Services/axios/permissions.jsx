import { constructUrlSearchString } from '../../Components/Settings/AccessManagement/utils/formatters';
import { DEFAULT_API as axios } from './AxiosInstance';

const PERMISSIONS = '/permissions';
const PERMISSION_GROUP = '/permissionGroup';

export const getPages = async () => {
  return axios.get('/permissions/pages');
};

export const getPermissionGroups = async (search) => {
  return axios.get(`permissions-group/filter?${search ?? ''}`)
    .then((res) => res.data);
};

export const createPermissionGroup = async (body) => {
  return axios.post('/permissions-group/create', body);
};

export const deletePermissionGroup = async (id) => {
  return axios.delete(`/permissions-group/${id}`);
};

export const editPermissionGroup = async (id, body) => {
  return axios.put(`/permissions-group/${id}`, body);
};

export const getPermissionGroup = async (id) => {
  return axios.get(`/permissions-group/${id}`)
    .then((res) => res.data);
};

export const getPermissionSummary = async (filterUrl, signal) => {
  return axios.get(`/permissions/filter?${filterUrl}`, { signal }).then((res) => res.data);
};

export const patchPermissionGroup = async (permissionGroupId, idsToAdd) => {
  // For reference: {permissionIds, userGroupIds, userIds} = idsToAdd;

  const urlRequestParams = constructUrlSearchString({ ...idsToAdd });

  return axios
    .patch(`${PERMISSIONS}${PERMISSION_GROUP}/${permissionGroupId}?${urlRequestParams}`)
    .then((res) => res.data);
};

export const postPermissionFeatures = async (parentOrganizationPermissionId, featureIds) => {
  const urlFeatureIds = constructUrlSearchString({ featureIds });

  return axios
    .post(`${PERMISSIONS}/${parentOrganizationPermissionId}?${urlFeatureIds}`)
    .then((res) => res.data);
};

export const patchPermissionFeatures = async (organizationPermissionId, featureIds) => {
  const urlFeatureIds = constructUrlSearchString({ featureIds });

  return axios
    .patch(`${PERMISSIONS}/${organizationPermissionId}?${urlFeatureIds}`)
    .then((res) => res.data);
};

export const getGlobalPermissionsFeatures = () => {
  return axios.get('permissions/features').then((res) => res?.data);
};
