import { OBJECT_WILD_CARD_KEY } from '../../../../../utils/helperFunctions';
import classes from './FieldsTable.module.css';

export const uniqueId = OBJECT_WILD_CARD_KEY;

export const tableHeaderKeys = {
  FIELD_NAME: 'Field Name',
  FIELD_OBJECT: 'Field Object',
  FIELD_SYSTEM: 'Field System',
  ASSOCIATION_SETS: 'Has Association Sets',
};

export const FIELDS_TABLE_KEYS = {
  fieldId: 'fieldId',
  fieldName: 'fieldName',
  objectName: 'objectName',
  systemName: 'systemName',
  hasAssociationSet: 'hasAssociationSet',
  associatedSetCount: 'associatedSetCount',
};

export const getAssociationSetsNumber = (val) => {
  if (!val || !val[FIELDS_TABLE_KEYS.hasAssociationSet]) {
    return (
      <div className={classes.hasAssociationSetsBold}>
        Not Mapped
      </div>
    );
  }

  return (
    <div className={classes.hasAssociationSetsRoot}>
      <div className={classes.hasAssociationSetsBold}>
        Is Mapped
      </div>
      <div className={classes.hasAssociationSetsCount}>
        {val?.[FIELDS_TABLE_KEYS.associatedSetCount] ?? '0'}
        {' '}
        association sets
      </div>
    </div>
  );
};

const originalTableHeaders = () => [
  {
    name: tableHeaderKeys.FIELD_NAME,
    source: FIELDS_TABLE_KEYS.fieldName,
  },
  {
    name: tableHeaderKeys.FIELD_OBJECT,
    source: FIELDS_TABLE_KEYS.objectName,
    alignCenter: true,
  },
  {
    name: tableHeaderKeys.FIELD_SYSTEM,
    source: FIELDS_TABLE_KEYS.systemName,
    alignCenter: true,
  },
  {
    name: tableHeaderKeys.ASSOCIATION_SETS,
    source: OBJECT_WILD_CARD_KEY,
    formatter: getAssociationSetsNumber,
  },
];

export default originalTableHeaders;
