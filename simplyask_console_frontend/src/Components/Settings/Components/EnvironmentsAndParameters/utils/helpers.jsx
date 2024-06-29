import { VALIDATION_TYPES, VALIDATION_TYPE_LABELS } from "../../../../PublicFormPage/constants/validationTypes"

export const getParametersTypeOptions = () =>
  Object.keys(VALIDATION_TYPES).map((key) => ({
    value: VALIDATION_TYPES[key],
    label: VALIDATION_TYPE_LABELS[key],
  }));