export const INTENT_ONLY_STRING = 'Intent Only';
export const CONDITION_ONLY_STRING = 'Condition Only';
export const INTENT_AND_CONDITION_STRING = 'Intent & Condition';

export const DIVIDER_STRING = 'Divider';
export const INTENTS_KEYS = {
  LOCAL: 'Local Intents',
  GLOBAL: 'Global Intents',
  PREBUILT: 'Pre-Built Intents',
};

export const INTENT_TYPE = {
  LOCAL: 'LOCAL',
  GLOBAL: 'GLOBAL',
  PREBUILT: 'PREBUILT',
};

export const TRANSITION_TYPE = {
  INTENT: 'INTENT',
  CONDITION: 'CONDITION',
  INTENT_CONDITION: 'INTENT_CONDITION',
};

export const CONDITION_RULE_TYPE = {
  MATCH_ONE: 'MATCH_ONE',
  MATCH_ALL: 'MATCH_ALL',
  CUSTOM: 'CUSTOM',
};

export const CONDITION_OPERAND = {
  EQUALS: '=',
  COLON: ':',
  NOT_EQUAL: '!=',
  LESS_THAN: '<',
  LESS_THAN_EQUALS: '<=',
  GREATER_THAN: '>',
  GREATER_THAN_EQUALS: '>=',
};

export const selectOperatorOptions = [
  { label: '<', value: 'LESS_THAN' },
  { label: '>', value: 'GREATER_THAN' },
  { label: '=', value: 'EQUALS' },
  { label: '!=', value: 'NOT_EQUAL' },
  { label: '<=', value: 'LESS_THAN_EQUALS' },
  { label: '>=', value: 'GREATER_THAN_EQUALS' },
  { label: ':', value: 'COLON' },
];

export const ALL_INTENTS_STRING = 'All Intents';

export const selectIntentsOptions = [
  { label: ALL_INTENTS_STRING, value: ALL_INTENTS_STRING },
  { label: INTENTS_KEYS.LOCAL, value: INTENTS_KEYS.LOCAL },
  { label: INTENTS_KEYS.GLOBAL, value: INTENTS_KEYS.GLOBAL },
  { label: INTENTS_KEYS.PREBUILT, value: INTENTS_KEYS.PREBUILT },
];

export const AGENT_NAME_MAX_LEN = 52;
export const AGENT_DESC_MAX_LEN = 78;

export const paramTypeOptions = [
  { label: 'Person', value: 'sys.person' },
  { label: 'Color', value: 'sys.color' },
  { label: 'Language', value: 'sys.language' },
  { label: 'Url', value: 'sys.url' },
  { label: 'Any', value: 'sys.any' },
  { label: 'Location', value: 'sys.location' },
  { label: 'Email', value: 'sys.email' },
  { label: 'Phone number', value: 'sys.phone-number' },
  { label: 'Given name', value: 'sys.given-name' },
  { label: 'Last name', value: 'sys.last-name' },
  { label: 'Address', value: 'sys.address' },
  { label: 'Zip code', value: 'sys.zip-code' },
  { label: 'Geo country', value: 'sys.geo-country' },
  { label: 'Geo city', value: 'sys.geo-city' },
  { label: 'Geo state', value: 'sys.geo-state' },
  { label: 'Unit currency', value: 'sys.unit-currency' },
  { label: 'Percentage', value: 'sys.percentage' },
  { label: 'Temperature', value: 'sys.temperature' },
  { label: 'Duration', value: 'sys.duration' },
  { label: 'Currency name', value: 'sys.currency-name' },
  { label: 'Cardinal', value: 'sys.cardinal' },
  { label: 'Ordinal', value: 'sys.ordinal' },
  { label: 'Number integer', value: 'sys.number-integer' },
  { label: 'Number sequence', value: 'sys.number-sequence' },
  { label: 'Flight number', value: 'sys.flight-number' },
  { label: 'Date period', value: 'sys.date-period' },
  { label: 'Date time', value: 'sys.date-time' },
  { label: 'Time', value: 'sys.time' },
  { label: 'Time period', value: 'sys.time-period' },
  { label: 'Number', value: 'sys.number' },
];

export const TRANSITION_SCREEN = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
};

export const INTENT_PARAMETER_COLORS = [
  { BG_COLOR: '#D9FFD6', BORDER_COLOR: '#76DF6E' },
  { BG_COLOR: '#D6EEFF', BORDER_COLOR: '#88CDFF' },
  { BG_COLOR: '#FED6FF', BORDER_COLOR: '#FD8DFF' },
  { BG_COLOR: '#D6FFFD', BORDER_COLOR: '#85F1EB' },
  { BG_COLOR: '#F3F0A4', BORDER_COLOR: '#F0E93A' },
  { BG_COLOR: '#EFFFD6', BORDER_COLOR: '#C5F37B' },
  { BG_COLOR: '#FFD6EA', BORDER_COLOR: '#FF7BBA' },
  { BG_COLOR: '#D6FFEB', BORDER_COLOR: '#87EFBD' },
  { BG_COLOR: '#D6DFFF', BORDER_COLOR: '#7795FF' },
  { BG_COLOR: '#E3D6FF', BORDER_COLOR: '#B38EFF' },
  { BG_COLOR: '#FFEAD6', BORDER_COLOR: '#FFAF66' },
  { BG_COLOR: '#FFD6D6', BORDER_COLOR: '#FF8D8D' },
  { BG_COLOR: '#76DF6E', BORDER_COLOR: '#76DF6E' },
  { BG_COLOR: '#88CDFF', BORDER_COLOR: '#88CDFF' },
  { BG_COLOR: '#FD8DFF', BORDER_COLOR: '#FD8DFF' },
  { BG_COLOR: '#85F1EB', BORDER_COLOR: '#85F1EB' },
  { BG_COLOR: '#F0E93A', BORDER_COLOR: '#F0E93A' },
  { BG_COLOR: '#C5F37B', BORDER_COLOR: '#C5F37B' },
  { BG_COLOR: '#FF7BBA', BORDER_COLOR: '#FF7BBA' },
  { BG_COLOR: '#87EFBD', BORDER_COLOR: '#87EFBD' },
  { BG_COLOR: '#7795FF', BORDER_COLOR: '#7795FF' },
  { BG_COLOR: '#B38EFF', BORDER_COLOR: '#B38EFF' },
  { BG_COLOR: '#FFAF66', BORDER_COLOR: '#FFAF66' },
  { BG_COLOR: '#FF8D8D', BORDER_COLOR: '#FF8D8D' },
];
