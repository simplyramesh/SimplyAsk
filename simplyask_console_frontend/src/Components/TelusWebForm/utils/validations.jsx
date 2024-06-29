const isPhoneNumber = (num) => {
  if (num.length !== 10) return false;
  return /^\d+$/.test(num);
};

const isNumber = (num) => {
  if (num.length === 0) return false;
  return /^\d+$/.test(num);
};

const isString = (myString) => {
  return /^[a-zA-z ]+$/.test(myString);
};

export const isEmail = (email) => {
  const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return EMAIL_PATTERN.test(email.toLowerCase());
};

export const agentEmailValidation = (value) => value.trim() !== '' && isEmail(value);

export const MOBILITY_VALIDATIONS = {
  agentId: (value) => value.trim() !== '' && isNumber(value) && value.length <= 6,
  orderNumber: (value) => value.trim() !== '',
  customerBAN: (value) => value.trim() !== '',
  customerFullName: (value) => value.trim() !== '' && isString(value),
  customerPhoneNumber: (value) => value.trim() !== '' && isPhoneNumber(value),
};

export const DFC_VALIDATIONS = {
  agentId: (value) => value.trim() !== '' && isNumber(value) && value.length <= 6,
  orderNumber: (value) => value.trim() !== '',
  customerFullName: (value) => value.trim() !== '' && isString(value),
  customerPhoneNumber: (value) => value.trim() !== '' && isPhoneNumber(value),
};

export const agentEmailValidationMessage = (agentEmail, t) => {
  if (agentEmail.trim() === '') return t('agentEmail.error');
  if (!isEmail(agentEmail)) return t('agentEmail.error2');
  return '';
};

export const VALIDATION_MESSAGES = (t) => ({
  agentId: (agentId) => {
    if (agentId.trim() === '') return t('agent.error');
    if (agentId.length > 6) return t('agent.error2');
    if (!isNumber(agentId)) return t('agent.error3');
    return '';
  },
  orderNumber: (orderNumber) => {
    if (orderNumber.trim() === '') return t('doms.error');
    return '';
  },
  customerBAN: (customerBAN) => {
    if (customerBAN.trim() === '') return t('ban.error');
    return '';
  },
  customerFullName: (customerFullName) => {
    if (customerFullName.trim() === '') return t('fullName.error');
    if (!isString(customerFullName)) return t('fullName.error2');
    return '';
  },
  customerPhoneNumber: (customerPhoneNumber) => {
    if (customerPhoneNumber.trim() === '') return t('mobile.error');
    if (!isPhoneNumber(customerPhoneNumber)) return t('mobile.error2');
    return '';
  },
});
