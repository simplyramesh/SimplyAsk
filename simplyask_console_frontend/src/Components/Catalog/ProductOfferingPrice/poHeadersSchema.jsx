import { OBJECT_WILD_CARD_KEY } from '../../../utils/helperFunctions';
import ProductOfferingTableIcon from '../../shared/REDISIGNED/icons/CustomTableIcons';
import classes from './ProductOfferingPrice.module.css';

export const uniqueId = 'id';

const getPOHeaders = (editButtonHandler) => [
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
    name: 'Bundle',
    source: 'isBundle',
    formatter: (val) => {
      if (val === true) return 'Yes';
      return 'No';
    },
  },
  {
    name: 'Percentage',
    source: 'percentage',
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
        <ProductOfferingTableIcon icon="EDIT" width={32} />
      </div>
    ),
  },
];

export default getPOHeaders;
