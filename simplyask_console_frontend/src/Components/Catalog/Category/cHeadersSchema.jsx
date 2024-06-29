import { OBJECT_WILD_CARD_KEY } from '../../../utils/helperFunctions';
import CategoryTableIcon from '../../shared/REDISIGNED/icons/CustomTableIcons';
import classes from './Category.module.css';

export const uniqueId = 'id';

const getCHeaders = (editButtonHandler) => [
  {
    name: 'Name',
    source: 'name',
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
    name: 'Root',
    source: 'isRoot',
    formatter: (val) => {
      if (val === true) return 'Yes';
      return 'No';
    },
  },
  {
    name: 'Version',
    source: 'version',
  },
  {
    name: '',
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: (val) => (
      <div className={classes.editButton} onClick={() => editButtonHandler(val)}>
        <CategoryTableIcon icon="EDIT" width={32} />
      </div>
    ),
  },
];

export default getCHeaders;
