import { DEFAULT_API as axios } from './AxiosInstance';

export const getConversationsDashboard = async (filterParams) => axios
  .get('/historical/chart/conversations/dashboard', { params: filterParams })
  .then((res) => res?.data);

export const getConversationalChartData = async (filterParams) => axios
  .get('/historical/chart/conversations', { params: filterParams })
  .then((res) => res?.data);

export const getConversationalNumberChartDataWithMovingAverage = async (filterParams) => axios
  .get('/historical/chart/conversationsNumber', { params: filterParams })
  .then((res) => res?.data);

export const getTransferredConversationChartDataWithMovingAverage = async (filterParams) => axios
  .get('/historical/chart/transferred', { params: filterParams })
  .then((res) => res?.data);

export const getIssuesDashboard = async (filterParams) => axios
  .get('/historical/chart/issue/dashboard', { params: filterParams })
  .then((res) => res?.data);

export const getIssuesChartData = async (filterParams) => axios
  .get('/historical/chart/issue', { params: filterParams })
  .then((res) => res?.data);

export const getIssuesAverageResolutionTimeWithMovingAverage = async (filterParams) => axios
  .get('/historical/chart/issue/averageResolutionTime', { params: filterParams })
  .then((res) => res?.data);
