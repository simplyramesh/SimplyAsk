import PropTypes from 'prop-types';

import MR_Manager_Cancel_Icon from '../../../../../../Assets/icons/MR_Manager_Cancel_Icon.svg';
import MR_Manager_Execution_Play_Icon from '../../../../../../Assets/icons/MR_Manager_Execution_Play_Icon.svg';
import MR_Manager_Pause_Icon from '../../../../../../Assets/icons/MR_Manager_Pause_Icon.svg';
import ProcessManagerBlackPolygon from '../../../../../../Assets/icons/ProcessManagerBlackPolygon.svg';
import { OBJECT_WILD_CARD_KEY } from '../../../../../../utils/helperFunctions';
import classes from './CurrentExecutionsTable.module.css';

export const uniqueId = OBJECT_WILD_CARD_KEY;

export const tableHeaderKeys = {
  EXECUTION_ID: 'Execution ID',
  STATUS: 'Status',
  ACTIONS: 'Actions',
};

export const CURRENT_EXECUTION_TABLE_KEYS = {
  id: 'id',
  executionStatus: 'executionStatus',
};

const DisplayHoverComponentName = ({ name, textPositionClass, polygonClass }) => {
  return (
    <div className={classes.display_hover_comp_root}>
      <div
        className={`${classes.display_hover_comp}
      ${classes.hover_text_absolute}
      ${textPositionClass}`}
      >
        {name}
      </div>
      <img className={`${classes.polygon_absolute} ${polygonClass}`} src={ProcessManagerBlackPolygon} alt="" />
    </div>
  );
};

const originalTableHeaders = (
  playIconClickFunction = () => {},
  pauseIconClickFunction = () => {},
  cancelIconClickFunction = () => {}
) => [
  {
    name: tableHeaderKeys.EXECUTION_ID,
    source: CURRENT_EXECUTION_TABLE_KEYS.id,
    bold: true,
  },
  {
    name: tableHeaderKeys.STATUS,
    source: CURRENT_EXECUTION_TABLE_KEYS.executionStatus,
    alignCenter: true,
  },
  {
    name: tableHeaderKeys.ACTIONS,
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: (val) => {
      return (
        <div className={classes.tableIconsRoot}>
          {val ? (
            <div className={classes.playIconHover} onClick={(e) => playIconClickFunction(e, val)}>
              <DisplayHoverComponentName name="Resume Execution" polygonClass={classes.playButtonPolygonClass} />
              <img src={MR_Manager_Execution_Play_Icon} alt="" className={classes.playIcon} />
            </div>
          ) : (
            <div className={classes.pauseIconHover} onClick={(e) => pauseIconClickFunction(e, val)}>
              <DisplayHoverComponentName name="Pause Execution" textPositionClass={classes.pauseIconPositioning} />
              <img src={MR_Manager_Pause_Icon} alt="" className={classes.actionIconTable} />
            </div>
          )}

          <div className={classes.cancelIconHover} onClick={(e) => cancelIconClickFunction(e, val)}>
            <DisplayHoverComponentName name="Cancel Execution" textPositionClass={classes.cancelIconPositioning} />
            <img src={MR_Manager_Cancel_Icon} alt="" className={classes.actionIconTable} />
          </div>
        </div>
      );
    },
  },
];

export default originalTableHeaders;

DisplayHoverComponentName.propTypes = {
  name: PropTypes.string,
  textPositionClass: PropTypes.string,
  polygonClass: PropTypes.string,
};
