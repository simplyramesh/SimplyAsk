import { BAR_OR_LINE_GRAPH_TYPES } from '../../ConverseDashboard/utils/constants';

export const BOA_DASHBOARD_LOCAL_STORAGE_KEYS = {
  PROCESS_EXECUTIONS: {
    PROCESS_EXECUTION_PERFORMANCE: 'PROCESS_EXECUTION_PERFORMANCE',
    STEP_EXECUTION_PERFORMANCE: 'STEP_EXECUTION_PERFORMANCE',
  },
  FALLOUTS: {
    UNRESOLVED_FALLOUTS: 'UNRESOLVED_FALLOUTS_BY_STEP_OVER_TIME',
    AVERAGE_FALLOUT_AGE: 'AVERAGE_FALLOUT_AGE_IN_DAYS',
  },
};

export const CHART_TYPES = {
  BAR: BAR_OR_LINE_GRAPH_TYPES.BAR_GRAPH,
  LINE: BAR_OR_LINE_GRAPH_TYPES.LINE_GRAPH,
  LINE_AREA: 'LINE_AREA',
  STACKED_BAR: 'STACKED_BAR', // NOTE: May not be required
};

export const CHART_SETTING_KEYS = {
  TIMEFRAME: 'timeFrame',
  FREQUENCY: 'frequency',
  BAR_OR_LINE_GRAPH: 'barOrLineGraph',
  TIME_RANGE: 'timeRange',
  CHART_TYPE: 'chartType',
  // NOTE: In addition to filters, this will include 'Showing' dropdown where individual Processes can be selected instead of 'All Processes'
  APPLIED_FILTERS: 'appliedFilters',
};
