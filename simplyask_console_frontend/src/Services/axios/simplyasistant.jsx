import axios from 'axios';

export const getModels = () => {
  return axios.get('/simplyassistant/models').then((res) => res?.data);
}
