import axios from 'axios';
import qs from 'qs';

import routes from '../../config/routes';

import { Logout } from './authAxios';

export const DEFAULT_API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const CHAT_API = axios.create({
  baseURL: import.meta.env.VITE_CHAT_BASE_URL,
});

export const CATALOG_API = axios.create({
  baseURL: import.meta.env.VITE_CATALOG_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const TEST_ENGINE_API = axios.create({
  baseURL: import.meta.env.VITE_TEST_ENGINE_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const MIGRATE_ENGINE_API = axios.create({
  baseURL: import.meta.env.VITE_MIGRATE_ENGINE_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const PRODUCT_CATALOG_API = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_CATALOG_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const PRODUCT_ORDER_API = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_ORDER_MANAGEMENT_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const PRODUCT_INVENTORY_API = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_INVENTORY_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const SIMPLY_ASSISTANT_API = axios.create({
  baseURL: import.meta.env.VITE_SIMPLY_ASSISTANT_ENGINE_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const setDefaultHeader = (token) => {
  [DEFAULT_API, CATALOG_API, TEST_ENGINE_API, MIGRATE_ENGINE_API, CHAT_API].forEach((api) => {
    const { common } = api.defaults.headers;

    common.Authorization = `Bearer ${token}`;
    common.AuthorizationInternal = `Bearer ${token}`;
  });

  [PRODUCT_CATALOG_API, PRODUCT_ORDER_API, PRODUCT_INVENTORY_API].forEach((api) => {
    const { common } = api.defaults.headers;

    const username = import.meta.env.VITE_PRODUCT_CATALOG_USERNAME;
    const password = import.meta.env.VITE_PRODUCT_CATALOG_PASSWORD;

    const credentials = btoa(`${username}:${password}`);
    common.Authorization = `Basic ${credentials}`;
    common.AuthorizationInternal = `Basic ${credentials}`;
    common.contentType = 'application/json';
    common.credentials = 'include';
  });
};

[
  DEFAULT_API,
  CATALOG_API,
  TEST_ENGINE_API,
  MIGRATE_ENGINE_API,
  CHAT_API,
  PRODUCT_CATALOG_API,
  PRODUCT_ORDER_API,
].forEach((api) => {
  api.interceptors.response.use(
    (response) => {
      if (response.status === 200 || response.status === 201) {
        return response;
      }

      return Promise.reject(response);
    },
    (error) => {
      if (error.response && error.response.status === 403) {
        Logout();
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        window.location = routes.DEFAULT;
      }

      return Promise.reject(error);
    }
  );
});

[
  DEFAULT_API,
  CATALOG_API,
  TEST_ENGINE_API,
  MIGRATE_ENGINE_API,
  CHAT_API,
  PRODUCT_CATALOG_API,
  PRODUCT_ORDER_API,
].forEach((api) => {
  api.interceptors.request.use((config) => {
    config.headers.currentpage = window.location.pathname;

    return config;
  });
});
