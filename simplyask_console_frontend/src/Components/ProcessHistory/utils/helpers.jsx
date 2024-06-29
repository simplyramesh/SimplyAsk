import { intervalToDuration } from 'date-fns';
import { selectDropdownOption } from '../../Issues/components/FalloutTickets/utils/helpers';
import { PROCESS_EXECUTION_FILTERS, PROCESS_HISTORY_FILTER_KEY } from '../constants/core';

export const convertRequestDataStrToJson = (str) => {
  if (!str) return {};

  const keyValuePairs = str
    .slice(1, -1)
    .split(', ')
    .map((pair) => pair.split('='));

  const obj = keyValuePairs.reduce((acc, [key, value]) => {
    if (value === 'null') return { ...acc, [key]: null };
    if (value === '{}') return { ...acc, [key]: {} };
    return { ...acc, [key]: value };
  }, {});

  return obj;
};

export const formatDurationFromSeconds = (totalMilliSeconds) => {
  const totalSeconds = Math.ceil(totalMilliSeconds / 1000) || 0;

  if (totalSeconds === 0) return `${totalSeconds}s`;

  const startDate = new Date(0);
  const endDate = new Date(totalSeconds * 1000);
  const duration = intervalToDuration({ start: startDate, end: endDate });

  const resultParts = [];

  if (duration.months) resultParts.push(`${duration.months}mo `);
  if (duration.days) resultParts.push(`${duration.days}d `);
  if (duration.hours) resultParts.push(`${duration.hours}h `);
  if (duration.minutes) resultParts.push(`${duration.minutes}m `);
  if (duration.seconds) resultParts.push(`${duration.seconds}s`);

  return resultParts.join('').trim();
};

export const configuredExecutionFilterOptions = (processes) =>
  processes?.reduce(
    (acc, curr) => {
      const env = [];
      const triggerMethod = [];

      if (
        curr?.[PROCESS_EXECUTION_FILTERS.ENVIRONMENT] &&
        !acc[PROCESS_EXECUTION_FILTERS.ENVIRONMENTS].find(
          (e) => e.value === curr?.[PROCESS_EXECUTION_FILTERS.ENVIRONMENT]
        )
      ) {
        env.push({
          label: curr?.[PROCESS_EXECUTION_FILTERS.ENVIRONMENT],
          value: curr?.[PROCESS_EXECUTION_FILTERS.ENVIRONMENT],
        });
      }

      if (
        curr?.businessKey.source &&
        !acc[PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS].find((a) => a.value === curr?.businessKey.source)
      ) {
        triggerMethod.push({ label: curr?.businessKey.source, value: curr?.businessKey.source });
      }

      return {
        ...acc,
        [PROCESS_EXECUTION_FILTERS.ENVIRONMENTS]: [...acc[PROCESS_EXECUTION_FILTERS.ENVIRONMENTS], ...env],
        [PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS]: [
          ...acc[[PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS]],
          ...triggerMethod,
        ],
      };
    },
    {
      [PROCESS_EXECUTION_FILTERS.ENVIRONMENTS]: [],
      [PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS]: [],
    }
  );

export const selectedIndividualProcessExecutionFiltersMeta = {
  key: PROCESS_HISTORY_FILTER_KEY,
  formatter: {
    [PROCESS_EXECUTION_FILTERS.STATUS]: ({ v, k }) => ({
      label: 'Status',
      value: v.map((item) => item.label) || '',
      k,
    }),
    [PROCESS_EXECUTION_FILTERS.ENVIRONMENTS]: ({ v, k }) => ({
      label: 'Environment',
      value: v.map((item) => item.label) || '',
      k,
    }),
    [PROCESS_EXECUTION_FILTERS.START_TIME]: ({ v, k }) => ({
      label: 'Start Date',
      value: v?.label || '',
      k,
    }),
    [PROCESS_EXECUTION_FILTERS.END_TIME]: ({ v, k }) => ({
      label: 'End Date',
      value: v?.label || '',
      k,
    }),
    [PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS]: ({ v, k }) => ({
      label: 'Trigger Method',
      value: v.map((item) => item.label) || '',
      k,
    }),
    [PROCESS_EXECUTION_FILTERS.TRIGGER_BY]: ({ v, k }) => ({
      label: 'Triggered By',
      value: v.map((item) => item.label) || '',
      k,
    }),
  },
};

export const individualProcessExecutionsFormatter = (values) => {
  const sideFilter = values[PROCESS_HISTORY_FILTER_KEY];

  return {
    status: selectDropdownOption(sideFilter[PROCESS_EXECUTION_FILTERS.STATUS], 'value') || '',
    environments: selectDropdownOption(sideFilter[PROCESS_EXECUTION_FILTERS.ENVIRONMENTS], 'value') || '',
    triggerMethods: selectDropdownOption(sideFilter[PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS], 'value') || '',
    triggerBy: selectDropdownOption(sideFilter[PROCESS_EXECUTION_FILTERS.TRIGGER_BY], 'value.id') || '',
    timezone: values.timezone || '',
    ...sideFilter[PROCESS_EXECUTION_FILTERS.START_TIME]?.filterValue,
    ...sideFilter[PROCESS_EXECUTION_FILTERS.END_TIME]?.filterValue,
  };
};
