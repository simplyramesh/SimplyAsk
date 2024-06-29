import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'simplexiar_react_components';

import colors from '../../../config/colors';
import routes from '../../../config/routes';
import { filterDecimalString } from '../BoaDashboard';
import classes from './Stats.module.css';

const PROCESS_HISTORY_KEYS = [
  { value: 'SUCCESS', label: 'Success' },
  { value: 'EXECUTING', label: 'Executing' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'RESOLVED', label: 'Resolved' },
];

const ExecutionStats = ({ processName, data, STATS_KEYS }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <div className={classes.itemRow}>
        <Card
          className={classes.item}
          style={{ backgroundColor: colors.lighterColor, flexGrow: '3' }}
          onClick={() => navigate(`${routes.PROCESS_HISTORY}`, {
            state: {
              processName,
            },
          })}
        >
          <div className={classes.executionRow}>
            <div className={classes.cardHeader}>Total Executions</div>
            <div style={{ fontSize: '40px' }} className={classes.cardData}>
              {filterDecimalString(data?.[STATS_KEYS.TOTAL]?.[STATS_KEYS.total]) ?? '0'}
            </div>
          </div>
        </Card>
      </div>

      <div className={classes.itemRow}>
        <Card
          className={classes.item}
          style={{ backgroundColor: colors.lighterColor }}
          onClick={() => navigate(`${routes.PROCESS_HISTORY}`, {
            state: {
              processHistoryApplyFilter: PROCESS_HISTORY_KEYS[0],
              processName,
            },
          })}
        >
          <div className={classes.itemColumn}>
            <div className={classes.cardHeader}>Success</div>
            <div className={classes.cardData}>
              {filterDecimalString(data?.[STATS_KEYS.TOTAL]?.[STATS_KEYS.success]) ?? '0' }
            </div>
          </div>
        </Card>

        <Card
          className={classes.item}
          style={{ backgroundColor: colors.lighterColor }}
          onClick={() => navigate(`${routes.PROCESS_HISTORY}`, {
            state: {
              processHistoryApplyFilter: PROCESS_HISTORY_KEYS[1],
              processName,
            },
          })}
        >
          <div className={classes.itemColumn}>
            <div className={classes.cardHeader}>Executing</div>
            <div className={classes.cardData}>
              {filterDecimalString(data?.[STATS_KEYS.TOTAL]?.[STATS_KEYS.executing]) ?? '0' }
            </div>
          </div>
        </Card>

        <Card
          className={classes.item}
          style={{ backgroundColor: colors.lighterColor }}
          onClick={() => navigate(`${routes.PROCESS_HISTORY}`, {
            state: {
              processHistoryApplyFilter: PROCESS_HISTORY_KEYS[2],
              processName,
            },
          })}
        >
          <div className={classes.itemColumn}>
            <div className={classes.cardHeader}>Failed</div>
            <div className={classes.cardData}>
              {filterDecimalString(data?.[STATS_KEYS.TOTAL]?.[STATS_KEYS.failed]) ?? '0' }
            </div>
          </div>
        </Card>
      </div>
      <div className={classes.itemRow}>
        <Card
          className={`${classes.item}`}
          style={{ backgroundColor: colors.lighterColor }}
          onClick={() => navigate(`${routes.PROCESS_HISTORY}`, {
            state: {
              processName,
            },
          })}
        >
          <div className={classes.itemColumn}>
            <div className={classes.cardHeader}>Daily Avg</div>
            <div className={classes.cardData}>
              {filterDecimalString(data?.[STATS_KEYS.AVERAGE]?.[STATS_KEYS.DAILY]?.[STATS_KEYS.total]) ?? '0'}
            </div>
            {/* <Trend data={DailyTrend} className={classes.cardData} /> */}
          </div>
        </Card>

        <Card
          className={`${classes.item}`}
          style={{ backgroundColor: colors.lighterColor }}
          onClick={() => navigate(`${routes.PROCESS_HISTORY}`, {
            state: {
              processName,
            },
          })}
        >
          <div className={classes.itemColumn}>
            <div className={classes.cardHeader}>Weekly Avg</div>
            <div className={classes.cardData}>
              {filterDecimalString(data?.[STATS_KEYS.AVERAGE]?.[STATS_KEYS.WEEKLY]?.[STATS_KEYS.total]) ?? '0'}

            </div>
            {/* <Trend data={WeeklyTrend} className={classes.cardData} /> */}
          </div>
        </Card>

        <Card
          className={`${classes.item}`}
          style={{ backgroundColor: colors.lighterColor }}
          onClick={() => navigate(`${routes.PROCESS_HISTORY}`, {
            state: {
              processName,
            },
          })}
        >
          <div className={classes.itemColumn}>
            <div className={classes.cardHeader}>Monthly Avg</div>
            <div className={classes.cardData}>
              {filterDecimalString(data?.[STATS_KEYS.AVERAGE]?.[STATS_KEYS.MONTHLY]?.[STATS_KEYS.total]) ?? '0'}

            </div>
            {/* <Trend data={MonthlyTrend} /> */}
          </div>
        </Card>
      </div>
    </div>

  );
};

export default ExecutionStats;

ExecutionStats.propTypes = {
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
    // TODO: currently MONTHLY objects has shape of:
    // {
    //   APRIL: {
    //     failed: PropTypes.number,
    //   success: PropTypes.number,
    //     total: PropTypes.number,
    //   },
    //   MAY: {
    //     failed: PropTypes.number,
    //   success: PropTypes.number,
    //     total: PropTypes.number,
    //   }
    //   ,
    // },
    // update propType to shape if all months can be included.
    MONTHLY: PropTypes.object,
    TOTAL: PropTypes.shape({
      failed: PropTypes.number,
      success: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};
