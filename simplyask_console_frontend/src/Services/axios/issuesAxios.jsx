import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/issues';

export const getIssues = async (filters, signal) => {
  return axios.get(`${PATH_NAME}?${filters}`, { signal }).then((res) => res?.data);
};

export const getIssueById = async (issueId, getFullDetails = true) => {
  return axios
    .get(PATH_NAME, {
      params: {
        issueId,
        ...(getFullDetails
          ? {
              returnParameters: true,
              returnAdditionalField: true,
              returnRelatedEntities: true,
            }
          : {}),
      },
    })
    .then((res) => res?.data?.content?.[0]);
};

export const updateIssues = async (body) => {
  return axios.put(PATH_NAME, body).then((res) => res?.data);
};

export const deleteIssues = async (ids) => {
  return axios.delete(`${PATH_NAME}/delete`, { data: ids }).then((res) => res?.data);
};

export const getIssuesCategoriesConfig = async () => {
  return axios.get(`${PATH_NAME}/category`).then((res) => res?.data);
};

export const createIssue = async (body) => {
  return axios.post(`${PATH_NAME}/issue`, body).then((res) => res?.data);
};

export const getFilteredIssues = async (filterParams) => {
  return axios.get(PATH_NAME, { params: filterParams }).then((res) => res?.data);
};

export const updateIssuesRelatedEntities = async (params, body) => {
  return axios.put(`${PATH_NAME}/update/relatedEntities`, body, { params }).then((res) => res?.data);
};

export const updateIssuesParameterGroups = async (params, body) => {
  return axios.put(`${PATH_NAME}/parameterGroups`, body, { params }).then((res) => res?.data);
};

export const updateIssuesAdditionalFields = async (params, body) => {
  return axios.put(`${PATH_NAME}/additionalFields`, body, { params }).then((res) => res?.data);
};

export const getIssueTypes = async (filterParams = {}) => {
  return axios.get(`${PATH_NAME}/types?${filterParams}`).then((res) => res?.data);
};

export const getIssueTypeById = async (id) => {
  return axios.get(`${PATH_NAME}/types`, { params: { issueTypeId: [id] } }).then((res) => res?.data?.content[0]);
};

export const updateIssuesTypesConfig = async (body) => {
  return axios.put(`${PATH_NAME}/types`, body).then((res) => res?.data);
};

export const deleteIssuesTypesConfig = async (payload) => {
  return axios.delete(`${PATH_NAME}/types`, { data: payload }).then((res) => res?.data);
};

export const createIssuesTypesConfig = async (body) => {
  return axios.post(`${PATH_NAME}/types`, body).then((res) => res?.data);
};

export const deleteIssuesTypesStatuses = async (payload) => {
  return axios.delete(`${PATH_NAME}/types/statuses`, { data: payload }).then((res) => res?.data);
};

export const getIssuesStats = async () => {
  return axios.get(`${PATH_NAME}/stats`).then((res) => res?.data);
};
