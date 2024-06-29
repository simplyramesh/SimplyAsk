import { PRODUCT_INVENTORY_API as axios } from './AxiosInstance';

export const getProductInventoryById = async (id) => axios.get(`/product/${id}`).then((res) => res?.data);

export const getProductInventoryPageable = async (filterQuery = {}) => {
  const searchParamsObject = Object.fromEntries(
    [...new URLSearchParams(filterQuery)].filter(([, value]) => value !== '')
  );

  return axios.get('/productPageable', { params: searchParamsObject }).then((res) => res?.data);
};
