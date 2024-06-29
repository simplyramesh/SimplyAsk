import { PRODUCT_ORDER_API as axios } from './AxiosInstance';

export const getProductOrder = async (filterQuery = {}) =>
  axios.get('/productOrder', { params: filterQuery }).then((res) => res?.data);

export const getProductOrderPageable = async (filterQuery = {}) =>
  axios.get('/productOrderPageable', { params: filterQuery }).then((res) => res?.data);

export const getProductOrderById = async (id, filterQuery = {}) =>
  axios.get(`/productOrder/${id}`, { params: filterQuery }).then((res) => res?.data);

export const postProductOrderCart = async (payload) =>
  axios.post('/productOrder/cart', payload).then((res) => res?.data);

export const postProductOrderCheckout = async (payload) =>
  axios.post('/productOrder/checkout', payload).then((res) => res?.data);

export const postProductOrder = async (payload) => axios.post('/productOrder', payload).then((res) => res?.data);

export const getProductOrderCustomers = async (filterQuery) => {
  const searchParamsObject = Object.fromEntries(
    [...new URLSearchParams(filterQuery)].filter(([, value]) => value !== '') // Filter out empty parameters - API may return [] even though there is a match
  );

  return axios.get('/customer', { params: searchParamsObject }).then((res) => res?.data);
};

export const getProductOrderCustomersPageable = async (filterQuery) => {
  const searchParamsObject = Object.fromEntries(
    [...new URLSearchParams(filterQuery)].filter(([, value]) => value !== '') // Filter out empty parameters - API may return [] even though there is a match
  );

  return axios.get('/customerPageable', { params: searchParamsObject }).then((res) => res?.data);
};

export const postProductOrderCustomer = async (payload) => axios.post('/customer', payload).then((res) => res?.data);
