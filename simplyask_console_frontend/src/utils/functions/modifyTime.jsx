import { getDayFromDateString } from '../helperFunctions';

export const modifyTimeStamp = (val, wrapToNextLine = false) => {
  const incidentDate = new Date(val);
  const currentDate = new Date();

  const diffTime = Math.abs(currentDate - incidentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // if (incidentDateDD === currentDateFormatted) {
  //   diffDays = diffDays - 1;
  // }
  let daysValue = 'days';

  if (diffDays === 1 || diffDays === 0) {
    daysValue = 'day';
  }

  if (wrapToNextLine) {
    return [`${getDayFromDateString(val)}`, `(${diffDays - 1} ${daysValue} old)`];
  }

  return `${getDayFromDateString(val)} (${diffDays - 1} ${daysValue} old)`;
};

export const dateWithoutTimeFromISOString = (ISODate) => {
  if (!ISODate) return;

  const dateString = ISODate.toString();
  const findLastHyphenIndex = dateString.lastIndexOf('T');
  const dateWithoutTime = dateString.slice(0, findLastHyphenIndex);

  return dateWithoutTime;
};

export const getFilterDate = (periodStartDate, periodEndDate, selectWorkFlow) => {
  if (!periodStartDate || !periodEndDate || !selectWorkFlow) return;

  return {
    source: selectWorkFlow.value,
    filterStartDate: dateWithoutTimeFromISOString(periodStartDate),
    filterEndDate: dateWithoutTimeFromISOString(periodEndDate),
  };
};
