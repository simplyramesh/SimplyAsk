export const VALIDATION_TYPES = {
  GENERIC: 'GENERIC',
  ALPHA_NUMERIC: 'ALPHA_NUMERIC',
  ALPHABET: 'ALPHABET',
  ADDRESS: 'ADDRESS',
  ANYTHING: 'ANYTHING',
  NUMBER: 'NUMBER',
  FLOAT_NUMBER: 'FLOAT_NUMBER',
  BOOLEAN: 'BOOLEAN',
  EMAIL: 'EMAIL',
  PHONE_NUMBER: 'PHONE_NUMBER',
  DATE_OF_BIRTH: 'DATE_OF_BIRTH',
  DATE: 'DATE',
  POSTAL_CODE: 'POSTAL_CODE',
  ZIP_CODE: 'ZIP_CODE',
  FILE: 'FILE',
  OBJECT: 'OBJECT',
  JSON: 'JSON',
  RANGE: 'RANGE',
  MAX_INPUT_SIZE: 'MAX_INPUT_SIZE',
  SIGNATURE: 'SIGNATURE',
  TEXT: 'TEXT',
};

export const COMPONENT_TYPES = {
  SINGLE_VALUE_ENTRY: 'SINGLE_VALUE_ENTRY',
  SINGLE_SELECT_DROPDOWN: 'SINGLE_SELECT_DROPDOWN',
  MULTI_SELECT_DROPDOWN: 'MULTI_SELECT_DROPDOWN',
};

export const VALIDATION_TYPE_LABELS = {
  [VALIDATION_TYPES.GENERIC]: 'Generic',
  [VALIDATION_TYPES.ALPHA_NUMERIC]: 'Alphanumeric',
  [VALIDATION_TYPES.ALPHABET]: 'Alphabet',
  [VALIDATION_TYPES.ADDRESS]: 'Address',
  [VALIDATION_TYPES.NUMBER]: 'Number',
  [VALIDATION_TYPES.FLOAT_NUMBER]: 'Float',
  [VALIDATION_TYPES.BOOLEAN]: 'Boolean',
  [VALIDATION_TYPES.EMAIL]: 'Email',
  [VALIDATION_TYPES.PHONE_NUMBER]: 'Phone Number',
  [VALIDATION_TYPES.DATE_OF_BIRTH]: 'Date of Birth',
  [VALIDATION_TYPES.POSTAL_CODE]: 'Postal Code',
  [VALIDATION_TYPES.FILE]: 'File',
  [VALIDATION_TYPES.OBJECT]: 'Object',
};

export const VALIDATION_TYPE_INITIAL_VALUES = {
  [VALIDATION_TYPES.ALPHA_NUMERIC]: '',
  [VALIDATION_TYPES.ALPHABET]: '',
  [VALIDATION_TYPES.ADDRESS]: '',
  [VALIDATION_TYPES.NUMBER]: '',
  [VALIDATION_TYPES.BOOLEAN]: '',
  [VALIDATION_TYPES.EMAIL]: '',
  [VALIDATION_TYPES.PHONE_NUMBER]: '',
  [VALIDATION_TYPES.DATE_OF_BIRTH]: '',
  [VALIDATION_TYPES.POSTAL_CODE]: '',
  [VALIDATION_TYPES.FILE]: '',
  [VALIDATION_TYPES.JSON]: '',
  [VALIDATION_TYPES.ZIP_CODE]: '',
  [VALIDATION_TYPES.ANYTHING]: '',
};

export const VALIDATION_TYPE_PLACEHOLDERS = {
  [VALIDATION_TYPES.ADDRESS]: 'Enter address',
  [VALIDATION_TYPES.POSTAL_CODE]: 'Enter postal code (e.g A1A 1A1)',
  [VALIDATION_TYPES.ZIP_CODE]: 'Enter zip code (e.g 12345)',
};

export const VALIDATION_TYPES_REGEX = {
  [VALIDATION_TYPES.GENERIC]: /^(?!\s*$).+/i,
  [VALIDATION_TYPES.ALPHA_NUMERIC]: /^[a-z0-9À-ÿ ]+$/i,
  [VALIDATION_TYPES.ALPHABET]: /^[a-zÀ-ÿ\s]+$/i,
  [VALIDATION_TYPES.ADDRESS]: /^[a-z0-9À-ÿ ,.]+$/i,
  [VALIDATION_TYPES.NUMBER]: /^-?[0-9]+$/,
  [VALIDATION_TYPES.FLOAT_NUMBER]: /^-?[0-9]+(\.[0-9]+)?$/,
  [VALIDATION_TYPES.BOOLEAN]: /^true$|^false$/,
  [VALIDATION_TYPES.EMAIL]: /.+@.+\..+/i,
  [VALIDATION_TYPES.PHONE_NUMBER]: /^(?:\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  [VALIDATION_TYPES.DATE_OF_BIRTH]: /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|[12][0-9]|3[01])\/((?:19|20)[0-9][0-9])$/i,
  [VALIDATION_TYPES.POSTAL_CODE]: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
  [VALIDATION_TYPES.ZIP_CODE]: /^\d{5}(?:-\d{4})?$/i,
  [VALIDATION_TYPES.FILE]: /^.*$/,
  [VALIDATION_TYPES.OBJECT]: /^.*$/,
  [VALIDATION_TYPES.SIGNATURE]:
    /^data:image\/(png|jpeg|jpg);base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
};

export const VALIDATION_TYPES_ERROR_MESSAGES = (name) => ({
  [VALIDATION_TYPES.GENERIC]: `${name}  must be a non-empty string and cannot contain only spaces.`,
  [VALIDATION_TYPES.ALPHA_NUMERIC]: `${name} must contain only letters and numbers`,
  [VALIDATION_TYPES.ALPHABET]: `${name} must contain only letters`,
  [VALIDATION_TYPES.ADDRESS]: `${name} must contain only letters, numbers, and spaces`,
  [VALIDATION_TYPES.NUMBER]: `${name} must be a whole number`,
  [VALIDATION_TYPES.FLOAT_NUMBER]: `${name} must be a number`,
  [VALIDATION_TYPES.BOOLEAN]: `${name} must be true or false`,
  [VALIDATION_TYPES.EMAIL]: `${name} must be a valid email address`,
  [VALIDATION_TYPES.PHONE_NUMBER]: `${name} must be a valid phone number`,
  [VALIDATION_TYPES.DATE_OF_BIRTH]: `${name} must be a valid date`,
  [VALIDATION_TYPES.ZIP_CODE]: `${name} must be a valid zip code`,
  [VALIDATION_TYPES.POSTAL_CODE]: `${name} must be a valid postal code`,
  [VALIDATION_TYPES.FILE]: 'Invalid file',
  [VALIDATION_TYPES.OBJECT]: `${name} must be a valid object`,
  [VALIDATION_TYPES.SIGNATURE]: 'A Signature is Required',
  [VALIDATION_TYPES.JSON]: `${name} must be a valid JSON string`,
});
