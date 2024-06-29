import {
  differenceInHours,
  endOfDay,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns';

import {
  BAR_OR_LINE_GRAPH_TYPES,
  CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS,
  FREQUENCY_TYPES,
  FREQUENCY_TYPE_VALUES,
  NUMBER_OR_PERCENTAGE_GRAPH_TYPES,
  TIME_RANGE_TYPES,
} from './constants';
import { CALENDAR_FILTER_LABEL_FORMAT, ISO_END_DAY_FORMAT, ISO_START_DAY_FORMAT, getMonthDifference } from './timeUtil';

// TODO FIX VALUES
export const FREQUENCY_FILTER_OPTIONS = [
  { label: FREQUENCY_TYPES.ONE_MINUTE, value: FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.ONE_MINUTE] },
  { label: FREQUENCY_TYPES.THIRTY_MINUTE, value: FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.THIRTY_MINUTE] },
  { label: FREQUENCY_TYPES.HOURLY, value: FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.HOURLY] },
  { label: FREQUENCY_TYPES.DAILY, value: FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.DAILY] },
  { label: FREQUENCY_TYPES.MONTHLY, value: FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.MONTHLY] },
  { label: FREQUENCY_TYPES.YEARLY, value: FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.YEARLY] },
];

export const TIME_RANGE_PRESENT_DAYS_OPTIONS = [
  { label: 'Today', value: TIME_RANGE_TYPES.TODAY },
  { label: 'This Week', value: TIME_RANGE_TYPES.THIS_WEEK },
  { label: 'This Month', value: TIME_RANGE_TYPES.THIS_MONTH },
  { label: 'This Year', value: TIME_RANGE_TYPES.THIS_YEAR },
  { label: 'Custom', value: TIME_RANGE_TYPES.CUSTOM },
];

export const TIME_RANGE_PAST_DAYS_OPTIONS = [
  { label: 'Today', value: TIME_RANGE_TYPES.TODAY },
  { label: 'Last 7 Days', value: TIME_RANGE_TYPES.LAST7DAYS },
  { label: 'Last 30 Days', value: TIME_RANGE_TYPES.LAST30DAYS },
  { label: 'Last 90 Days', value: TIME_RANGE_TYPES.LAST90DAYS },
  { label: 'Last 365 Days', value: TIME_RANGE_TYPES.LAST365DAYS },
  { label: 'All Days', value: TIME_RANGE_TYPES.ALLDAYS },
  { label: 'Custom', value: TIME_RANGE_TYPES.CUSTOM },
];

export const ALL_CHANNELS_OPTIONS = [
  {
    label: 'Chat',
    value: 'CHAT',
  },
  {
    label: 'Phone',
    value: 'VOICE',
  },
];

export const calculateFullDaysBetweenDates = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = startOfDay(parseISO(startDate));
  const end = endOfDay(parseISO(endDate));

  const numOfHours = differenceInHours(end, start);

  return Math.ceil(numOfHours / 24);
};

export const getTodayEndDateInISO = () => format(endOfDay(new Date()), ISO_END_DAY_FORMAT);

export const getDefaultTimeFrame = (timeRange) => {
  let startTime;

  switch (timeRange) {
    case TIME_RANGE_TYPES.THIS_WEEK:
      startTime = format(startOfWeek(new Date()), ISO_START_DAY_FORMAT);
      break;

    case TIME_RANGE_TYPES.THIS_MONTH:
      startTime = format(startOfMonth(new Date()), ISO_START_DAY_FORMAT);
      break;

    case TIME_RANGE_TYPES.THIS_YEAR:
      startTime = format(startOfYear(new Date()), ISO_START_DAY_FORMAT);
      break;

    case TIME_RANGE_TYPES.TODAY:
      startTime = format(startOfDay(new Date()), ISO_START_DAY_FORMAT);
      break;

    case TIME_RANGE_TYPES.LAST7DAYS:
      startTime = format(subDays(new Date(), 7), ISO_START_DAY_FORMAT);
      break;

    case TIME_RANGE_TYPES.LAST30DAYS:
      startTime = format(subDays(new Date(), 30), ISO_START_DAY_FORMAT);
      break;

    case TIME_RANGE_TYPES.LAST90DAYS:
      startTime = format(subDays(new Date(), 90), ISO_START_DAY_FORMAT);
      break;

    case TIME_RANGE_TYPES.LAST365DAYS:
      startTime = format(subDays(new Date(), 365), ISO_START_DAY_FORMAT);
      break;

    case TIME_RANGE_TYPES.ALLDAYS:
      startTime = format(new Date('2020-01-02'), ISO_START_DAY_FORMAT);
      break;

    default:
      return '';
  }

  const endTime = getTodayEndDateInISO();

  return {
    label:
      timeRange === TIME_RANGE_TYPES.TODAY
        ? format(new Date(startTime), CALENDAR_FILTER_LABEL_FORMAT)
        : `${format(new Date(startTime), CALENDAR_FILTER_LABEL_FORMAT)} - ${format(new Date(endTime), CALENDAR_FILTER_LABEL_FORMAT)}`,
    value: [startTime, endTime],
    filterValue: {
      endTime,
      startTime,
    },
  };
};

