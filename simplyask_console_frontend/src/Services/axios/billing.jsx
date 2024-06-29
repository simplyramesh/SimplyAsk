import { DEFAULT_API as axios } from './AxiosInstance';

export const getBillingInfo = async () => {
  return axios.get('/billing/details/estimate').then((res) => res?.data);
};

export const getBillingCountryOptions = async () => {
  return axios.get('/billing/country').then((res) => res?.data);
};

export const getBillingProvinceOptions = async (countryCode) => {
  return axios.get(`/billing/province/${countryCode}`).then((res) => res?.data);
};

export const getNumEmployeesOptions = async () => {
  return axios.get('register/employee/ranges').then((res) => res?.data);
};

export const getBillingPaymentIntent = async () => {
  return axios.get('/billing/details/payment/generate').then((res) => res?.data);
};

export const updatePaymentBillingInfo = async (customerBillingRequest) => {
  return axios.post('/billing/details/update', customerBillingRequest).then((res) => res?.data);
};

export const getHistoricalDataUsage = async (filterParams) => {
  return axios
    .get('/historical/data/usage', { params: filterParams })
    .then((res) => res?.data);
};

export const getBillingPlan = async () => {
  return axios.get('/billing/plan').then((res) => res?.data);
};
