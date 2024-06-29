import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/agent-group';

export const saveAgentGroup = async (agentGroup) => {
  return axios.post(`${PATH_NAME}/save`, agentGroup);
};

export const updateAgentGroup = async (agentGroup) => {
  return axios.post(`${PATH_NAME}/${agentGroup.id}/update`, agentGroup);
};

export const deleteGroup = async (id) => {
  return axios.delete(`${PATH_NAME}/${id}`);
};

export const getGroupsById = async (groupIds) => {
  if (!groupIds || groupIds === '---') return { data: [] };
  return axios.get(`${PATH_NAME}/allById?ids=${groupIds.map((id) => `${id}`)}`);
};

export const getNumberOfUsers = async (groupIds) => {
  return axios.get(`${PATH_NAME}/userCount?groupIds=${groupIds}`);
};

// This is almost the same as getAgentGroups(), but getAgentGroups() does not work (it returns an empty array).
export const getAllOrganizationGroups = () => {
  return axios.get(`${PATH_NAME}/all`).then((res) => res.data);
};
