import { useReducer } from 'react';

const toggleReducer = (state, action) => (typeof action === 'boolean' ? action : !state);
const useToggle = (initialValue = false) => useReducer(toggleReducer, initialValue);

export default useToggle;
