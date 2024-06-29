import axios from 'axios';
import qs from 'qs';

export const DEFAULT_API = axios.create({
  baseURL: import.meta.env.VITE_CHAT_BASE_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});
