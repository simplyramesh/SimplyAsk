import { DEFAULT_API as axios } from './AxiosInstance';

const PATH_NAME = '/telephony';

export const getTelephonyInfo = async (filterParams = '') => {
  return axios.get(`${PATH_NAME}?${filterParams}`).then((res) => res?.data);
};

export const getTelephonyInfoCountries = async () => {
  return axios.get(`${PATH_NAME}/number/countries`).then((res) => res?.data);
};
export const getTelephonyCountryCode = async (countryCode) => {
  return axios.get(`${PATH_NAME}/number/states/${countryCode}`).then((res) => res?.data);
};

export const getTelephonyCountryStateCode = async (countryCode, countryStateCode) => {
  return axios.get(`${PATH_NAME}/number/regions/${countryCode}/${countryStateCode}`).then((res) => res?.data);
};

export const generateNewPhoneNumber = async (countryCode, countryState, areaCode) => {
  return axios.post(`${PATH_NAME}/number/registerAndAttachNumber?countryCode=${countryCode}&countryStateCode=${countryState}&areaCode=${areaCode}`)
}

export const deletePhoneNumberAxios = async (phoneNumber) => {
  return axios.delete(`${PATH_NAME}/number/${phoneNumber}`)
}

export const movePhoneNumberAxios = async (updatedPhoneNumber) => {
  return axios.patch(`${PATH_NAME}/associations`, updatedPhoneNumber).then((res) => res?.data)
}