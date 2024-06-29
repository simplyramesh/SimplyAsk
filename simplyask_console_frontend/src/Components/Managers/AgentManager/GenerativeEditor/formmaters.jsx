import { DUPLICATE_NAME_COPY } from './constants/core';

export const getUniqueNameRecursively = (baseName, objectivesData, index = 1) => {
  const duplicateName =
    index === 1 ? `${baseName}${DUPLICATE_NAME_COPY}` : `${baseName}${DUPLICATE_NAME_COPY} ${index}`;
  const baseNameExists = objectivesData.some((obj) => obj.name === duplicateName);

  if (baseNameExists) {
    return getUniqueNameRecursively(baseName, objectivesData, index + 1);
  }

  return duplicateName;
};
