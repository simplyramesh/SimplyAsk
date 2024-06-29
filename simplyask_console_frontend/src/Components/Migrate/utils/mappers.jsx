export const STATUS_MAP = {
  WAITING: { label: 'Waiting', color: 'blue' },
  // TODO: cancelled and processing cause status 400
  // MIGRATING: { label: 'Migrating', color: 'yellow' },
  // POST_MIGRATION: { label: 'Post migrating', color: 'yellow' },
  PROCESSING: { label: 'Processing', color: 'yellow' },
  DONE: { label: 'Done', color: 'green' },
  FALLOUT: { label: 'Fallout', color: 'red' },
  CANCELLED: { label: 'Cancelled', color: 'grey' },
};

const STATUS_MAP_COLOR = Object.freeze({
  TYPE_1: {
    color: '#5F9936',
    bg: '#EBF2E6',
  },
  TYPE_2: {
    color: '#E7BB09',
    bg: '#FCF7E0',
  },
  TYPE_3: {
    color: '#E03B24',
    bg: '#FBE7E4',
  },
  TYPE_4: {
    color: '#3865A3',
    bg: '#E6ECF4',
  },
  TYPE_5: {
    color: '#2D3A47',
    bg: '#EEE',
  },
});

export const STATUS_MAP_REDESIGN = Object.freeze({
  SUCCESS: {
    label: 'Success',
    ...STATUS_MAP_COLOR.TYPE_1,
  },
  RESOLVED: {
    label: 'Resolved',
    ...STATUS_MAP_COLOR.TYPE_1,
  },
  ACCEPTED: {
    label: 'Accepted',
    ...STATUS_MAP_COLOR.TYPE_1,
  },
  DONE: {
    label: 'Done',
    ...STATUS_MAP_COLOR.TYPE_1,
  },
  ACTIVATED: {
    label: 'Activated',
    ...STATUS_MAP_COLOR.TYPE_1,
  },
  ASSIGNED: {
    label: 'Assigned',
    ...STATUS_MAP_COLOR.TYPE_2,
  },
  EXECUTING: {
    label: 'Executing',
    ...STATUS_MAP_COLOR.TYPE_2,
  },
  PROCESSING: {
    label: 'Processing',
    ...STATUS_MAP_COLOR.TYPE_2,
  },
  PARTIALLY_RESOLVED: {
    label: 'Partially Resolved',
    ...STATUS_MAP_COLOR.TYPE_2,
  },
  OVERDUE: {
    label: 'Overdue',
    ...STATUS_MAP_COLOR.TYPE_3,
  },
  FAILED: {
    label: 'Failed',
    ...STATUS_MAP_COLOR.TYPE_3,
  },
  REJECTED: {
    label: 'Rejected',
    ...STATUS_MAP_COLOR.TYPE_3,
  },
  FALLOUT: {
    label: 'Fallout',
    ...STATUS_MAP_COLOR.TYPE_3,
  },
  UNASSIGNED: {
    label: 'Unassigned',
    ...STATUS_MAP_COLOR.TYPE_4,
  },
  PREPARING: {
    label: 'Preparing',
    ...STATUS_MAP_COLOR.TYPE_4,
  },
  FINALIZING: {
    label: 'Finalizing',
    ...STATUS_MAP_COLOR.TYPE_4,
  },
  WAITING: {
    label: 'Waiting',
    ...STATUS_MAP_COLOR.TYPE_4,
  },
  DEACTIVATED: {
    label: 'Deactivated',
    ...STATUS_MAP_COLOR.TYPE_5,
  },
});

export const MR_HISTORY_RECORD_STATUS_ENUMS = {
  EXTRACTION: 'EXTRACTION',
  TRANSFORMATION: 'TRANSFORMATION',
  LOADING: 'LOADING',
  POST_LOADING: 'POST_LOADING',
  RESULT: 'RESULT',
};

export const MR_HISTORY_RECORD_STAGES = {
  [MR_HISTORY_RECORD_STATUS_ENUMS.EXTRACTION]: {
    label: 'Extraction',
    color: 'violet',
  },
  [MR_HISTORY_RECORD_STATUS_ENUMS.TRANSFORMATION]: {
    label: 'Transformation',
    color: 'blueberry',
  },
  [MR_HISTORY_RECORD_STATUS_ENUMS.LOADING]: {
    label: 'Loading',
    color: 'marinerBlue',
  },
  [MR_HISTORY_RECORD_STATUS_ENUMS.POST_LOADING]: {
    label: 'Post-loading',
    color: 'easternBlue',
  },
  [MR_HISTORY_RECORD_STATUS_ENUMS.RESULT]: {
    label: 'Result',
    color: 'greenOnion',
  },
};

/* API request/response keys */
export const MR_HISTORY_RECORD_LIST_API_KEYS = {
  STARTED_AT: 'startedAt',
  FINISHED_AT: 'finishedAt',
  RECORD_ID: 'externalRecordId',
  TRANSFORM_BATCH_ID: 'transformBatchId',
  LOAD_BATCH_ID: 'loadBatchId',
  RECORD_STAGE: 'recordStage',
  RECORD_STATUS: 'recordStatus',
};

export const MR_HISTORY_RECORD_DETAILS_API_KEYS = {
  RECORD_ID: 'id',
  LOADING_BATCH_ID: MR_HISTORY_RECORD_LIST_API_KEYS.LOAD_BATCH_ID,
  LOGS: 'logs',
  RECORD_LOG: {
    EXECUTION_ID: 'executionId',
    TIME: 'timestamp',
    LEVEL: 'level',
    MESSAGE: 'message',
    FALLOUT_ID: 'falloutId',
  },
  SOURCE_DATA: 'sourceData',
  TARGET_DATA: 'targetData',
  RECORD_STAGE: 'stage',
  RECORD_STATUS: 'status',
  TRANSFORM_BATCH_ID: MR_HISTORY_RECORD_LIST_API_KEYS.TRANSFORM_BATCH_ID,
};

export const MR_HISTORY_RECORD_LIST_FILTER_KEYS = {
  STARTED: {
    BEFORE: 'createdBefore',
    AFTER: 'createdAfter',
  },
  ENDED: {
    BEFORE: 'doneBefore',
    AFTER: 'doneAfter',
  },
  TIMEZONE: 'timezone',
  TRANSFORM_BATCH_ID: 'transformBatchIds',
  LOAD_BATCH_ID: 'loadBatchIds',
  STATUS: 'statuses',
  STAGE: 'stages',
  GLOBAL_FILTER: 'searchText',
  EXTERNAL_ID: 'externalIds',
};
