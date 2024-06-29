import { MR_HISTORY_RECORD_LIST_API_KEYS, MR_HISTORY_RECORD_LIST_FILTER_KEYS } from './mappers';

export const MR_HISTORY_RECORD_LIST_CALENDAR_KEY = 'calendar';

export const mrHistoryRecordListTableHeaderDropdownSchema = [
  {
    name: MR_HISTORY_RECORD_LIST_FILTER_KEYS.STAGE,
    validations: ['array'],
    default: [],
    formatter: (value) => value.v.map((stage) => stage.value),
  },
];

export const mrHistoryRecordListFilterDropdownSchema = [
  {
    name: MR_HISTORY_RECORD_LIST_CALENDAR_KEY,
    validations: ['array'],
    default: [],
    formatter: (value) => value.filterValue,
  },
  {
    name: MR_HISTORY_RECORD_LIST_FILTER_KEYS.STARTED.BEFORE,
    validations: ['string'],
    default: '',
    formatter: (value) => value.obj[MR_HISTORY_RECORD_LIST_FILTER_KEYS.STARTED.BEFORE],
  },
  {
    name: MR_HISTORY_RECORD_LIST_FILTER_KEYS.STARTED.AFTER,
    validations: ['string'],
    default: '',
    formatter: (value) => value.obj[MR_HISTORY_RECORD_LIST_FILTER_KEYS.STARTED.AFTER],
  },
  {
    name: MR_HISTORY_RECORD_LIST_FILTER_KEYS.ENDED.BEFORE,
    validations: ['string'],
    default: '',
    formatter: (value) => value.obj[MR_HISTORY_RECORD_LIST_FILTER_KEYS.ENDED.BEFORE],
  },
  {
    name: MR_HISTORY_RECORD_LIST_FILTER_KEYS.ENDED.AFTER,
    validations: ['string'],
    default: '',
    formatter: (value) => value.obj[MR_HISTORY_RECORD_LIST_FILTER_KEYS.ENDED.AFTER],
  },
  {
    name: MR_HISTORY_RECORD_LIST_FILTER_KEYS.TRANSFORM_BATCH_ID,
    validations: ['array'],
    default: [],
    formatter: (value) => value.v.map((batch) => batch[MR_HISTORY_RECORD_LIST_API_KEYS.TRANSFORM_BATCH_ID]),
  },
  {
    name: MR_HISTORY_RECORD_LIST_FILTER_KEYS.LOAD_BATCH_ID,
    validations: ['array'],
    default: [],
    formatter: (value) => value.v.map((batch) => batch[MR_HISTORY_RECORD_LIST_API_KEYS.LOAD_BATCH_ID]),
  },
  {
    name: MR_HISTORY_RECORD_LIST_FILTER_KEYS.STATUS,
    validations: ['array'],
    default: [],
    formatter: (value) => value.v.map((status) => status.value),
  },
];
