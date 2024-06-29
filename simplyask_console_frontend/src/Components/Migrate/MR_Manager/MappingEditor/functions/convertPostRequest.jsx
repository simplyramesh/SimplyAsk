const removeNullValues = (obj) => {
  return Object.keys(obj).reduce((newObj, key) => {
    const value = obj[key];

    if (key === 'value' && value == null) {
      return { ...newObj, [key]: '' };
    }

    if (value === null) {
      return newObj;
    }

    if (typeof value === 'object') {
      return { ...newObj, [key]: removeNullValues(value) };
    }

    return { ...newObj, [key]: value };
  }, {});
};

export const convertToApiRequest = (records, isUpdate) => {
  const convert = records.map((row) => {
    const newRow = {
      name: row?.name || '',
      sourceField1: row?.sourceField1Value?.field.fieldId ? {
        fieldId: row?.sourceField1Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      sourceField2: row?.sourceField2Value?.field.fieldId ? {
        fieldId: row?.sourceField2Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      sourceField3: row?.sourceField3Value?.field.fieldId ? {
        fieldId: row?.sourceField3Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      sourceField4: row?.sourceField4Value?.field.fieldId ? {
        fieldId: row?.sourceField4Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      sourceField5: row?.sourceField5Value?.field.fieldId ? {
        fieldId: row?.sourceField5Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      sourceField6: row?.sourceField6Value?.field.fieldId ? {
        fieldId: row?.sourceField6Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      targetField1: row?.targetField1Value?.field.fieldId ? {
        fieldId: row?.targetField1Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      targetField2: row?.targetField2Value?.field.fieldId ? {
        fieldId: row?.targetField2Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      targetField3: row?.targetField3Value?.field.fieldId ? {
        fieldId: row?.targetField3Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      targetField4: row?.targetField4Value?.field.fieldId ? {
        fieldId: row?.targetField4Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      targetField5: row?.targetField5Value?.field.fieldId ? {
        fieldId: row?.targetField5Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      targetField6: row?.targetField6Value?.field.fieldId ? {
        fieldId: row?.targetField6Value?.field.fieldId,
        fieldName: null,
        fieldType: null,
        parentObject: null,
      } : null,
      associationSetRules: records.map((r) => ({
        priority: r.priority,
        sourceField1: r.sourceField1Value && r.sourceField1Value.field.fieldId !== null ? r.sourceField1Value : null,
        sourceField2: r.sourceField2Value && r.sourceField2Value.field.fieldId !== null ? r.sourceField2Value : null,
        sourceField3: r.sourceField3Value && r.sourceField3Value.field.fieldId !== null ? r.sourceField3Value : null,
        sourceField4: r.sourceField4Value && r.sourceField4Value.field.fieldId !== null ? r.sourceField4Value : null,
        sourceField5: r.sourceField5Value && r.sourceField5Value.field.fieldId !== null ? r.sourceField5Value : null,
        sourceField6: r.sourceField6Value && r.sourceField6Value.field.fieldId !== null ? r.sourceField6Value : null,
        targetField1: r.targetField1Value && r.targetField1Value.field.fieldId !== null ? r.targetField1Value : null,
        targetField2: r.targetField2Value && r.targetField2Value.field.fieldId !== null ? r.targetField2Value : null,
        targetField3: r.targetField3Value && r.targetField3Value.field.fieldId !== null ? r.targetField3Value : null,
        targetField4: r.targetField4Value && r.targetField4Value.field.fieldId !== null ? r.targetField4Value : null,
        targetField5: r.targetField5Value && r.targetField5Value.field.fieldId !== null ? r.targetField5Value : null,
        targetField6: r.targetField6Value && r.targetField6Value.field.fieldId !== null ? r.targetField6Value : null,
      })),
    };

    return newRow;
  });

  const converted = convert.reduce((acc, cur) => {
    const newData = isUpdate
      ? { ...acc, ...cur, associationSetRules: cur.associationSetRules.map(removeNullValues) }
      : { ...acc, ...cur };

    return newData;
  }, {});

  return converted;
};
