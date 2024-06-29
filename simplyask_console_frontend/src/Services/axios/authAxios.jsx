import { DEFAULT_API as axios } from './AxiosInstance';

export const Login = async (email, password) => {
  let response;
  try {
    response = await axios.post('/login', { email, password });
  } catch (error) {
    response = error.response;
  }

  return response;
};

export const Logout = async () => {
  return axios.post('/logout').then((res) => res.data?.token);
};

export const Register = async (user) => {
  return axios.post('/user/register', user).then((res) => res.data?.token);
};

export const createNewAccount = async (firstName, lastName, email, userSelectedPermission, password) => {
  return axios.post('/user/invite', {
    firstName,
    lastName,
    email,
    permissionIdList: userSelectedPermission.map(({ value }) => value),
    password,
  });
};

export const resetPassword = async (email) => {
  return axios.post('/user/resetPassword', { email }).then((res) => res?.data);
};

export const registerCustomerAndGetTokenId = async (customerInfo, customerRegistrationUniqueId) => {
  if (customerRegistrationUniqueId) {
    return axios
      .post(`/register/customer?registrationId=${customerRegistrationUniqueId}`, customerInfo)
      .then((res) => res?.data?.length > 0 && res.data);
  }
  return axios.post('/register/customer', customerInfo).then((res) => res?.data?.length > 0 && res.data);
};

export const registerOrganizationWithTokenId = async (registrationId, organizationInformation) => {
  return axios
    .post(`/register/organization/${registrationId}`, organizationInformation)
    .then((res) => res?.data?.length > 0 && res.data);
};

export const registerBillingWithTokenId = async (registrationId, billingInformation) => {
  return axios
    .post(`/register/billing/${registrationId}?planId=2ff76f02-1535-11ee-be56-0242ac120002`, billingInformation)
    .then((res) => res?.data?.length > 0 && res?.data);
};

export const completeRegistrationWithTokenId = async (registrationId, promoId, authorizedPaymentIntentId) => {
  return axios
    .post(`/register/complete/${registrationId}/${promoId}?authorizedPaymentIntentId=${authorizedPaymentIntentId}`)
    .then((res) => res?.data);
};

export const getPromoCodeDetails = async (promotionalOfferName) => {
  return axios.get(`/register/promo/${promotionalOfferName}`).then((res) => res?.data);
};

export const getOrganizationDetails = async () => {
  return axios.get('/register/organization').then((res) => res?.data);
};

export const setOrganizationDetails = async (data) => {
  return axios.post('/register/organization', data).then((res) => res?.data);
};

export const resendRegistrationEmail = async (email) => {
  return axios.post(`/resendRegistrationEmail?email=${email}`).then((res) => res?.data);
};