export const getEnabledFrequencies = (numOfDays, numOfMonths) => {
  switch (true) {
    case numOfMonths >= 12:
      return [FREQUENCY_TYPES.MONTHLY];
    case numOfMonths >= 1:
      return [FREQUENCY_TYPES.DAILY, FREQUENCY_TYPES.MONTHLY];
    case numOfDays > 10 && numOfMonths < 1:
      return [FREQUENCY_TYPES.DAILY];
    case numOfDays >= 6:
      return [FREQUENCY_TYPES.HOURLY, FREQUENCY_TYPES.DAILY];
    case numOfDays >= 2:
      return [FREQUENCY_TYPES.THIRTY_MINUTE, FREQUENCY_TYPES.HOURLY];
    default:
      return [FREQUENCY_TYPES.ONE_MINUTE, FREQUENCY_TYPES.THIRTY_MINUTE, FREQUENCY_TYPES.HOURLY];
  }
};

export const getDefaultFrequencyOptions = (startDate, endDate) => {
  const numOfDays = calculateFullDaysBetweenDates(startDate, endDate);
  const numOfMonths = getMonthDifference(startDate, endDate);
  const enabledFrequencies = getEnabledFrequencies(numOfDays, numOfMonths);

  const disableAllOpt = FREQUENCY_FILTER_OPTIONS?.map((opt) => ({ ...opt, disabled: true }));

  return disableAllOpt?.map((opt) => ({
    ...opt,
    disabled: !enabledFrequencies.includes(opt.label),
  }));
};

const determineFrequencyType = (numOfDays, numOfMonths) => {
  if (numOfDays <= 1) return FREQUENCY_TYPES.ONE_MINUTE;
  if (numOfDays > 1 && numOfDays < 6 && numOfMonths < 1) return FREQUENCY_TYPES.THIRTY_MINUTE;
  if (numOfDays >= 6 && numOfDays <= 10 && numOfMonths < 1) return FREQUENCY_TYPES.HOURLY;
  if (numOfDays > 10 && numOfMonths < 1) return FREQUENCY_TYPES.DAILY;

  return FREQUENCY_TYPES.MONTHLY;
};

export const getDefaultFrequencyVal = (startDate, endDate) => {
  if (!startDate || !endDate) return '';

  const numOfDays = calculateFullDaysBetweenDates(startDate, endDate);
  const numOfMonths = getMonthDifference(startDate, endDate);
  const frequencyType = determineFrequencyType(numOfDays, numOfMonths);

  return FREQUENCY_FILTER_OPTIONS.find((item) => item.label === frequencyType);
};

export const getShowFiltersType = (filterTypes) => ({
  main: {
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME]:
    filterTypes?.main?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY]:
    filterTypes?.main?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY),
  },
  settings: {
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH]:
    filterTypes?.settings?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH]:
    filterTypes?.settings?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_1]:
      filterTypes?.settings?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_1),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_2]:
      filterTypes?.settings?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_2),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE]:
    filterTypes?.settings?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS]:
    filterTypes?.settings?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS),
  },
  sideFilters: {
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]:
    filterTypes?.sideFilters?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]:
    filterTypes?.sideFilters?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]:
     filterTypes?.sideFilters?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]:
     filterTypes?.sideFilters?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]:
    filterTypes?.sideFilters?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]:
     filterTypes?.sideFilters?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]:
     filterTypes?.sideFilters?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS),

    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS]:
    filterTypes?.sideFilters?.includes(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS),
  },
});

