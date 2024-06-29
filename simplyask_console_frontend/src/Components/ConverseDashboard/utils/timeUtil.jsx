import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  differenceInCalendarDays,
  differenceInDays,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  parseISO,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfYear,
} from 'date-fns';
import { FREQUENCY_TYPES, FREQUENCY_TYPE_VALUES } from './constants';

export const CALENDAR_FILTER_LABEL_FORMAT = 'MMMM d, yyyy';
export const ISO_START_DAY_FORMAT = "yyyy-MM-dd'T'00:00:00";
export const ISO_END_DAY_FORMAT = "yyyy-MM-dd'T'23:59:59";

export const getDaysDifference = (date1String, date2String) => {
  const DEFAULT_DIFF = 1;

  const date1 = parseISO(date1String);
  const date2 = parseISO(date2String);

  return date1 && date2 ? differenceInDays(date2, date1) : DEFAULT_DIFF;
};

export const getMonthDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = parseISO(startDate);
  const end = parseISO(endDate);

  return Math.abs(differenceInMonths(start, end));
};

export const getTimeFormat = (increment) => {
  const formatMap = {
    [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.ONE_MINUTE]]: 'HH:mm',
    [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.THIRTY_MINUTE]]: 'HH:mm',
    [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.HOURLY]]: 'HH:mm',
    [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.DAILY]]: 'LLL dd',
    [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.MONTHLY]]: 'LLL',
    [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.YEARLY]]: 'yyyy',
  };

  return formatMap[increment] || 'LLL dd - HH:mm';
};

export const roundDownTime = (date, increment) => {
  switch (increment) {
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.YEARLY]:
    return startOfYear(date);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.MONTHLY]:
    return startOfMonth(date);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.DAILY]:
    return startOfDay(date);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.HOURLY]:
    return startOfHour(date);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.THIRTY_MINUTE]:
    return date.getMinutes() < 30 ? startOfHour(date) : addMinutes(startOfHour(date), 30);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.ONE_MINUTE]:
    return startOfMinute(date);
  default:
    return date;
  }
};

export const getNumOfIntervals = (startDate, endDate, incrementType) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const dayDiff = differenceInCalendarDays(end, start) + 1;

  const dayDifference = getDaysDifference(startDate, endDate) + 1;
  const isMoreThanOneDay = dayDifference > 0;

  switch (incrementType) {
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.ONE_MINUTE]:
    return differenceInMinutes(end, start);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.THIRTY_MINUTE]:
    return isMoreThanOneDay ? Math.ceil(dayDifference * 48) : 48;
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.HOURLY]:
    return isMoreThanOneDay ? Math.ceil(dayDifference * 24) : 24;
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.DAILY]:
    return isMoreThanOneDay ? dayDifference : 1;
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.MONTHLY]:
    return differenceInMonths(end, start) + 1;
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.YEARLY]:
    return differenceInYears(end, start) + 1;
  default:
    return dayDiff;
  }
};

const addTimeIncrement = (date, frequency) => {
  switch (frequency) {
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.ONE_MINUTE]:
    return addMinutes(date, 1);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.THIRTY_MINUTE]:
    return addMinutes(date, 30);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.HOURLY]:
    return addHours(date, 1);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.DAILY]:
    return addDays(date, 1);
  case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.MONTHLY]:
    return addMonths(date, 1);
  default:
    return addMinutes(date, 0);
  }
};

export const generateTicksArr = (num, startDate, frequency) => {
  if (!num || !startDate) return [];

  const start = parseISO(startDate);
  const datesArr = new Array(num);

  for (let i = 0; i <= num; i++) {
    const date = i === 0 ? start : addTimeIncrement(datesArr[i - 1].date, frequency);
    datesArr[i] = { date, dateStr: date.toISOString() };
  }

  return datesArr;
};

export const generateTimeFrequency = (startDate, endDate, increment) => {
  const start = increment === FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.MONTHLY]
    ? startOfMonth(parseISO(startDate)).toISOString()
    : startDate;

  const numOfIntervals = getNumOfIntervals(start, endDate, increment);

  return generateTicksArr(numOfIntervals, start, increment);
};

const timeFrequencyFormatMap = {
  [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.ONE_MINUTE]]: 'LLLL dd, yyyy - HH:mm',
  [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.THIRTY_MINUTE]]: 'LLLL dd, yyyy - HH:mm',
  [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.HOURLY]]: 'LLLL dd, yyyy - HH:mm',
  [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.DAILY]]: 'LLLL dd, yyyy',
  [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.MONTHLY]]: 'LLLL yyyy',
  [FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.YEARLY]]: 'yyyy',
};

export const groupDataByIncrement = (data, dataKey, increment, { channel, start, end, tooltipLabel }) => {
  const groupedData = data.reduce((acc, item) => {
    const keys = Array.isArray(dataKey) ? dataKey : [dataKey];
    const roundedTime = roundDownTime(parseISO(item.startTime), increment).toISOString();

    if (!acc[roundedTime]) {
      acc[roundedTime] = { startTime: roundedTime, channel, tooltipLabel };

      keys.forEach((k) => {
        acc[roundedTime][k] = 0;
      });
    }

    keys.forEach((k) => {
      if (k === 'openItems' || k === 'closedItems') {
        acc[roundedTime][k] = acc[roundedTime][k] < item[k] ? item[k] : acc[roundedTime][k];
        return;
      }

      acc[roundedTime][k] += item[k];
    });

    return acc;
  }, {});

  const newData = Object.values(groupedData);

  const newDataKeys = Object.keys(newData[0] || {});
  const newDataKeyValues = newDataKeys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  return generateTimeFrequency(start, end, increment).map((tick) => {
    const tickData = newData.find((item) => item.startTime === tick.dateStr) ?? newDataKeyValues;

    return {
      ...tickData,
      startTime: tick.dateStr,
      channel,
      timeFormat: timeFrequencyFormatMap[increment],
      tooltipLabel,
    };
  });
};

export const mergeDataSets = (data) => {
  const { chartDataList, movingAverageList } = data || {};

  const mergedData = chartDataList.map((chartData) => {
    const movingAverageData = movingAverageList.find((ma) => ma.timeStamp === chartData.startTime);
    return {
      ...chartData,
      movingAverage: movingAverageData ? movingAverageData.movingAverage : 0,
    };
  });

  return mergedData;
};

export const convertSecondsToHours = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
  const seconds = Math.round(timeInSeconds - (hours * 3600) - (minutes * 60));

  if (hours > 0) {
    const addHour = minutes > 30 ? hours + 1 : hours;
    return `${addHour} hour${addHour > 1 ? 's' : ''} `;
  }
  if (minutes > 0) {
    const addOneMinute = seconds > 30 ? minutes + 1 : minutes;
    return `${addOneMinute} minute${addOneMinute > 1 ? 's' : ''} `;
  }
  if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? 's' : ''} `;
  }

  return '0 mins';
};
