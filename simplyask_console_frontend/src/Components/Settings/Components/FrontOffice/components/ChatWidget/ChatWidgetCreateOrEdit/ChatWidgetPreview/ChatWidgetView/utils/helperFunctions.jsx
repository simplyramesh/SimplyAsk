import tinycolor from 'tinycolor2';

import { STORAGES } from './constants/common';

export const getLighterOpacityOfColor = (color, opacity = 0.1) => {
  const getRgbValue = tinycolor(color);

  return `rgba(${getRgbValue?._r}, ${getRgbValue?._g}, ${getRgbValue?._b}, ${opacity})`;
};

export const getMidOpacityOfColor = (color) => getLighterOpacityOfColor(color, 0.6);

export const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

export const getFileInfo = (
  parent,
  uploadBy,
  stringify = false,
  name = null,
  description = '',
  storageSystem = STORAGES.FILE_SYSTEM,
) => (stringify
  ? JSON.stringify({
    name, description, storageSystem, parent, uploadBy,
  })
  : {
    name, description, storageSystem, parent, uploadBy,
  });
