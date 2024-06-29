import { fieldKeys } from '../../utils/serviceRequests';

export const uniqueId = fieldKeys.ID;

const headers = [
  {
    name: 'First Name',
    source: fieldKeys.FIRST_NAME,
    bold: true,
  },
  {
    name: 'Last Name',
    source: fieldKeys.LAST_NAME,
  },
  {
    name: 'Email',
    source: fieldKeys.EMAIL,
  },
  {
    name: 'Phone Number',
    source: fieldKeys.PHONE_NUMBER,
  },
  {
    name: 'Address',
    source: fieldKeys.ADDRESS,
  },
];

export default headers;
