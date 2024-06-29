import { OBJECT_WILD_CARD_KEY } from '../../../utils/helperFunctions';
import CatalogModuleTableIcon from '../../shared/REDISIGNED/icons/CustomTableIcons';
// import { appendHashtag } from "../../../utils/helperFunctions";
// import { fieldKeys } from "../../../utils/serviceRequests";
import classes from './CatalogModule.module.css';

export const uniqueId = 'id';

const getCMHeaders = (editButtonHandler) => [
  {
    name: 'Name',
    source: 'name',
    bold: true,
  },
  {
    name: 'Schema Location',
    source: 'schemaLocation',
  },
  {
    name: 'Type',
    source: 'type',
  },
  {
    name: 'Base Type',
    source: 'baseType',
  },
  {
    name: '',
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: (val) => (
      <div className={classes.editButton} onClick={() => editButtonHandler(val)}>
        <CatalogModuleTableIcon icon="EDIT" width={32} />
      </div>
    ),
  },
];

export default getCMHeaders;
