import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'simplexiar_react_components';

import colors from '../../config/colors';
import { navLinkTitles } from '../../config/routes';
import { getExecutionStats } from '../../Services/axios/boaDashboardReports';
import Spinner from '../shared/Spinner/Spinner';

import classes from './BoaDashboard.module.css';
import ExecutionStats from './Stats/ExecutionStats';
import FalloutStats from './Stats/FalloutStats';

const STATS_KEYS = {
  TOTAL: 'TOTAL',
  total: 'total',
  AVERAGE: 'AVERAGE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  success: 'success',
  resolved: 'resolved',
  failed: 'failed',
  executing: 'executing',
};

export const filterDecimalString = (text) => {
  if (!text) return '0';

  return `${Math.round(text)}`;
};

const BoaDashboard = () => {
  const location = useLocation();

  // NOTE: This is commented out because new BOA Dashboard has not been implemented yet
  // const { PROCESS_EXECUTIONS, FALLOUTS } = BOA_DASHBOARD_LOCAL_STORAGE_KEYS;

  // const [executionPerformance, setExecutionPerformance] = useLocalStorage(
  //   PROCESS_EXECUTIONS.PROCESS_EXECUTION_PERFORMANCE,
  //   INITIAL_CHART_VALUES[PROCESS_EXECUTIONS.PROCESS_EXECUTION_PERFORMANCE]
  // );
  // const [stepExecution, setStepExecution] = useLocalStorage(
  //   PROCESS_EXECUTIONS.STEP_EXECUTION_PERFORMANCE,
  //   INITIAL_CHART_VALUES[PROCESS_EXECUTIONS.STEP_EXECUTION_PERFORMANCE]
  // );
  // const [unresolvedFallouts, setUnresolvedFallouts] = useLocalStorage(
  //   FALLOUTS.UNRESOLVED_FALLOUTS,
  //   INITIAL_CHART_VALUES[FALLOUTS.UNRESOLVED_FALLOUTS]
  // );
  // const [avgFalloutAge, setAvgFalloutAge] = useLocalStorage(
  //   FALLOUTS.AVERAGE_FALLOUT_AGE,
  //   INITIAL_CHART_VALUES[FALLOUTS.AVERAGE_FALLOUT_AGE]
  // );

  const [processName, setProcessName] = useState();
  const {
    data,
    isLoading: isLoadingExecutionStats,
    error: errorExecutionStats,
  } = useQuery({
    queryKey: ['boaDashboardExecutionStats', processName],
    queryFn: getExecutionStats,
    enabled: !!processName,
  });

  useEffect(() => {
    if (location.pathname) {
      const getProcessName = location.pathname.split('/');
      if (getProcessName?.[getProcessName.length - 1] !== navLinkTitles.BOA_DASHBOARD_LOWER_CASE_TITLE) {
        setProcessName(getProcessName?.[getProcessName.length - 1]);
      } else setProcessName('');
    }
  }, [location.pathname]);

  if (isLoadingExecutionStats) return <Spinner global />;

  if (errorExecutionStats) return <p>Something went wrong...</p>;

  return (
    <div className={classes.root_parent}>
      <div className={classes.root}>
        <Card className={classes.executionCard}>
          <p className={classes.cardHeader} style={{ backgroundColor: colors.charcoal, color: colors.lighterColor }}>
            Executions
          </p>
          <ExecutionStats processName={processName} data={data} STATS_KEYS={STATS_KEYS} />
        </Card>
        <div
          className={classes.second_column_analytics}
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <Card className={classes.transactionCard}>
            <p className={classes.cardHeader} style={{ backgroundColor: colors.charcoal, color: colors.lighterColor }}>
              Fallouts
            </p>
            <FalloutStats processName={processName} data={data} STATS_KEYS={STATS_KEYS} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoaDashboard;
