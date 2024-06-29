import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'simplexiar_react_components';

import colors from '../../../config/colors';
import routes from '../../../config/routes';
import { filterDecimalString } from '../BoaDashboard';
import classes from './Stats.module.css';

const FalloutStats = ({ processName, data, STATS_KEYS }) => {
  const navigate = useNavigate();

  const calculateUnresolvedStats = () => {
    const failed = data?.[STATS_KEYS.TOTAL]?.[STATS_KEYS.failed] ?? 0;

    return filterDecimalString(failed);
  };

  return (
    <div className={classes.containerRow}>
      <Card
        className={classes.itemFallout}
        style={{ backgroundColor: colors.lighterColor, width: '100%' }}
        onClick={() => navigate(`${routes.FALLOUT_TICKETS}`, {
          state: {
            resolvedFilter: true,
            processName,
          },
        })}
      >
        <div className={classes.itemColumn}>
          <div className={classes.cardHeader}>Resolved</div>
          <div className={classes.cardData}>{filterDecimalString(data?.[STATS_KEYS.TOTAL]?.[STATS_KEYS.resolved]) ?? '---' }</div>
        </div>
      </Card>

      <Card
        className={classes.itemFallout}
        style={{ backgroundColor: colors.lighterColor, width: '100%' }}
        onClick={() => navigate(`${routes.FALLOUT_TICKETS}`, {
          state: {
            unResolvedFilter: true,
            processName,
          },
        })}
      >
        <div className={classes.itemColumn}>
          <div className={classes.cardHeader}>Unresolved</div>
          <div className={classes.cardData}>{calculateUnresolvedStats() ?? '---' }</div>
        </div>
      </Card>
    </div>
  );
};

export default FalloutStats;

FalloutStats.propTypes = {
  processName: PropTypes.string,
  STATS_KEYS: PropTypes.shape({
    AVERAGE: PropTypes.string,
    DAILY: PropTypes.string,
    MONTHLY: PropTypes.string,
    TOTAL: PropTypes.string,
    WEEKLY: PropTypes.string,
    executing: PropTypes.string,
    failed: PropTypes.string,
    resolved: PropTypes.string,
    success: PropTypes.string,
    total: PropTypes.string,
  }),
  data: PropTypes.shape({
    AVERAGE: PropTypes.shape({
      DAILY: PropTypes.shape({
        failed: PropTypes.number,
        success: PropTypes.number,
        total: PropTypes.number,
      }),
      // TODO: DURATION: PropTypes. (currently null)
      MONTHLY: PropTypes.shape({
        failed: PropTypes.number,
        success: PropTypes.number,
        total: PropTypes.number,
      }),
      WEEKLY: PropTypes.shape({
        failed: PropTypes.number,
        success: PropTypes.number,
        total: PropTypes.number,
      }),
    }),
    // TODO: currently MONTHLY objects has shape of: { APRIL: { ... }, MAY: { ... } }, update to shape if all months can be included. See ExecutionStats.js comments in propTypes for full shape.
    MONTHLY: PropTypes.object,
    TOTAL: PropTypes.shape({
      failed: PropTypes.number,
      success: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};
