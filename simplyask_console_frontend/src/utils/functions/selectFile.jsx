export const selectFile = (inputRef) => {
  inputRef.current.value = null;

  inputRef.current.click();
};
