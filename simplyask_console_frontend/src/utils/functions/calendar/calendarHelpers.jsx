/* eslint-disable radix */

import { getDescriptiveDateFromDateString } from '../../helperFunctions';

export const displayTime = (currentDateLocal, timeHour, timeMinute, timeAMPM, hideTimeStamps = false) => {
  const selectedDate = getDescriptiveDateFromDateString(currentDateLocal);
  if (hideTimeStamps) return selectedDate;

  let parsedMinutes = timeMinute ? parseInt(timeMinute) : 0;
  let parsedHour = timeHour ? parseInt(timeHour) : 0;

  if (parsedMinutes < 10) {
    parsedMinutes = `0${parsedMinutes}`;
  }
  if (parsedHour < 10 && timeAMPM === 'AM') {
    parsedHour = `0${parsedHour}`;
  }
  let formattedDate;
  if (timeAMPM === 'AM') {
    if (parsedHour === 0 || parsedHour === '00') {
      parsedHour = 12;
    }

    formattedDate = `${selectedDate} - ${parsedHour}:${parsedMinutes} AM`;
  } else {
    if (parsedHour === 0) {
      parsedHour = 12;
    }
    formattedDate = `${selectedDate} - ${parsedHour}:${parsedMinutes} PM`;
  }

  return formattedDate;
};

export const timeArray = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
];

export const getAMPMTimeOptions = () => {
  return timeArray.map((item) => ({
    label: item.label,
    value: item.value,
  }));
};
