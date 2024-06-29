import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/page-permissions';

// get PagePermission object based on platform configuration and configuration profile
export const getPagePermissionByPlatformAndProfile = async (platformConfigId, configProfileId) => {
  return axios.get(`${PATH_NAME}/${platformConfigId}/${configProfileId}`);
};

// edit status of a page permission
export const editPermissionsStatus = async (platformConfigId, roleIndex, newStatus) => {
  return axios.post(`${PATH_NAME}/editPermissionsStatus/${platformConfigId}/${roleIndex}`, newStatus);
};

// get child pages
export const getChildrenPages = async (pageId) => {
  return axios.get(`/pages/getChildrenPages/${pageId}`);
};
