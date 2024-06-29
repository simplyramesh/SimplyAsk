import * as parser from 'cron-parser';
import {
  addMinutes,
  differenceInDays,
  endOfDay,
  format,
  formatDistanceToNow,
  formatRelative,
  isValid,
  parse,
  parseISO,
  startOfDay,
  subMonths,
} from 'date-fns';
import { getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { enUS } from 'date-fns/esm/locale';

import { days, daysIncluded, FREQUENCIES, frequencies, period, time } from './reporting';

export const BASE_TIME_FORMAT = 'h:mm a';
export const BASE_DATE_FORMAT = 'LLL d, yyyy';
export const TIME_24H_FORMAT = 'HH:mm';
export const TIME_12H_FROMAT = 'hh:mm a';
export const TIME_12H_FROMAT_UTC = 'hh:mm a zz';
export const BASE_DATE_TIME_12H_FORMAT = 'LLL d, yyyy hh:mm a';

export const ISO_UTC_DATE_FORMAT = 'yyyy-MM-dd';
export const ISO_UTC_DATE_AND_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";

export const BASE_DATE_TIME_FORMAT = `${BASE_DATE_FORMAT} - ${BASE_TIME_FORMAT}`;

const timeDifference = (timezone) => {
  let timeDifference;

  switch (timezone) {
    case 'PST':
      timeDifference = 8;
      break;
    case 'PDT':
      timeDifference = 7;
      break;
    case 'MST':
      timeDifference = 7;
      break;
    case 'MDT':
      timeDifference = 6;
      break;
    case 'CST':
      timeDifference = 6;
      break;
    case 'CDT':
      timeDifference = 5;
      break;
    case 'EST':
      timeDifference = 5;
      break;
    case 'EDT':
      timeDifference = 4;
      break;
    case 'AST':
      timeDifference = 4;
      break;
    case 'NST':
      timeDifference = 3.5;
      break;
    case 'ADT':
      timeDifference = 3;
      break;
    case 'NDT':
      timeDifference = 2.5;
      break;
    case 'UTC':
      timeDifference = 0;
      break;
    default:
  }

  return timeDifference;
};

export const convertFromToFormat = (value, fromFormat, toFormat) => {
  const parsedDate = parse(value, fromFormat, new Date());

  if (isValid(parsedDate)) {
    return format(parsedDate, toFormat);
  }

  return null;
};

export const convert12To24 = ({ hours, minutes: m, AmPm }) => {
  let h = +hours;

  if (AmPm.value === 'pm' && +hours < 12) h = +hours + 12;
  if (AmPm.value === 'am' && +hours === 12) h = +hours - 12;

  if (!hours || !m) return { h: 0, m: 0 };

  return { h, m: +m };
};

export const convert24to12 = (hours, minutes) => {
  const h = hours % 12 || 12;
  const AmPm = hours < 12 || hours === 24 ? 'am' : 'pm';

  return {
    hours: h,
    minutes,
    AmPm: time.find((i) => i.value === AmPm),
  };
};

export const getCronExpressionInterval = (cronExpression) => {
  try {
    const interval = parser.parseExpression(cronExpression);
    return interval;
  } catch {
    return null;
  }
};

export const getSubsequenceStep = (arr) => {
  if (arr.length <= 1) return -1;

  const set = new Set();
  let step = 1;

  if (arr.length > 1) {
    step = arr[1] - arr[0];

    if (step === 1) return -1;

    arr.forEach((i) => set.add(i));
  }

  return set.size === 1 ? -1 : step;
};

export const getParsedFrequencyItems = (cronExpression) => {
  const interval = getCronExpressionInterval(cronExpression);

  if (!interval) return null;

  const { minute, hour, dayOfWeek, dayOfMonth, month } = interval.fields;
  const [h] = hour;
  const [m] = minute;
  const { hours, minutes, AmPm } = convert24to12(h, m);

  let type = '';
  let onDay = 1;
  let every = 1;
  let weekDays = [];
  let frPeriod = period[0];

  const dayStep = getSubsequenceStep(dayOfMonth);
  const monthStep = getSubsequenceStep(month);

  if (dayStep > 0 || monthStep > 0) {
    if (dayOfMonth?.length > 1 && ![28, 29, 30, 31].includes(dayOfMonth?.length)) {
      if (dayStep > 0 && dayStep !== 1) {
        type = frequencies.find((f) => f.value === FREQUENCIES.CUSTOM_FREQUENCY);
        every = dayStep;
        frPeriod = period[0];
      }
    }

    if (month?.length > 1) {
      if (monthStep > 0 && monthStep !== 1) {
        type = frequencies.find((f) => f.value === FREQUENCIES.CUSTOM_FREQUENCY);
        every = monthStep;
        frPeriod = period[1];
        weekDays = dayOfWeek.map((d) => days.find((i) => d === i.value));
      }
    }
  } else if (dayOfMonth.length === 1) {
    type = frequencies.find((f) => f.value === FREQUENCIES.MONTHLY);
    onDay = dayOfMonth[0];
  } else if (dayOfWeek?.length === 8) {
    type = frequencies.find((f) => f.value === FREQUENCIES.DAILY);
  } else if (dayOfWeek?.length === 5 && dayOfWeek.join('') === '12345') {
    type = frequencies.find((f) => f.value === FREQUENCIES.WEEKLY);
  } else if (dayOfWeek?.length === 2 && dayOfWeek.join('') === '06') {
    type = frequencies.find((f) => f.value === FREQUENCIES.WEEKEND);
  } else if (dayOfWeek?.length > 0) {
    type = frequencies.find((f) => f.value === FREQUENCIES.CUSTOM_DAYS);
    weekDays = dayOfWeek.map((d) => days.find((i) => d === i.value));
  }

  return {
    fields: interval.fields,
    daysIncluded: daysIncluded[1],
    frequency: {
      type,
      time: {
        hours,
        minutes,
        AmPm,
      },
      days: weekDays,
      period: frPeriod,
      every,
      onDay,
    },
  };
};

const getInFormattedUserTimezone = (date, timezone, formatTemplate) => {
  if (!date) return '';

  const dateInTimezone = utcToZonedTime(new Date(date), timezone);

  return format(dateInTimezone, formatTemplate || 'LLL d, yyyy - h:mma');
};

const getFormattedTimeToNow = (date, timezone) => {
  if (!date) return '---';

  const dateInTimezone = utcToZonedTime(new Date(date), timezone);

  return formatDistanceToNow(dateInTimezone, { addSuffix: true });
};

const getSubtractedMonthsInUtc = ({
  endDate,
  monthsToSubtract = 0,
  formatTemplate = "yyyy-MM-dd'T'HH:mm:ss.SS'Z'",
}) => {
  const end = !endDate ? endOfDay(new Date()) : endOfDay(new Date(endDate));
  const subtractedMonths = subMonths(end, monthsToSubtract);
  const start = startOfDay(subtractedMonths);

  return {
    startDate: format(start, formatTemplate),
    endDate: format(end, formatTemplate),
  };
};

const setTimezone = (date, newTimezone) => {
  if (!date) {
    return date;
  }

  const dateWithoutTimezone = zonedTimeToUtc(date);
  const offset = getTimezoneOffset(newTimezone);

  let dateInNewTimezone = new Date(dateWithoutTimezone.getTime() - offset);

  return dateInNewTimezone;
};

const convertIsoWithOffsetToIso = (date, timezone, formatTemplate = "yyyy-MM-dd'T'HH:mm:ss.SS'Z'") => {
  const dateObject = parseISO(date ?? new Date().toISOString());
  const offset = !dateObject
    ? utcToZonedTime(new Date(), timezone).getTimezoneOffset()
    : dateObject.getTimezoneOffset();

  return format(addMinutes(dateObject, offset), formatTemplate);
};

const getDaysLeft = ({ endDate, startDate = null }, timezone) => {
  const zonedDate = startDate ? parseISO(startDate) : zonedTimeToUtc(new Date(), timezone);
  const start = startOfDay(zonedDate);
  const end = parseISO(endDate);
  const daysLeft = differenceInDays(end, start);

  if (!daysLeft) return 0;

  return daysLeft;
};

const formatDateOrRelative = (timestamp, timezone, relativeLocaleFormat = {}) => {
  const formatRelativeLocale = {
    lastWeek: 'LLL d, yyyy - h:mmaaa',
    yesterday: "'Yesterday' h:mmaaa",
    today: "'Today' h:mmaaa",
    other: 'LLL d, yyyy - h:mmaaa',
    ...relativeLocaleFormat,
  };

  const locale = {
    ...enUS,
    formatRelative: (token) => formatRelativeLocale[token],
  };

  const inUserTimezone = getInFormattedUserTimezone(timestamp, timezone, "yyyy-MM-dd'T'HH:mm:ss");
  const targetDate = parseISO(inUserTimezone);

  return formatRelative(targetDate, new Date(), { locale });
};

const formatLocalTime = (dateTimeString, formatTemplate = 'LLL d, yyyy - h:mma') => {
  if (!dateTimeString) return '';

  const localDateTime = new Date(dateTimeString);

  return format(localDateTime, formatTemplate);
};

const convertDateStringToUTCFormat = (dateTimeValue) => {
  if (!dateTimeValue) return null;

  const date = parseISO(dateTimeValue);
  const UTCTime = zonedTimeToUtc(date, 'UTC').toISOString();
  return UTCTime;
};

export {
  convertDateStringToUTCFormat,
  convertIsoWithOffsetToIso,
  formatDateOrRelative,
  formatLocalTime,
  getDaysLeft,
  getFormattedTimeToNow,
  getInFormattedUserTimezone,
  getSubtractedMonthsInUtc,
  setTimezone,
  timeDifference,
};

