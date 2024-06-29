import { CATALOG_API as workflowEngineApi, MIGRATE_ENGINE_API as axios } from './AxiosInstance';

export const getAllSourcesOrTargetsOrFieldsSystems = async (category) => {
  return axios.get(`/design/systemData/model?category=${category}`).then((res) => res?.data ?? []);
};

export const getAllMrManagerSettings = async () => {
  return axios.get('/projectconfiguration').then((res) => res?.data ?? []);
};

export const setAllMrManagerSettings = async (data) => {
  return axios.put('/projectconfiguration', data).then((res) => res?.data ?? []);
};

export const getAllSourcesOrTargetsOrFieldsObjects = async (systemId, category) => {
  if (!systemId) return;

  return axios.get(`/design/systemData/model/object?systemId=${systemId}&category=${category}`)
    .then((res) => res?.data ?? []);
};

export const getAllSourcesOrTargetsOrFieldsNames = async (objectId, category) => {
  if (!objectId) return;

  return axios.get(`/design/systemData/model/field?objectId=${objectId}&category=${category}`)
    .then((res) => res?.data ?? []);
};

export const deleteAssociationTableRowById = async (id) => {
  return axios.delete(`/design/${id}`)
    .then((res) => res?.data);
};

export const getAllMigrationExecutionStats = async (executionId) => {
  if (!executionId) {
    return axios.get('/executions/stats').then((res) => res?.data);
  }
  return axios.get(`/executions/stats?executionId=${executionId}`).then((res) => res?.data);
};

export const getAllDesignExecutionStatsApi = async (id) => {
  if (!id) {
    return axios.get('/design/status').then((res) => res?.data);
  }
  return axios.get(`/design/status?targetSystemId=${id}`).then((res) => res?.data);
};

export const submitExecutionFile = async (fileData) => {
  return axios.post('/executions/execute', fileData);
};

export const deployDesignUpdates = async () => {
  return workflowEngineApi.get('/migration/deploy').then((res) => res?.data);
};

export const downloadExecutionReport = async (id) => {
  return axios.get(`/executions/${id}/report`).then((res) => res?.data);
};

export const getPreDesignMetadata = async () => {
  return axios.get('/predesign/metadata?isSource=true').then((res) => res?.data);
};

export const getAssociationSetById = (associationSetId) => {
  return axios.get(`/design/${associationSetId}`).then((res) => res.data ?? []);
};

export const getAllExecutions = (filter) => {
  return axios.get(`/executions/summaries?${filter}`).then((res) => res.data);
};

export const getExecutionSummaryById = (id, filters) => {
  return axios.get(`/executions/summaries/${id}/records?${filters}`).then((res) => res.data);
};

export const getExecutionRecordDetailById = (executionId, externalRecordId) => {
  return axios.get(`/executions/summaries/${executionId}/records/${externalRecordId}`).then((res) => res.data);
};
