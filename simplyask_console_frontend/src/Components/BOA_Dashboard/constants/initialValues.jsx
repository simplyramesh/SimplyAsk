import { BOA_DASHBOARD_LOCAL_STORAGE_KEYS, CHART_SETTING_KEYS, CHART_TYPES } from './storage';

export const INITIAL_CHART_VALUES = {
  [BOA_DASHBOARD_LOCAL_STORAGE_KEYS.PROCESS_EXECUTIONS.PROCESS_EXECUTION_PERFORMANCE]: {
    [CHART_SETTING_KEYS.TIMEFRAME]: '',
    [CHART_SETTING_KEYS.FREQUENCY]: '',
    [CHART_SETTING_KEYS.BAR_OR_LINE_GRAPH]: CHART_TYPES.BAR,
    [CHART_SETTING_KEYS.APPLIED_FILTERS]: [],
    [CHART_SETTING_KEYS.CHART_TYPE]: CHART_TYPES.BAR,
  },
  [BOA_DASHBOARD_LOCAL_STORAGE_KEYS.PROCESS_EXECUTIONS.STEP_EXECUTION_PERFORMANCE]: {
    [CHART_SETTING_KEYS.TIMEFRAME]: '',
    [CHART_SETTING_KEYS.FREQUENCY]: '',
    [CHART_SETTING_KEYS.APPLIED_FILTERS]: [],
    [CHART_SETTING_KEYS.CHART_TYPE]: CHART_TYPES.BAR,
  },
  [BOA_DASHBOARD_LOCAL_STORAGE_KEYS.FALLOUTS.UNRESOLVED_FALLOUTS]: {
    [CHART_SETTING_KEYS.TIMEFRAME]: '',
    [CHART_SETTING_KEYS.FREQUENCY]: '',
    [CHART_SETTING_KEYS.APPLIED_FILTERS]: [],
    [CHART_SETTING_KEYS.CHART_TYPE]: CHART_TYPES.LINE_AREA,
  },
  [BOA_DASHBOARD_LOCAL_STORAGE_KEYS.FALLOUTS.AVERAGE_FALLOUT_AGE]: {
    [CHART_SETTING_KEYS.TIMEFRAME]: '',
    [CHART_SETTING_KEYS.FREQUENCY]: '',
    [CHART_SETTING_KEYS.APPLIED_FILTERS]: [],
    [CHART_SETTING_KEYS.CHART_TYPE]: CHART_TYPES.LINE,
  },
};
