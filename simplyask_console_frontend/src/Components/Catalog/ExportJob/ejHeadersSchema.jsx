import { OBJECT_WILD_CARD_KEY } from '../../../utils/helperFunctions';
import { fieldKeys } from '../../../utils/serviceRequests';
import ExportJobTableIcon from '../../shared/REDISIGNED/icons/CustomTableIcons';
import classes from './ExportJob.module.css';

export const uniqueId = fieldKeys.SERVICE_REQUEST_ID;

const getEJHeaders = (editButtonHandler) => [
  {
    name: 'Base Type',
    source: 'baseType',
    bold: true,
  },
  {
    name: 'Type',
    source: 'type',
  },
  {
    name: 'Completion Date',
    source: 'completionDate',
  },
  {
    name: 'Creation Date',
    source: 'creationDate',
  },
  {
    name: 'Status',
    source: 'status',
  },
  {
    name: '',
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: (val) => (
      <div className={classes.editButton} onClick={() => editButtonHandler(val)}>
        <ExportJobTableIcon icon="EDIT" width={32} />
      </div>
    ),
  },
];

export default getEJHeaders;
