export const getOptionalAndRequiredParams = (parameters, type) => {
  const { optionalParams, mandatoryParams } = parameters.reduce(
    (acc, field) => {
      let isMandatoryField, updatedField;

      if (type === "AGENT") {
        updatedField = field;

        isMandatoryField = field.fieldCriteria === 'M';
      } else {
        if (!field.isVisible) return acc;

        updatedField = {
          ...field,
          fieldName: field.name,
          fieldValidationType: field.type,
          fieldCriteria: field.isMandatory ? 'M' : 'O',
          isProtected: field.isProtected,
        };

        isMandatoryField = field.isMandatory;
      }

      return isMandatoryField
        ? { ...acc, mandatoryParams: [...acc.mandatoryParams, updatedField] }
        : { ...acc, optionalParams: [...acc.optionalParams, updatedField] };
    },
    { optionalParams: [], mandatoryParams: [] }
  );

  const requiredFieldsFilled = mandatoryParams.filter(({ value }) => value).length;
  const optionalFieldsFilled = optionalParams.filter(({ value }) => value).length;

  return {
    fieldParams: [...optionalParams, ...mandatoryParams].sort((a, b) => a.orderNumber - b.orderNumber),
    optionalFields: optionalParams.sort((a, b) => a.orderNumber - b.orderNumber),
    optionalFieldsCount: optionalParams.length,
    haveOptionalParams: optionalParams.length > 0,
    requiredFields: mandatoryParams.sort((a, b) => a.orderNumber - b.orderNumber),
    requiredFieldsCount: mandatoryParams.length,
    haveMandatoryParams: mandatoryParams.length > 0,
    requiredFieldsFilled,
    optionalFieldsFilled,
  };
};
