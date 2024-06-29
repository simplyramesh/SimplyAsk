import { CATALOG_API as axios } from './AxiosInstance';

export const getFalloutReportHtml = async (source, from, to, params) => axios.get(`/audit/source/${source}/report/html/from/${from}/to/${to}`, { params });

export const getFalloutReportCsv = async (source, from, to, params) => axios.get(`/audit/source/${source}/report/csv/from/${from}/to/${to}`, { params });

export const getExecutionStats = async (processName) => {
  const name = processName.queryKey[1];
  const url = name?.length > 0
    ? `process/statistic?details=true&processName=${name}`
    : 'process/statistic?details=true';

  return axios.get(url).then((res) => res?.data);
};
