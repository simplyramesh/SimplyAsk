export const JOB_TRANSITION_TYPES = {
  SUCCESS: 'SUCCESS',
  FALLOUT: 'FALLOUT',
};

export const TIME_TYPES = {
  SECONDS: 'SECONDS',
  MINUTES: 'MINUTES',
  HOURS: 'HOURS',
  DAYS: 'DAYS',
};

export const TIME_TYPES_MAP = {
  [TIME_TYPES.SECONDS]: 'Seconds',
  [TIME_TYPES.MINUTES]: 'Minutes',
  [TIME_TYPES.HOURS]: 'Hours',
  [TIME_TYPES.DAYS]: 'Days',
};

export const TIME_TYPE_OPTIONS = [
  { label: 'Seconds', value: TIME_TYPES.SECONDS },
  { label: 'Hours', value: TIME_TYPES.HOURS },
  { label: 'Days', value: TIME_TYPES.DAYS },
];
