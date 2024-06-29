export const FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  WEEKEND: 'weekend',
  MONTHLY: 'monthly',
  CUSTOM_DAYS: 'customDays',
  CUSTOM_FREQUENCY: 'customFrequency',
};

export const PERIOD = {
  DAYS: 'days',
  MONTHS: 'months',
};

export const DAYS_INCLUDED = {
  ALL_DAYS: 'allDays',
  CUSTOM_DAYS: 'customDays',
};

export const taskTypesMap = {
  SEND_PS_REPORT: 'TELUS Personal Safety',
  SEND_TOS_REPORT: 'TELUS Online Security',
};

export const taskTypes = [
  {
    label: taskTypesMap.SEND_PS_REPORT,
    value: 'SEND_PS_REPORT',
  },
  {
    label: taskTypesMap.SEND_TOS_REPORT,
    value: 'SEND_TOS_REPORT',
  },
];

export const frequencies = [
  {
    label: 'Every day',
    value: FREQUENCIES.DAILY,
  },
  {
    label: 'Every week day',
    value: FREQUENCIES.WEEKLY,
  },
  {
    label: 'Every weekend',
    value: FREQUENCIES.WEEKEND,
  },
  {
    label: 'Every month',
    value: FREQUENCIES.MONTHLY,
  },
  {
    label: 'Custom days',
    value: FREQUENCIES.CUSTOM_DAYS,
  },
  {
    label: 'Custom frequency',
    value: FREQUENCIES.CUSTOM_FREQUENCY,
  },
];

export const period = [
  {
    label: 'Days',
    value: PERIOD.DAYS,
  },
  {
    label: 'Months',
    value: PERIOD.MONTHS,
  },
];

export const time = [
  {
    label: 'AM',
    value: 'am',
  },
  {
    label: 'PM',
    value: 'pm',
  },
];

export const daysIncluded = [
  {
    label: 'Include All Data Points',
    value: DAYS_INCLUDED.ALL_DAYS,
  },
  {
    label: 'Custom Number of Data Points',
    value: DAYS_INCLUDED.CUSTOM_DAYS,
  },
];

export const days = [
  {
    label: 'Sun',
    value: 0,
  },
  {
    label: 'Mon',
    value: 1,
  },
  {
    label: 'Tue',
    value: 2,
  },
  {
    label: 'Wed',
    value: 3,
  },
  {
    label: 'Thu',
    value: 4,
  },
  {
    label: 'Fri',
    value: 5,
  },
  {
    label: 'Sat',
    value: 6,
  },
];
