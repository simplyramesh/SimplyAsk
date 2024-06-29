import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/widget';
const cnstPathName = window.location.pathname;
const cnstPageName = cnstPathName.split('/');
const PageName = cnstPageName.at(-1);

export const getRecentCalls = async (channel) => axios.get(`${PATH_NAME}/totalCalls30Days?channel=${channel}&pagename=${PageName}`);

export const getCallTypesOfDay = async (channel) => axios.get(`${PATH_NAME}/totalCallTypesOfDay?channel=${channel}&pagename=${PageName}`);

export const getFilteredChatWidgets = async (filters = '') => axios.get(`${PATH_NAME}-component/filter?${filters}`).then((res) => res?.data);

export const getChatWidgetById = async (id) => axios.get(`${PATH_NAME}-component/${id}`).then((res) => res?.data);

export const updateChatWidgetById = async (payload) => axios.put(`${PATH_NAME}-component/${payload.id}/update`, payload.body).then((res) => res?.data);

export const createChatWidget = async (body) => axios.post(`${PATH_NAME}-component`, body).then((res) => res?.data);

export const deleteChatWidgetById = async (id, params) => axios.delete(`${PATH_NAME}-component/${id}`, { params })
  .then((res) => res?.data);
