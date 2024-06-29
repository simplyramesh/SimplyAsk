import { PRODUCT_CATALOG_API as axios } from './AxiosInstance';

export const getCatalogProducts = async (filterQuery = {}) => axios.get('/productOffering', { params: filterQuery }).then((res) => res?.data);

export const getCatalogProductsById = async (id) => axios.get(`/productOffering/${id}`).then((res) => res?.data);

export const getCatalogProductCategories = async (filterQuery = {}) => axios.get('/category', { params: filterQuery }).then((res) => res?.data);

export const getCatalogProductCategoryById = async (id, filterQuery) => axios.get(`/category/${id}`, { params: filterQuery }).then((res) => res?.data);

export const getCatalogProductOrganizations = async () => axios.get('/organization').then((res) => res?.data);