export const getConversationalAppliedFiltersData = (showFiltersType, values) => ({
  ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]
    && !!values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]?.value?.length
     && { [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]: values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS] }),

  ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]
    && !!values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]?.value?.length
      && {
        [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]:
        values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS],
      }),
});

export const getServiceTicketAppliedFiltersData = (showFiltersType, values) => ({
  ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]
    && !!values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]?.value?.length
     && {
       [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]:
       values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS],
     }),

  ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]
    && !!values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]?.value?.length
      && {
        [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]:
         values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES],
      }),

  ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]
    && !!values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]?.value?.length
      && {
        [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]:
         values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS],
      }),

  ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]
    && !!values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]?.value?.length
      && {
        [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]:
         values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS],
      }),

  ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]
    && !!values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]?.value?.length
      && {
        [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]:
         values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS],
      }),
});

export const getDefaultServiceTicketSideFilterSwitchesVal = (showFiltersType) => ({
  ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS]
    && { [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS]: false }),
});

export const getFormikFiltersInitialValues = (showFiltersType, defaultFilters, timeRangeTab) => {
  const timeFrame = getDefaultTimeFrame(timeRangeTab?.value);
  const startDate = timeFrame?.filterValue?.startTime;
  const endDate = timeFrame?.filterValue?.endTime;

  return ({
    timeRange: timeRangeTab,
    // main
    ...(showFiltersType?.main?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME]
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME]: timeRangeTab?.value === TIME_RANGE_TYPES.CUSTOM
        ? defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME] : timeFrame,
    }),

    ...(showFiltersType?.main?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY]
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY]: getDefaultFrequencyVal(startDate, endDate),
    }),

    // settings
    ...(showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS]
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS]: (
        defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS] ?? ALL_CHANNELS_OPTIONS.find((item) => item.value === 'CHAT')
      ),
    }),

    ...((showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_1] || showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_2])
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL]: (
        defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL] ?? true
      ),
    }),

    ...(showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE]
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE]:
       (defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE] ?? true),
    }),

    ...(showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH]
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH]:
       (defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH] ?? BAR_OR_LINE_GRAPH_TYPES.BAR_GRAPH),
    }),

    ...(showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH]
     && {
       [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH]:
       (defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH] ?? NUMBER_OR_PERCENTAGE_GRAPH_TYPES.NUMBER),
     }),

    // Sidebar
    ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]
      && {
        [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]: (
          defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS] ?? null
        ),
      }),

    ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]
        && {
          [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]: (
            defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS] ?? null
          ),
        }),

    ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]
        && {
          [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]: (
            defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS] ?? null
          ),
        }),

    ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]
        && {
          [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]: (
            defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS] ?? null
          ),
        }),

    ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]
        && {
          [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]: (
            defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS] ?? null
          ),
        }),

    ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]
      && {
        [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]: (
          defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES] ?? null
        ),
      }),

    ...(showFiltersType?.sideFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]
      && {
        [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]: (
          defaultFilters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS] ?? null
        ),
      }),

    // Sidebar switch
    ...getDefaultServiceTicketSideFilterSwitchesVal(showFiltersType),
  });
};

export const getInitialLocalStorageValuesForUseFilter = (values, showFiltersType) => ({
  ...(showFiltersType
    && {
      ...getDefaultServiceTicketSideFilterSwitchesVal(showFiltersType),
    }),

  ...(values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]?.value
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]:
        values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS]?.value,
    }),

  ...(values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]?.value
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]:
        values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS]?.value,
    }),

  ...(values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]?.value
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]:
        values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS]?.value,
    }),

  ...(values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]?.value
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]:
        values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS]?.value,
    }),

  ...(values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]?.value
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]:
        values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS]?.value,
    }),

  ...(values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]?.value
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]:
        values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES]?.value,
    }),

  ...(values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]?.value
    && {
      [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]:
        values?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS]?.value,
    }),
});
