import { useCallback } from 'react';

import useStateWithValidation from '../useStateWithValidation/useStateWithValidation';

const useInputValidation = ({ validator, initialValue, message }) => {
  const [state, setState, isValid, isTouched, errorMessage, isFormValid, handleBlur, reset] = useStateWithValidation(
    validator,
    initialValue,
    message,
  );

  const handleChange = useCallback((e) => setState((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  })), []);

  const bind = (key) => ({
    value: state[key],
    onChange: handleChange,
    onFocus: handleBlur,
    onBlur: (e) => {
      setState((prev) => ({ ...prev, [e.target.name]: state[e.target.name].trim() }));
      handleBlur(e);
    },
  });

  return [state, bind, isValid, isTouched, errorMessage, isFormValid, reset];
};

export default useInputValidation;
