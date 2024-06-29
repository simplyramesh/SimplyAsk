export const VALIDATION_MESSAGE_KEYS = {
  REQUIRED_FIELDS_COMPLETED: 'requiredFieldsCompleted',
};

export const STEP_PARAMS = {
  INPUT: 'stepInputParameters',
  OUTPUT: 'stepOutputParameters',
};

export const VALIDATION_TYPES = [
  'NUMBER',
  'ALPHANUMERIC',
  'ALPHABET',
  'OBJECT',
  'GENERIC',
  'ADDRESS',
  'DATE_OF_BIRTH',
  'POSTAL_CODE',
  'ZIP_CODE',
  'PHONE_NUMBER',
  'BOOLEAN',
  'EMAIL',
];

export const STEP_INPUT_TYPE = {
  URL_STRING: 'url',
  NUMBER_SELECTOR: 'number',
  STRING_STRING_MAP: 'select',
  GENERIC_STRING: 'text',
  PLACEHOLDER_FOR_SEARCHABLE_DROPDOWN: 'autoComplete',
};

/* Explanation for 'stepSettingsInputType'
    - for reference of expected API response.
*/

// Keys are for reference and initial dev purposes.
// FOR 'stepSettingsInputType'
export const STEP_INPUT_TYPE_KEYS = {
  DROPDOWN_SELECTOR: 'DROPDOWN_SELECTOR',
  DYNAMIC_DROPDOWN_SELECTOR: 'DYNAMIC_DROPDOWN_SELECTOR',
  INPUT_FIELD: 'INPUT_FIELD',
  STATIC_DYNAMIC_PARAMETER_FIELD: 'STATIC_DYNAMIC_PARAMETER_FIELD',
  API_PARAMETER_LIST: 'API_PARAMETER_LIST',
  REST_BODY_PARAMETER_LIST: 'REST_BODY_PARAMETER_LIST',
  MESSAGE_BOX: 'MESSAGE_BOX',
  SPREADSHEET: 'SPREADSHEET',
  SPREADSHEET_EXTRACT_LIST: 'SPREADSHEET_EXTRACT_LIST',
  RPA_FORUM_LIST: 'RPA_FORUM_LIST',
  PARAMETER_AUTOCOMPLETE: 'PARAMETER_AUTOCOMPLETE',
  DYNAMIC_TEXT_SELECTOR: 'DYNAMIC_TEXT_SELECTOR',
  RADIO_GROUP: 'RADIO_GROUP',
  DISCRETE_SLIDER: 'DISCRETE_SLIDER',
  SWITCH_TOGGLE: 'SWITCH_TOGGLE',
  DYNAMIC_PARAMETER_LIST: 'DYNAMIC_PARAMETER_LIST',
  DYNAMIC_POPUP_FIELDS: 'DYNAMIC_POPUP_FIELDS',
  STATIC_DYNAMIC_FILE_UPLOAD: 'STATIC_DYNAMIC_FILE_UPLOAD',
};

export const STEP_PARAM_TYPES = [
  STEP_INPUT_TYPE_KEYS.STATIC_DYNAMIC_PARAMETER_FIELD,
  STEP_INPUT_TYPE_KEYS.API_PARAMETER_LIST,
  STEP_INPUT_TYPE_KEYS.DROPDOWN_SELECTOR,
  STEP_INPUT_TYPE_KEYS.PARAMETER_AUTOCOMPLETE,
];

export const REST_BODY_TYPES = {
  FORM_DATA: 'application/x-www-form-urlencoded',
  JSON: 'application/json',
  XML: 'application/xml',
  JAVASCRIPT: 'text/javascript',
  HTML: 'text/html',
  TEXT: 'text/plain',
};

export const REST_BODY_CODE_TYPES = [
  REST_BODY_TYPES.JSON,
  REST_BODY_TYPES.XML,
  REST_BODY_TYPES.JAVASCRIPT,
  REST_BODY_TYPES.HTML,
];

export const REST_BODY_TYPES_LABELS = {
  [REST_BODY_TYPES.FORM_DATA]: 'Form Data',
  [REST_BODY_TYPES.JSON]: 'JSON',
  [REST_BODY_TYPES.XML]: 'XML',
  [REST_BODY_TYPES.JAVASCRIPT]: 'Javascript',
  [REST_BODY_TYPES.HTML]: 'HTML',
  [REST_BODY_TYPES.TEXT]: 'Text',
};

export const REST_BODY_CODE_EDITOR_TYPES = {
  [REST_BODY_TYPES.JSON]: 'json',
  [REST_BODY_TYPES.XML]: 'xml',
  [REST_BODY_TYPES.JAVASCRIPT]: 'js',
  [REST_BODY_TYPES.HTML]: 'html',
};

