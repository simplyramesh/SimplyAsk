import {
  parseISO, setHours, setMinutes, setSeconds,
} from 'date-fns';
import { PROCESS_TRIGGER_DATA_VALUE_SEPARATOR } from '../../ProcessTrigger/utils/constants';

export const convertToDateObject = (dateString) => {
  if (!dateString) return '';

  let date = parseISO(dateString);

  date = setHours(date, 23);
  date = setMinutes(date, 59);
  date = setSeconds(date, 0);

  return date;
};

export const multiSelectValueToArray = (val) =>
  val?.split(PROCESS_TRIGGER_DATA_VALUE_SEPARATOR)?.map((item) => (item ? { value: item } : null)) || [];

export const arrayToMultiSelectValue = (val) =>
  val?.map((item) => item.value)?.join(PROCESS_TRIGGER_DATA_VALUE_SEPARATOR) || null;