export const MODAL_TYPE = {
  WEBSITE: 'WEBSITE',
  API: 'API',
  FILE: 'FILE',
  TEXT: 'TEXT',
};

export const KNOWLEDGE_BASE_QUERY_KEYS = {
  GET_KNOWLEDGE_BASE: 'GET_KNOWLEDGE_BASE',
  GET_KNOWLEDGE_BASE_BY_ID: 'GET_KNOWLEDGE_BASE_BY_ID',
  CREATE_KNOWLEDGE_BASE: 'CREATE_KNOWLEDGE_BASE',
  UPDATE_KNOWLEDGE_BASE: 'UPDATE_KNOWLEDGE_BASE',
  DELETE_KNOWLEDGE_BASE: 'DELETE_KNOWLEDGE_BASE',
};

export const validateSliderChange = (value, fieldName) => {
  if (value < 1) return 1;

  if (value > SLIDER_MAX_VALUES[fieldName]) return SLIDER_MAX_VALUES[fieldName];

  return value;
};

export const SLIDER_FIELD_NAMES = {
  CRAWL_MAX_DEPTH: 'maxCrawlDepth',
  AUTO_UPDATE_FREQUENCY: 'autoUpdateFrequency',
  CRAWL_MAX_PAGES: 'maxCrawlPages',
};

export const SWITCH_FIELD_NAMES = {
  CRAWL_WEBSITE: 'shouldCrawlWebsite',
  AUTO_UPDATE: 'autoUpdateFrequency',
  CRAWL_ENCOUNTER_FILES: 'shouldCrawlEncounteredFiles',
};

export const SLIDER_MAX_VALUES = {
  [SLIDER_FIELD_NAMES.CRAWL_MAX_DEPTH]: 100,
  [SLIDER_FIELD_NAMES.CRAWL_MAX_PAGES]: 5000,
  [SLIDER_FIELD_NAMES.AUTO_UPDATE_FREQUENCY]: 365,
};
export const KNOWLEDGE_BASE_STATUS = {
  READY: 'Ready (Up-to-Date)',
};

export const KNOWLEDGE_BASES_SIDE_FILTER_INITIAL_VALUES = {
  updatedDate: '',
  createdDate: '',
};