import { setWith, clone } from 'lodash';

export const removeProperty = (prop) => ({ [prop]: _, ...rest }) => rest;

export const setIn = (obj, path, value) => setWith(clone(obj), path, value, clone);
