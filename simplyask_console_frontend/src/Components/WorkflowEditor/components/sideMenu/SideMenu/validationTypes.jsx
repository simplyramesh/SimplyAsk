import { VALIDATION_TYPES } from '../../../../PublicFormPage/constants/validationTypes';

export const GROUPED_VALIDATION_TYPES_OPTIONS = [
  {
    label: 'Text',
    options: [
      { label: 'Anything', value: VALIDATION_TYPES.ANYTHING },
      { label: 'Email', value: VALIDATION_TYPES.EMAIL },
      { label: 'Letters Only', value: VALIDATION_TYPES.ALPHABET },
      { label: 'Letters & Numbers Only', value: VALIDATION_TYPES.ALPHA_NUMERIC },
      { label: 'Numbers Only', value: VALIDATION_TYPES.NUMBER },
    ],
  },
  {
    label: 'Address',
    options: [
      { label: 'Full Address', value: VALIDATION_TYPES.ADDRESS },
      { label: 'Postal Code (Canada)', value: VALIDATION_TYPES.POSTAL_CODE },
      { label: 'Zip Code (USA)', value: VALIDATION_TYPES.ZIP_CODE },
    ],
  },
  {
    label: 'Other',
    options: [
      { label: 'Boolean', value: VALIDATION_TYPES.BOOLEAN },
      { label: 'Date ', value: VALIDATION_TYPES.DATE_OF_BIRTH },
      { label: 'File', value: VALIDATION_TYPES.FILE },
      { label: 'JSON', value: VALIDATION_TYPES.JSON },
      { label: 'Phone Number', value: VALIDATION_TYPES.PHONE_NUMBER },
      { label: 'Signature', value: VALIDATION_TYPES.SIGNATURE },
    ],
  },
];

export const VALIDATION_TYPES_OPTIONS = GROUPED_VALIDATION_TYPES_OPTIONS.map((group) => group.options).flat();

// pass here those data type options that you do not need from GROUPED_VALIDATION_TYPES_OPTIONS
export const getFilteredGroupValidationTypesOptions = (optionsArray) => {
  if (!Array.isArray(optionsArray)) return [];

  const filteredOptions = GROUPED_VALIDATION_TYPES_OPTIONS.map((group) => ({
    ...group,
    options: group.options.filter((option) => !optionsArray.includes(option.value)),
  }));
  return filteredOptions;
};