// DROPDOWN_SELECTOR:
export const DROPDOWN_SELECTOR_EXAMPLE = {
  stepDelegateSettings: [
    {
      stepSettingTemplateId: 'STRING',
      stepDelegateId: 'STRING',
      displayName: 'STRING',
      promptText: 'STRING',
      stepSettingsInputType: 'DROPDOWN_SELECTOR',
      stepSettingOptions: {
        // Map<String, List<Pair<String, String>>>
        possible_values: {
          'STRING Title': [
            {
              title: 'STRING',
              value: 'STRING',
            },
          ],
        },
        // Overrides possible_values
        // Specifies if the field should display all of the available parameters at the given workflow step
        // separated in two sections: “Fully Available Parameters” and “Potentially Available Parameters”
        should_display_dynamic_parameter_values: false, // boolean
        // Specifies if the field is a list (whether plusIcon should be displayed)
        is_list: false, // boolean, obviously
      },
      stepSettingOrderNumber: 'NUMBER',
      isOptional: false, // boolean, obviously
      isRecommended: true, // boolean, obviously
      // in documentation, but not currently in API response

      // indicates the section which the given parameter falls under
      // For example, “Input Parameters”
      // Multiple parameters will often share the same sectionTitle
      stepSettingSectionTitle: 'STRING',

      // indicates the types that should be accepted and validated by the frontend
      // If this value is null, then the frontend should not apply validations
      acceptedTypes: ['VALIDATION_TYPES'],
      helpTooltip: 'STRING',
      isOutputParam: false, // STATIC only
    },
  ],
};

export const INPUT_FIELD_EXAMPLE = {
  stepDelegateSettings: [
    {
      stepSettingTemplateId: 'STRING',
      stepDelegateId: 'STRING',
      displayName: 'STRING',
      promptText: 'STRING',
      stepSettingsInputType: 'INPUT_FIELD',
      stepSettingOptions: {
        // Specifies if the field is a list (whether plusIcon should be displayed)
        is_list: false, // boolean, obviously
      },
      stepSettingOrderNumber: 'NUMBER',
      isOptional: false, // boolean, obviously
      isRecommended: true, // boolean, obviously
      // in documentation, but not currently in API response
      stepSettingSectionTitle: 'STRING',
      acceptedTypes: ['VALIDATION_TYPES'],
      helpTooltip: 'STRING',
      isOutputParam: false, // STATIC only
    },
  ],
};

export const STATIC_DYNAMIC_PARAMETER_FIELD_EXAMPLE = {
  stepDelegateSettings: [
    {
      stepSettingTemplateId: 'STRING',
      stepDelegateId: 'STRING',
      displayName: 'STRING',
      promptText: 'STRING',
      stepSettingsInputType: 'STATIC_DYNAMIC_PARAMETER_FIELD',
      stepSettingOptions: {
        // Specifies if the field is a list (whether dropdownselector or inputfield should be displayed)
        is_list: false, // boolean, obviously
      },
      stepSettingOrderNumber: 'NUMBER',
      isOptional: false, // boolean, obviously
      isRecommended: true, // boolean, obviously
      // in documentation, but not currently in API response
      stepSettingSectionTitle: 'STRING',
      acceptedTypes: ['VALIDATION_TYPES'],
      helpTooltip: 'STRING',
      isOutputParam: false, // STATIC only
    },
  ],
};

// ParamList component
export const API_PARAMETER_LIST_EXAMPLE = {
  stepDelegateSettings: [
    {
      stepSettingTemplateId: 'STRING',
      stepDelegateId: 'STRING',
      displayName: 'STRING',
      promptText: 'STRING', //
      stepSettingsInputType: 'API_PARAMETER_LIST',
      stepSettingOptions: {
        // not sure
      },
      stepSettingOrderNumber: 'NUMBER',
      isOptional: false, // boolean, obviously
      isRecommended: true, // boolean, obviously
      // in documentation, but not currently in API response
      stepSettingSectionTitle: 'STRING',
      acceptedTypes: ['VALIDATION_TYPES'],
      helpTooltip: 'STRING',
      isOutputParam: false, // STATIC only
    },
  ],
};

export const MESSAGE_BOX_EXAMPLE = {
  stepDelegateSettings: [
    {
      stepSettingTemplateId: 'STRING',
      stepDelegateId: 'STRING',
      displayName: 'STRING',
      promptText: 'STRING',
      stepSettingsInputType: 'MESSAGE_BOX',
      stepSettingOptions: {
        // content above the message box; in figma, this says "Text & HTML Supported" in 12px, gray text
        field_subheading: 'STRING',
        // whether to show ExpandIcon because indicates whether to allow expanded editor to be opened
        enable_expanded_editor: false, // boolean, obviously
      },
      stepSettingOrderNumber: 'NUMBER',
      isOptional: false, // boolean, obviously
      isRecommended: true, // boolean, obviously
      // in documentation, but not currently in API response

      // indicates the section which the given parameter falls under
      // For example, “Input Parameters”
      // Multiple parameters will often share the same sectionTitle
      stepSettingSectionTitle: 'STRING',

      // indicates the types that should be accepted and validated by the frontend
      // If this value is null, then the frontend should apply no validations
      acceptedTypes: ['VALIDATION_TYPES'],
      helpTooltip: 'STRING',
      isOutputParam: false, // STATIC only
    },
  ],
};

