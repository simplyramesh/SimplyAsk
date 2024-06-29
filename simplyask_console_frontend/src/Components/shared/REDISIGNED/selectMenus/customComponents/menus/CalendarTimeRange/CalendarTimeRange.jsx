import { getHours, getMinutes, parse } from 'date-fns';
import { useState } from 'react';

import { convert24to12 } from '../../../../../../../utils/timeUtil';
import { StyledFlex, StyledText } from '../../../../../styles/styled';

import {
  StyledAmPmSelect, StyledMenuItem, StyledTimeRangeInput,
} from './StyledCalendarTimeRange';

const getParsedTime = (dateTime, parseFormat = 'yyyy-MM-dd\'T\'HH:mm:ss') => {
  const parsedDate = parse(dateTime, parseFormat, new Date());
  const hours = getHours(parsedDate);
  const minutes = getMinutes(parsedDate);
  const AmPm = hours >= 12 ? 'PM' : 'AM';
  const twelveHrFormat = convert24to12(hours).hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return {
    hours: twelveHrFormat,
    minutes: formattedMinutes,
    AmPm,
  };
};

const validateTimeValue = (value, maxValue, maxValLength) => {
  if (value.length > maxValLength || !value.match(/^\d+$/)) return '';

  if (value > maxValue) return '00';

  return value;
};

const validateHours = (hours, is24hr = false) => {
  const formattedHours = is24hr ? hours : convert24to12(hours).hours?.toString();
  return validateTimeValue(formattedHours, is24hr ? 23 : 12, 2);
};

const validateMinutes = (minutes) => validateTimeValue(minutes, 59, 2);

const CalendarTimeRange = ({
  dateTimeRange, onChange, selectProps, parseFormat, color, borderColor,
}) => {
  const [hh, setHh] = useState(getParsedTime(dateTimeRange, parseFormat).hours);
  const [mm, setMm] = useState(getParsedTime(dateTimeRange, parseFormat).minutes);
  const [amPm, setAmPm] = useState(getParsedTime(dateTimeRange, parseFormat).AmPm);

  return (
    <StyledFlex
      direction="row"
      gap="0 8px"
      alignItems="flex-start"
    >
      <StyledFlex
        direction="row"
        alignItems="center"
        justifyContent="center"
        border={`1px solid ${borderColor}`}
        borderRadius="10px"
        width="80px"
        gap="0 10px"
        p="8px 0"
        height="41px"
      >
        <StyledTimeRangeInput
          autoComplete="off"
          tabIndex="-1"
          placeholder="00"
          textColor={color}
          value={hh}
          onChange={(e) => {
            const hourValue = validateHours(e.target.value);

            setHh(hourValue);
            onChange(`${hourValue}:${mm} ${amPm}`);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.target.focus();
          }}
          onFocus={() => selectProps?.onMenuInputFocus?.(true)}
          textAlign="right"
        />
        <StyledText size={15} lh={18} weight={600}>:</StyledText>
        <StyledTimeRangeInput
          tabIndex="-1"
          autoComplete="off"
          placeholder="00"
          textColor={color}
          value={mm}
          onChange={(e) => {
            const minValue = validateMinutes(e.target.value);

            setMm(minValue);
            onChange(`${hh}:${minValue} ${amPm}`);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.target.focus();
          }}
          onFocus={() => selectProps?.onMenuInputFocus?.(true)}
        />
      </StyledFlex>
      <StyledAmPmSelect
        tabIndex="-1"
        value={amPm}
        textColor={color}
        borderColor={borderColor}
        onChange={(e) => {
          setAmPm(e.target.value);
          onChange(`${hh}:${mm} ${e.target.value}`);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.target.focus();
        }}
        onFocus={() => selectProps?.onMenuInputFocus?.(true)}
        MenuProps={{
          sx: {
            zIndex: 9999,
          },
        }}
      >
        <StyledMenuItem value="AM">AM</StyledMenuItem>
        <StyledMenuItem value="PM">PM</StyledMenuItem>
      </StyledAmPmSelect>
    </StyledFlex>
  );
};

export default CalendarTimeRange;
