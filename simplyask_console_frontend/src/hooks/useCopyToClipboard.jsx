import {
  useCallback, useState, useEffect, useRef,
} from 'react';

const useCopyToClipboard = () => {
  const [state, setState] = useState({
    value: undefined,
    error: undefined,
    noUserInteraction: true,
  });

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const copyToClipboard = useCallback(async (value) => {
    const isValidType = typeof value === 'string' || typeof value === 'number';
    const isEmptyString = value === '';

    const invalidTypeText = !isValidType ? `Cannot copy typeof ${typeof value} to clipboard, must be a string or number` : undefined;
    const emptyStringText = isEmptyString ? 'Cannot copy empty string to clipboard.' : undefined;

    const errorText = invalidTypeText || emptyStringText;
    const error = errorText ? new Error(errorText) : undefined;

    if (error) {
      if (process.env.NODE_ENV === 'development') console.error(error);
      setState((prevState) => ({
        ...prevState, value, error, noUserInteraction: true,
      }));
      return;
    }

    try {
      await navigator.clipboard.writeText(value.toString());
      if (mountedRef.current) {
        setState({ value: value.toString(), error: undefined, noUserInteraction: false });
      }
    } catch (error) {
      if (mountedRef.current) {
        setState((prevState) => ({
          ...prevState, value: value.toString(), error, noUserInteraction: true,
        }));
      }
    }
  }, []);

  return { copiedState: state, copyToClipboard };
};

export default useCopyToClipboard;
