import {
  useCallback, useMemo, useRef, useState,
} from 'react';

const useStateWithValidation = (validator, initialValue, message = '') => {
  const [state, setState] = useState(initialValue);

  const touched = useRef({});

  const isValid = useMemo(() => {
    return Object.entries(validator).reduce((acc, [key, validationFn]) => {
      acc[key] = validationFn(state[key]);

      return acc;
    }, {});
  }, [state, validator]);

  const errorMessage = useMemo(() => {
    return Object.entries(message).reduce((acc, [key, messageFn]) => {
      acc[key] = !isValid[key] ? messageFn(state[key]) : '';

      return acc;
    }, {});
  }, [state, isValid, message]);

  const handleBlur = useCallback((e) => {
    touched.current = { ...touched.current, [e.target.name]: true };

    setState((prev) => ({ ...prev })); // force re-render to show error message
  }, []);

  const isTouched = useMemo(() => {
    // eslint-disable-next-line no-unused-vars
    return Object.entries(validator).reduce((acc, [key, _validationFn]) => {
      touched.current[key] = touched.current[key] || false;

      acc[key] = touched.current[key] && !isValid[key];

      return acc;
    }, {});
  }, [touched, validator, isValid]);

  const isFormValid = useMemo(() => Object.values(isValid).every((value) => value === true), [isValid]);

  const reset = useCallback(() => {
    touched.current = {};
    setState(initialValue);
  }, [initialValue]);

  return [state, setState, isValid, isTouched, errorMessage, isFormValid, handleBlur, reset];
};

export default useStateWithValidation;
