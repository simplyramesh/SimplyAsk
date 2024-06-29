import { OBJECT_WILD_CARD_KEY } from '../../../../../../utils/helperFunctions';
import { modifyArrowedFiltersString } from '../../AssociationSet/AssociationSetTable';
import classes from '../../AssociationSet/AssociationSetTable.module.css';

export const uniqueId = OBJECT_WILD_CARD_KEY;

export const tableHeaderKeys = {
  SOURCES: 'Sources',

  TARGETS: 'Targets',
};

export const ASSOCIATION_SET_TABLE_KEYS = {
  SOURCES: 'sources',
  TARGETS: 'targets',
  SYSTEM_NAME: 'systemName',
  OBJECT_NAME: 'objectName',
  FIELD_NAME: 'fieldName',
  SYSTEM_ID: 'systemId',
  OBJECT_ID: 'objectId',
  FIELD_ID: 'fieldId',

};

const modifyArrayToArrowString = (val) => {
  const showLabel = false;

  return (
    <div className={classes.tableArrowTextRoot}>
      “
      {modifyArrowedFiltersString(
        val,
        ASSOCIATION_SET_TABLE_KEYS.SYSTEM_NAME,
        ASSOCIATION_SET_TABLE_KEYS.OBJECT_NAME,
        ASSOCIATION_SET_TABLE_KEYS.FIELD_NAME,
        showLabel,
      )}
      ”
    </div>
  );
};

const originalTableHeaders = [
  {
    name: tableHeaderKeys.SOURCES,
    source: ASSOCIATION_SET_TABLE_KEYS.SOURCES,
    formatter: modifyArrayToArrowString,
  },
  {
    name: tableHeaderKeys.TARGETS,
    source: ASSOCIATION_SET_TABLE_KEYS.TARGETS,
    formatter: modifyArrayToArrowString,
  },
];

export default originalTableHeaders;
