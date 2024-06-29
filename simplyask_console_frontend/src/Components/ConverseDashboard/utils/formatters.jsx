import { CHART_SIDE_FILTER_KEY, CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS, FREQUENCY_TYPE_VALUES } from './constants';
import { calculateFullDaysBetweenDates, getEnabledFrequencies } from './initialValuesHelpers';
import { getMonthDifference, groupDataByIncrement, mergeDataSets } from './timeUtil';

export const chartsConversationalSideFiltersFormatter = (values) => {
  const agents = values?.[CHART_SIDE_FILTER_KEY]?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]?.map(
    (agent) => agent.value
  );
  const agentTags = values?.[CHART_SIDE_FILTER_KEY]?.[
    CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS
  ]?.map((tag) => tag.value);

  return {
    ...(agents && { [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]: agents }),
    ...(agentTags && { [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]: agentTags }),
  };
};

export const chartsConversationalSideFiltersMeta = {
  key: CHART_SIDE_FILTER_KEY,
  formatter: {
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]: ({ v, k }) => ({
      label: 'Agents',
      value: v || '',
      k,
    }),
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]: ({ v, k }) => ({
      label: 'Agent Tags',
      value: v || '',
      k,
    }),
  },
};

export const chartsServiceTicketSideFiltersFormatter = (values) => {
  const showManuallyGeneratedTickets =
    values?.[CHART_SIDE_FILTER_KEY]?.[
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS
    ];

  const assignedAgents = values?.[CHART_SIDE_FILTER_KEY]?.[
    CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS
  ]?.map((agent) => agent.value);

  const processAllProcesses = values?.[CHART_SIDE_FILTER_KEY]?.[
    CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES
  ]?.map((process) => process.value);

  const processTags = values?.[CHART_SIDE_FILTER_KEY]?.[
    CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS
  ]?.map((tags) => tags.value);

  const allAgents = values?.[CHART_SIDE_FILTER_KEY]?.[
    CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS
  ]?.map((agent) => agent.value);

  const agentTags = values?.[CHART_SIDE_FILTER_KEY]?.[
    CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS
  ]?.map((tags) => tags.value);

  return {
    ...(assignedAgents && { [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]: assignedAgents }),
    ...(processAllProcesses && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]: processAllProcesses,
    }),
    ...(processTags && { [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]: processTags }),
    ...(allAgents && { [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]: allAgents }),
    ...(agentTags && { [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]: agentTags }),
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS]:
      showManuallyGeneratedTickets,
  };
};

export const chartsServiceTicketSideFiltersMeta = {
  key: CHART_SIDE_FILTER_KEY,
  formatter: {
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]: ({ v, k }) => ({
      label: 'Assigned Agents',
      value: v?.map((assignedAgent) => ({ label: assignedAgent.label, value: assignedAgent.value?.id })),
      k,
    }),
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]: ({ v, k }) => ({
      label: 'Processes',
      value: v || '',
      k,
    }),
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]: ({ v, k }) => ({
      label: 'Process Tags',
      value: v || '',
      k,
    }),
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]: ({ v, k }) => ({
      label: 'IVA Agents',
      value: v || '',
      k,
    }),
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]: ({ v, k }) => ({
      label: 'IVA Agent Tags',
      value: v || '',
      k,
    }),
  },
};

export const isSideFilterActive = (showFiltersType, keysArray = []) =>
  !!keysArray?.find((key) => showFiltersType?.sideFilters?.[key]);

export const onSubmitFiltersFormatter = (showFiltersType, selectedFilters, setFieldValue, keysArray = []) => {
  keysArray?.forEach((key) => {
    showFiltersType?.sideFilters?.[key] && setFieldValue(key, selectedFilters?.[key]);
  });
};

export const selectResponseData = ({ data, xDataKeys, filterTypes, filters, tooltipLabel }) => {
  if (!data) return [];
  const isDataArray = Array.isArray(data);
  const mergedData = !isDataArray ? mergeDataSets(data) : data;
  const dataKeys = filterTypes?.settings?.includes(
    CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE
  )
    ? [...xDataKeys, 'movingAverage']
    : xDataKeys;

  const start = filters?.timeFrame?.filterValue?.startTime;
  const end = filters?.timeFrame?.filterValue?.endTime;

  const groupedData = (increment) => {
    const dataIncrements = groupDataByIncrement(mergedData, dataKeys, increment, {
      channel: filters?.channels?.value ?? 'CHAT',
      start,
      end,
      tooltipLabel,
    });

    return dataIncrements;
  };

  const getEnabledFrequencyData = (startDate, endDate) => {
    const numOfDays = calculateFullDaysBetweenDates(startDate, endDate);
    const numOfMonths = getMonthDifference(startDate, endDate);
    const enabledFrequencies = getEnabledFrequencies(numOfDays, numOfMonths);

    return enabledFrequencies.reduce(
      (acc, frequency) => ({
        ...acc,
        [FREQUENCY_TYPE_VALUES[frequency]]: groupedData(FREQUENCY_TYPE_VALUES[frequency]),
      }),
      {}
    );
  };

  return {
    data: mergedData,
    ...(filters?.frequency && { ...getEnabledFrequencyData(start, end) }),
  };
};

export const addSpaceBetweenWords = (str) => str.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
