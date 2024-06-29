export const updateObj = (obj, path, value) => {
  const objCopy = { ...obj };
  const pathArray = path.split('.');
  const lastKey = pathArray.pop();

  const lastObj = pathArray.reduce((obj, key) => obj[key], objCopy);

  lastObj[lastKey] = value;

  return objCopy;
};

export const getInObj = (obj, path) => {
  const pathArray = path.split('.');

  return pathArray.reduce((obj, key) => obj[key], obj);
};
