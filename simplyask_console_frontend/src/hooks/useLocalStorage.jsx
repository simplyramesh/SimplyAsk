import { useState, useEffect, useCallback } from 'react';

// This lets other tabs know when localStorage changes
const dispatchStorageEvent = (key, newValue) => {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
};

const setLocalStorageItem = (key, value) => {
  const stringifiedValue = JSON.stringify(value);
  localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key) => {
  localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key) => localStorage.getItem(key);

export const useLocalStorage = (key, initialValue) => {
  const [state, setState] = useState(() => {
    const storedValue = getLocalStorageItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const setLocalState = useCallback(
    (value) => {
      try {
        const nextState = typeof value === 'function' ? value(state) : value;
        nextState === null ? removeLocalStorageItem(key) : setLocalStorageItem(key, nextState);
        setState(nextState);
      } catch (e) {
        console.warn(e);
      }
    },
    [key, state],
  );

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setState(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  useEffect(() => {
    if (getLocalStorageItem(key) === null && initialValue !== undefined) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [state, setLocalState];
};
