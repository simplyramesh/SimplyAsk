import { DEFAULT_API as axios } from './AxiosInstance';

export const submitSupportRequest = async (requestData) => {
  return axios.post('/support/request', requestData);
};

export const postFeedback = async (feedbackData) => {
  return axios.post('/user/report', feedbackData);
};