/*  End of explanation for 'stepSettingsInputType' */

// table reference v2.2: WorkflowSettingsDto -> WorkflowInputParamSetDto -> {
// name: string,
// orderNumber: number,
// dynamicInputParams: [WorkflowDynamicInputParamDto: [{paramName: string, validationType: oneOf([NUMBER, ALPHANUMERIC, ALPHABETIC, OBJECT, GENERIC, ADDRESS, DATE_OF_BIRTH, POSTAL_CODE, ZIP_CODE, PHONE_NUMBER, BOOLEAN, EMAIL]), isRequired: boolean}]],
// staticInputParams: [WorkflowStaticInputParamDto: [{ paramName: string, value: string, validationType: oneOf([NUMBER, ALPHANUMERIC, ALPHABETIC, OBJECT, GENERIC, ADDRESS, DATE_OF_BIRTH, POSTAL_CODE, ZIP_CODE, PHONE_NUMBER, BOOLEAN, EMAIL]) }]]
// }

export const SIDE_MENU_API_KEYS = {
  STEP_ID: 'stepDelegateId',
  STEP_TYPE: 'stepDelegateType',
  STEP_CATEGORY: 'stepDelegateCategory',
  STEP_NAME: 'stepDelegateName',
  STEP_ICON: 'stepDelegateIcon',
  STEP_DESCRIPTION: 'stepDelegateDescription',
  ORG_ID: 'associatedOrganizationId',
  STEP_SETTINGS: 'stepDelegateSettings',
  DISPLAY_NAME: 'displayName',
  IS_OPTIONAL: 'isOptional',
  IS_RECOMMENDED: 'isRecommended',
  PROMPT_TEXT: 'promptText',
  STEP_DELEGATE_ID: 'stepDelegateId',
  STEP_SETTING_ORDER_NUMBER: 'stepSettingOrderNumber',
  STEP_SETTING_TEMPLATE_ID: 'stepSettingTemplateId',
  STEP_SETTINGS_INPUT_TYPE: 'stepSettingsInputType',
  STEP_SETTING_OPTIONS: 'stepSettingOptions',
  IS_LIST: 'isList',
  ENABLE_EXPANDED_EDITOR: 'enableExpandedEditor',
  FIELD_SUBHEADING: 'fieldSubheading',
  SHOULD_DISPLAY_DYNAMIC_PARAMETER_FIELDS: 'shouldDisplayDynamicParameterValues',
};

export const SIDE_MENU_HEADER_KEYS = {
  TITLE: SIDE_MENU_API_KEYS.STEP_TYPE,
};

export const SIDE_MENU_CARD_KEYS = {
  ICON: SIDE_MENU_API_KEYS.STEP_ICON,
  NAME: SIDE_MENU_API_KEYS.STEP_NAME,
  DESCRIPTION: SIDE_MENU_API_KEYS.STEP_DESCRIPTION,
  ID: SIDE_MENU_API_KEYS.STEP_ID,
};

export const SIDE_MENU_CONFIG = {
  LABEL: SIDE_MENU_API_KEYS.DISPLAY_NAME,
  STEP_INPUT: SIDE_MENU_API_KEYS.STEP_SETTINGS_INPUT_TYPE,
  OPTIONAL: SIDE_MENU_API_KEYS.IS_OPTIONAL,
  RECOMMENDED: SIDE_MENU_API_KEYS.IS_RECOMMENDED,
  ORDER: SIDE_MENU_API_KEYS.STEP_SETTING_ORDER_NUMBER,
  IS_LIST: SIDE_MENU_API_KEYS.IS_LIST,
  IS_EXPANDED_EDITOR: SIDE_MENU_API_KEYS.ENABLE_EXPANDED_EDITOR,
  SUBHEADING: SIDE_MENU_API_KEYS.FIELD_SUBHEADING,
  PROMPT_TEXT: SIDE_MENU_API_KEYS.PROMPT_TEXT,
  OPTIONS: SIDE_MENU_API_KEYS.STEP_SETTING_OPTIONS,
  DISPLAY_DYNAMIC_PARAMS: SIDE_MENU_API_KEYS.SHOULD_DISPLAY_DYNAMIC_PARAMETER_FIELDS,
};

export const THEN_OTHERWISE_ACTION_TYPES = {
  VISIBLE: 'VISIBLE',
  HIDDEN: 'HIDDEN',
};
