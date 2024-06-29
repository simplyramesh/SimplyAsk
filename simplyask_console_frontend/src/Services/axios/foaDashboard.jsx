import { CHAT_API as axios } from './AxiosInstance';

export const getAutomationPercentageOfDay = () => {
  return axios.get('/widget/automationPercentageOfDay');
};

export const getNumberChatsOfDay = async () => {
  return axios.get('/widget/numberChatsOfDay');
};
