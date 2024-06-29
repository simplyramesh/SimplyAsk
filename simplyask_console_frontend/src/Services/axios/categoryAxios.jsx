import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/category';

export const saveCategory = async (category) => {
  return axios.post(PATH_NAME, category);
};

export const deleteCategory = async (id) => {
  return axios.delete(`${PATH_NAME}/${id}`);
};

export const getAllTopLevelCategories = async () => {
  return axios
    .get(`${PATH_NAME}/top-level/all`)
    .then((res) => res.data);
};

export const getAllCategoriesByParentId = async (categoryId) => {
  return axios
    .get(`${PATH_NAME}/parent/${categoryId}/all-detailed`)
    .then((res) => res.data);
};
