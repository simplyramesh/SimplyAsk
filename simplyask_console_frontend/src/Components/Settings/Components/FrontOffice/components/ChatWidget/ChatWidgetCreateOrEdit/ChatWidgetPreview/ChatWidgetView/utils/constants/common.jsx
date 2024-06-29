export const DEMO_CONVERSATION = [
  {
    message: {
      type: 'CHAT_TEXT',
      contents: {
        data: '',
        fromEmail: '',
        fromName: '',
      },
    },
    messageSource: 'DIALOGFLOW',
    transmissionTime: 'Mon Sep 11 2023 13:07:17 GMT-0700 (Pacific Daylight Time)',
  },
  {
    message: {
      type: 'CHAT_TEXT',
      contents: {
        data: '',
        fromEmail: '',
        fromName: '',
      },
    },
    messageSource: 'USER',
    transmissionTime: 'Mon Sep 11 2023 13:07:17 GMT-0700 (Pacific Daylight Time)',
  },
  {
    message: {
      type: 'CHAT_TEXT',
      contents: {
        data: '',
        fromEmail: '',
        fromName: '',
        quickReplies: ['Suggestion 1', 'Suggestion 2', 'Transfer to Live Agent'],
      },
    },
    messageSource: 'DIALOGFLOW',
    transmissionTime: 'Mon Sep 11 2023 13:07:17 GMT-0700 (Pacific Daylight Time)',
  },
];

export const EXTERNAL_LINKS = {
  SIMPLY_ASK_TERMS_OF_SERVICE: 'https://symphona.ai/terms-of-service',
  SIMPLY_ASK_PRIVACY_POLICY: 'https://symphona.ai/privacy-policy',
  SIMPLY_ASK_MAIN_SITE: 'https://symphona.ai',
  SIMPLY_ASK_REPORT: 'https://symphona.ai/company#contact',
};

export const LOCAL_STORAGE = {
  GET_SOUND_SETTINGS: 'GET_SOUND_SETTINGS',
};

export const msgTypes = Object.freeze({
  TEXT: 'CHAT_TEXT',
  FILE: 'CHAT_FILE',
  SET_IVA_AGENT_ID: 'SET_IVA_AGENT_ID',
});

export const msgSrcs = Object.freeze({
  USER: 'USER',
  DIALOGFLOW: 'DIALOGFLOW',
  AGENT: 'AGENT',
  NOTIFICATION: 'NOTIFICATION',
});

export const msgNames = Object.freeze({
  DIALOGFLOW: 'SimplyBot',
  USER: 'You',
});

export const DATA_TYPES = { FILE: 'file', FILE_INFO: 'fileInfo', FILE_SIZE: 'fileSize', FILE_PFP: 'filepfp' };
export const STORAGES = { FILE_SYSTEM: 'FILE_SYSTEM' };
export const ALLOWED_FILE_TYPES_KB = [
  'json',
  'html',
  'pdf',
  'xls',
  'xlsx',
  'txt',
  'csv',
  'xml',
  'doc',
  'docx',
  'pages',
  'md',
  'eml',
  'rtf',
  'log',
  'asc',
  'msg',
  'wps',
  'ipynb',
];

export const ALLOWED_FILE_TYPES_STRING_KB = ALLOWED_FILE_TYPES_KB.map((ext) => `.${ext}`).join(', ');
