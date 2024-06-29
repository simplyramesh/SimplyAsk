import {
  formatInTimeZone, format, utcToZonedTime, zonedTimeToUtc,
} from 'date-fns-tz';

import { theme } from '../../../config/theme';

export const filterEmptyValues = (filters, calendarKey) => {
  const filterKeys = Object.keys(filters);

  const filtered = filterKeys.reduce((acc, key) => {
    if (filters[key] == null || filters[key] === '') return acc;

    if (key === calendarKey) return acc;

    if ((Array.isArray(filters[key]) && filters[key].length > 0) || !Array.isArray(filters[key])) {
      acc[key] = filters[key];
    }

    return acc;
  }, {});

  return filtered;
};

/* Date and Time functions */
const getUserLocale = () => (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;

const userTimezone = (timezone) => Intl.DateTimeFormat().resolvedOptions().timeZone || timezone;

export const getTimezoneAbbreviation = (timeZone) => {
  if (!timeZone) return '';

  const zonedDate = utcToZonedTime(new Date(), timeZone);
  const formattedDate = format(zonedDate, 'zzzz', { timeZone });

  const parts = new Intl.DateTimeFormat(getUserLocale(), { timeZone, timeZoneName: 'short' })?.formatToParts(zonedDate);
  const timeZoneNamePart = parts?.find((part) => part.type === 'timeZoneName').value;

  const abbreviation = timeZoneNamePart || formattedDate?.split(' ')?.[0];

  return abbreviation;
};

export const getDateTimeUsingTimezone = (date, timezone, format) => {
  const timeFormat = format || 'MMM d, yyyy - h:mm aa';
  const currentUserTimezone = userTimezone(timezone);

  const utcDate = zonedTimeToUtc(date || new Date(), currentUserTimezone);
  const timezoneDate = formatInTimeZone(utcDate, currentUserTimezone, timeFormat);

  return timezoneDate;
};

/* Sidebar Stage InfoListItem functions */

const isStageEqual = (stage, currentStage) => stage.title.toLowerCase() === currentStage?.toLowerCase();

const visibility = (stage, currentStage) => {
  const visibilityValue = !isStageEqual(stage, currentStage)
    ? 'hidden'
    : 'visible';

  return visibilityValue;
};

const getStageColor = (stage, currentStage) => {
  const fontColor = !isStageEqual(stage, currentStage)
    ? theme.statusColors[stage.stageColor].color
    : theme.colors.white;

  return fontColor;
};

const getBgColor = (stage, currentStage) => {
  const bgColor = !isStageEqual(stage, currentStage)
    ? theme.statusColors[stage.stageColor].bg
    : theme.statusColors[stage.stageColor].color;

  return bgColor;
};

export const sidebarStagesSharedProps = (currentStage) => ({
  color: (stage) => getStageColor(stage, currentStage),
  bgColor: (stage) => getBgColor(stage, currentStage),
  visibility: (stage) => visibility(stage, currentStage),
});
