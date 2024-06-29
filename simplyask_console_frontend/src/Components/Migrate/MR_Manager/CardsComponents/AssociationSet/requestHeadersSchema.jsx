import Mr_Manager_sideWays_Polygon from '../../../../../Assets/icons/Mr_Manager_sideWays_Polygon.svg';
import processTriggerDeleteIcon from '../../../../../Assets/icons/processTriggerDeleteIcon.svg';
import { getDescriptiveDateFromDateString, OBJECT_WILD_CARD_KEY } from '../../../../../utils/helperFunctions';
import { modifyArrowedFiltersString } from './AssociationSetTable';
import classes from './AssociationSetTable.module.css';

export const uniqueId = OBJECT_WILD_CARD_KEY;

export const tableHeaderKeys = {
  SET_ID: 'Set ID',
  SOURCES: 'Sources',
  DATE_CREATED: 'Date Created',
  LAST_MODIFIED: 'Last Modified',
  ACTIONS: 'Actions',
  TARGETS: 'Targets',
};

export const ASSOCIATION_SET_TABLE_KEYS = {
  SET_ID: 'associationSetId',
  SOURCES: 'sources',
  TARGETS: 'targets',
  SYSTEM_NAME: 'systemName',
  OBJECT_NAME: 'objectName',
  FIELD_NAME: 'fieldName',
  SYSTEM_ID: 'systemId',
  OBJECT_ID: 'objectId',
  FIELD_ID: 'fieldId',
  CREATED_DATE: 'created',
  MODIFIED_DATE: 'modified',
};

const modifyTimeStamp = (val) => {
  if (!val) return <p>---</p>;

  return (
    <div className={classes.flex_col}>
      <p className={classes.no_wrap}>{getDescriptiveDateFromDateString(val)}</p>
    </div>
  );
};

const modifyArrayToArrowString = (val) => {
  const showLabel = false;
  const FIRST_VALUE_INDEX = 0;
  const FIRST_INDEX_LENGTH = 1;

  if (val?.length > 1) {
    return (
      <div className={classes.tableArrowRoot}>
        <div className={classes.tableArrowTextRoot}>
          “
          {modifyArrowedFiltersString(
            val?.[FIRST_VALUE_INDEX],
            ASSOCIATION_SET_TABLE_KEYS.SYSTEM_NAME,
            ASSOCIATION_SET_TABLE_KEYS.OBJECT_NAME,
            ASSOCIATION_SET_TABLE_KEYS.FIELD_NAME,
            showLabel
          )}
          ”
        </div>
        <div className={classes.boldPlusTitle}>
          + {val.length - FIRST_INDEX_LENGTH} more
          <div className={classes.absoluteDivForTable}>
            <div className={classes.paddingTableAbsolute}>
              <ul className={classes.tableArrowTextRootNoBold}>
                {val?.map((item, index) => {
                  if (index === FIRST_VALUE_INDEX) return <></>;

                  return (
                    <li className={classes.tableArrowText} key={index}>
                      “
                      {modifyArrowedFiltersString(
                        item,
                        ASSOCIATION_SET_TABLE_KEYS.SYSTEM_NAME,
                        ASSOCIATION_SET_TABLE_KEYS.OBJECT_NAME,
                        ASSOCIATION_SET_TABLE_KEYS.FIELD_NAME,
                        showLabel
                      )}
                      ”
                    </li>
                  );
                })}
              </ul>
            </div>
            <img src={Mr_Manager_sideWays_Polygon} alt="" className={classes.sideWaysPolygon} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={classes.tableArrowTextRoot}>
      “
      {modifyArrowedFiltersString(
        val?.[FIRST_VALUE_INDEX],
        ASSOCIATION_SET_TABLE_KEYS.SYSTEM_NAME,
        ASSOCIATION_SET_TABLE_KEYS.OBJECT_NAME,
        ASSOCIATION_SET_TABLE_KEYS.FIELD_NAME,
        showLabel
      )}
      ”
    </div>
  );
};

const originalTableHeaders = (iconClickFunction = () => {}) => [
  {
    name: tableHeaderKeys.SET_ID,
    source: ASSOCIATION_SET_TABLE_KEYS.SET_ID,
  },
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
  {
    name: tableHeaderKeys.DATE_CREATED,
    source: ASSOCIATION_SET_TABLE_KEYS.CREATED_DATE,
    formatter: modifyTimeStamp,
    alignCenter: true,
  },
  {
    name: tableHeaderKeys.LAST_MODIFIED,
    source: ASSOCIATION_SET_TABLE_KEYS.MODIFIED_DATE,
    formatter: modifyTimeStamp,
    alignCenter: true,
  },

  {
    name: tableHeaderKeys.ACTIONS,
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: (val) => {
      return (
        <div className={classes.tableIconHover} onClick={(e) => iconClickFunction(e, val)}>
          <img src={processTriggerDeleteIcon} alt="" className={classes.downloadIconTable} />
        </div>
      );
    },
  },
];

export default originalTableHeaders;
