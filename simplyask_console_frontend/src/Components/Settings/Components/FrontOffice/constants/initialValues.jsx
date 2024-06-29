import { VALIDATION_TYPES } from '../../../../PublicFormPage/constants/validationTypes';
import { STATUSES_COLORS } from './iconConstants';
import { CREATE_EDIT_TABS } from './tabConstants';

export const SERVICE_TICKET_TYPES_INITIAL_VALUES = {
  updatedBefore: '',
  updatedAfter: '',
  createdBefore: '',
  createdAfter: '',
};

export const SERVICE_TICKET_TYPES_SIDE_FILTER_INITIAL_VALUES = {
  updatedDate: '',
  createdDate: '',
};

export const CREATE_SERVICE_TICKET_TYPE_INIT_VALUES = {
  name: '',
  description: '',
  icon: '',
  iconColour: '',
  statuses: [{
    orderNumber: 1,
    name: 'Unassigned',
    colour: STATUSES_COLORS.DARK_BLUE,
  }, {
    orderNumber: 2,
    name: 'Assigned',
    colour: STATUSES_COLORS.YELLOW,
  }, {
    orderNumber: 3,
    name: 'Resolved',
    colour: STATUSES_COLORS.GREEN,
  }],
  isDefault: false,
  isVisible: true,
  tabs: [
    'TICKET_TASKS', 'CONVERSATION_HISTORY', 'BOA_PROCESSES', 'OVERVIEW',
  ],
  parameters: [{
    isVisible: true,
    name: 'External ID',
    isPreset: true,
    isMandatory: false,
    isMasked: false,
    orderNumber: 1,
    type: VALIDATION_TYPES.NUMBER,
  }, {
    isVisible: true,
    name: 'First Name',
    isPreset: true,
    isMandatory: false,
    isMasked: false,
    orderNumber: 2,
    type: VALIDATION_TYPES.ALPHABET,
  }, {
    isVisible: true,
    name: 'Last Name',
    isPreset: true,
    isMandatory: false,
    isMasked: false,
    orderNumber: 3,
    type: VALIDATION_TYPES.ALPHABET,
  }, {
    isVisible: true,
    name: 'Full Address',
    isPreset: true,
    isMandatory: false,
    isMasked: false,
    orderNumber: 4,
    type: VALIDATION_TYPES.ADDRESS,
  }, {
    isVisible: false,
    name: 'Address - Street',
    isPreset: true,
    isMandatory: false,
    isMasked: false,
    orderNumber: 5,
    type: VALIDATION_TYPES.ALPHA_NUMERIC,
  }, {
    isVisible: false,
    name: 'Address - City',
    isPreset: true,
    isMandatory: false,
    isMasked: false,
    orderNumber: 6,
    type: VALIDATION_TYPES.ALPHABET,
  }, {
    isVisible: false,
    name: 'Address - Province/State',
    isPreset: true,
    isMandatory: false,
    isMasked: false,
    orderNumber: 7,
    type: VALIDATION_TYPES.ALPHABET,
  }, {
    isVisible: false,
    name: 'Address - Postal Code/Zip Code',
    isPreset: true,
    isMandatory: false,
    isMasked: false,
    orderNumber: 8,
    type: VALIDATION_TYPES.POSTAL_CODE,
  }],
};

export const ADD_FIELDS_FILE_TYPES = {
  CUSTOM: 'CUSTOM',
  ALL: 'ALL'
}

export const ADD_FIELDS_INIT_VALUES = {
  name: '',
  defaultValue: '',
  type: VALIDATION_TYPES.ANYTHING,
  isVisible: true,
  isPreset: false,
  isMandatory: true,
  isMasked: false,
  fileType: ADD_FIELDS_FILE_TYPES.ALL,
  fileSize: 50,
  customFileType: []
};

export const CREATE_EDIT_TABS_INITIAL_VALUES = {
  [CREATE_EDIT_TABS.GENERAL_SETTINGS]: true,
  [CREATE_EDIT_TABS.AGENTS]: false,
  [CREATE_EDIT_TABS.APPEARANCE]: false,
};

export const CHAT_WIDGETS_SIDE_FILTER_INITIAL_VALUES = {
  updatedDate: '',
  createdDate: '',
  agents: [],
};

export const PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES = {
  createdDate: '',
  country: '',
  province: '',
  region: '',
  location: '',
};
