import { appendHashtag } from '../../helperFunctions';
import { fieldKeys } from '../../serviceRequests';

export const uniqueId = fieldKeys.SERVICE_REQUEST_ID;

const headers = [
  {
    name: 'Service Type',
    source: fieldKeys.SERVICE_NAME,
    bold: true,
    subtitle: {
      source: fieldKeys.TRACK_NUMBER,
      formatter: (val) => appendHashtag(val),
    },
  },
  {
    name: 'Location',
    source: fieldKeys.ADDRESS,
  },
  {
    name: 'Requested by',
    source: [fieldKeys.FIRST_NAME, fieldKeys.LAST_NAME],
  },
  {
    name: 'Assignee',
    source: fieldKeys.AGENT_NAME,
  },
];

export default headers;
