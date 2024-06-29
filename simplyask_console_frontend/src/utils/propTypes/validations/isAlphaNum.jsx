// regex which matches 20 character alpha numeric strings
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search
// .search() returns -1 if the string is not found
// .test() returns true if the string is found, but if called again, it will return false, not good for use in a loop

const isAlphaNumRegExp = /^[a-zA-Z0-9]*$/;

export const isAlphaNum = (props, propName, componentName) => {
  const string = props[propName];
  const isValid = string.search(isAlphaNumRegExp) !== -1;

  if (!string) {
    return new Error(`${componentName} requires a ${propName} prop`);
  }

  if (!isValid) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}.  The ${propName} prop must be an alpha numeric string.`,
    );
  }
  return null;
};
