import { CATALOG_API as workflowEngineApi } from './AxiosInstance';

export const getExecutionHeaders = async (processName) => workflowEngineApi.get(`/workflow/fields/${processName}`);

export const submitPreparationRequest = async (request) => workflowEngineApi.post('/workflow/file/prepare', request);

export const submitFileToPreviewFileData = async (request) => workflowEngineApi.post('/workflow/file/prepare/parse-data', request);

export const submitUpdatePreparationRequest = async (request) => workflowEngineApi.post('/workflow/file', request);

export const triggerProcessExecutionByFileId = async (executionFileId, uploadFileName) => workflowEngineApi.get(`/workflow/file/${executionFileId}/execute?filename=${uploadFileName}`);

export const getProcessDefinitions = () => workflowEngineApi.get('/engine-rest/process-definition?latestVersion=true').then((res) => res.data);

export const getAuditSources = () => workflowEngineApi.get('/audit/sources').then((res) => res.data);

export const getProcessesTags = () => workflowEngineApi.get('/workflow/config/tags').then((res) => res.data);

export const checkIfProcessExistsInWorkflowEngineDatabase = (workflowId) => workflowEngineApi.get(`/workflow/config/${workflowId}/exists`);

export const getProcessHistoryDataById = (id, params) => workflowEngineApi.get(`/process/${id}`, { params }).then((res) => res.data);

export const submitPublicProcessExecution = async ({ organizationId }, data) => {
  workflowEngineApi.defaults.headers.common.organizationId = organizationId;
  workflowEngineApi.defaults.headers.common.Apikey = '3KJW7PY9XZ5A2V6HG'; // TODO: This is a temporary solution.

  const formData = new FormData();

  formData.append('data', JSON.stringify(data));
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  return workflowEngineApi.post('/process/execute', formData, config);
};
