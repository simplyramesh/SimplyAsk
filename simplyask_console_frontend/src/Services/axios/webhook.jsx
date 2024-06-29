import { CATALOG_API as axios } from './AxiosInstance';

export const getWebhookTriggers = (params) =>
  axios.get(`/webhook/event-trigger/filter?${params}`).then((res) => res.data);

export const getWebhookTriggerById = (id) => axios.get(`/webhook/event-trigger/${id}`).then((res) => res.data);

export const deleteEventTriggers = (params) =>
  axios
    .delete(`/webhook/event-trigger${params}`)
    .then((res) => res.data)
    .catch((err) => {
      if (err.status === 204) {
        return err.data;
      } else {
        throw err;
      }
    });

export const createWebhookTrigger = (body) => axios.post(`/webhook/event-trigger`, body).then((res) => res.data);

export const updateWebhookTrigger = (id, body) =>
  axios.put(`/webhook/event-trigger/${id}`, body).then((res) => res.data);
