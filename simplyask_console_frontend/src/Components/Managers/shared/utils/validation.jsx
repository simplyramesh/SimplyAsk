import { MANAGERS_IMPORT_JSON_FORMAT } from '../constants/common';

export const PROCESS_NAME_MAX_LENGTH = 52;
export const PROCESS_DESCRIPTION_MAX_LENGTH = 78;

export const DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA = {
  NAME_MAX_LEN: PROCESS_NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LEN: PROCESS_DESCRIPTION_MAX_LENGTH,
};

export const getErrors = ({ schema, data }) => {
  let errors = {};

  try {
    schema.validateSync(data, { strict: true, abortEarly: false });
  } catch (e) {
    errors = e.inner?.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
  }

  return errors;
};

export const isFileInJsonFormat = (fileName = '') => isFileInFormat(fileName, MANAGERS_IMPORT_JSON_FORMAT.EXTENSION);

export const isFileInFormat = (fileName = '', format) => {
  if (!fileName) return false;

  const EXTENSION_DOT = '.';

  const lastDotIndex = fileName.lastIndexOf(EXTENSION_DOT);

  if (lastDotIndex > -1) {
    const extensionPart = fileName.substring(lastDotIndex + 1);
    return format.indexOf(extensionPart) !== -1;
  }

  return false;
};

export const getParsedImportFile = (file) =>
  new Promise((resolve, reject) => {
    if (!file) reject();

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        resolve(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        reject(error);
      }
    };

    reader.readAsText(file);
  });

export const validateYupSchemaAsync = async (schema, obj) => {
  try {
    await schema.validate(obj);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
