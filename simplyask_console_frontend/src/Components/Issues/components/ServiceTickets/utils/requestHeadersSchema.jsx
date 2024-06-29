import { modifyAddress } from '../../../../../utils/functions/modifyAddress';
import { modifyTimeStamp } from '../../../../../utils/functions/modifyTime';
import { appendHashtag } from '../../../../../utils/helperFunctions';
// import { getIcon } from '../../utils/serviceRequestPicker';
import { fieldKeys } from '../../../../../utils/serviceRequests';
import TicketsStatus from '../components/TicketsStatus/TicketsStatus';

export const uniqueId = fieldKeys.TRACK_NUMBER;

const headers = [
  {
    name: 'Ticket Name',
    source: 'displayName',
    bold: true,
    subtitle: {
      source: 'id',
      formatter: (val) => appendHashtag(val),
    },
  },
  {
    name: 'Date Created',
    source: 'createdAt',
    formatter: modifyTimeStamp,
  },
  {
    name: 'Location',
    source: 'additionalFields.address',
    formatter: modifyAddress,
  },
  {
    name: 'Requested by',
    source: 'requestedBy.name',
  },
  {
    name: 'Assignee',
    source: 'assignedTo.name',
  },
  {
    name: 'Status',
    source: fieldKeys.STATUS_PROJECT,
    alignCenter: true,
    formatter: (val) => {
      return <TicketsStatus status={val} />;
    },
  },
];

export default headers;
