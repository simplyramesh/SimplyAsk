export const isString = (myString) => {
  return /^[a-zA-Z]+$/.test(myString);
};

export const isNumber = (number) => {
  return /^\d+$/.test(number);
};
