import { DEFAULT_API as axios } from './AxiosInstance';

const DATA_VISUALIZER_PATH = '/datavisualization';

export const getProcessExecutionsForVisualizer = (params) => axios
  .get(`${DATA_VISUALIZER_PATH}/visualizations`, { params })
  .then((res) => res.data);

export const getProcessExecutionsForVisualizerTable = (id) => axios
  .get(`${DATA_VISUALIZER_PATH}/visualizations/${id}/extract`)
  .then((res) => res.data);

export const generateProcessDataVisualization = (payload) => axios.post(`${DATA_VISUALIZER_PATH}/visualizations-and-process`, payload).then((res) => res?.data);

export const deleteProcessDataVisualization = (id) => axios.delete(`${DATA_VISUALIZER_PATH}/visualizations/${id}`).then((res) => res?.data);
