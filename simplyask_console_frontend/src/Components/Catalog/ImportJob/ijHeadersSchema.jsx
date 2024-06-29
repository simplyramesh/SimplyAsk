import { OBJECT_WILD_CARD_KEY } from '../../../utils/helperFunctions';
import ImportJobTableIcon from '../../shared/REDISIGNED/icons/CustomTableIcons';
import classes from './ImportJob.module.css';

export const uniqueId = 'id';

const getIJHeaders = (editButtonHandler) => [
  {
    name: 'ID',
    source: 'id',
    bold: true,
  },
  {
    name: 'Base Type',
    source: 'baseType',
  },
  {
    name: 'Type',
    source: 'type',
  },
  {
    name: 'Content Type',
    source: 'contentType',
  },
  {
    name: 'Path',
    source: 'path',
  },
  {
    name: '',
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: (val) => (
      <div className={classes.editButton} onClick={() => editButtonHandler(val)}>
        <ImportJobTableIcon icon="EDIT" width={32} />
      </div>
    ),
  },
];

export default getIJHeaders;
