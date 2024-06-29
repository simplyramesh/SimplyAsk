import React, { useState, useEffect } from 'react';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import Checkbox from '../../../../../../shared/REDISIGNED/controls/Checkbox/Checkbox';
import Switch from '../../../../../../SwitchWithText/Switch';
import CustomAvailabilityTimeRange from './CustomAvailabilityTimeRange';
import { extractTimeInfo, isUndefined } from '../../../utils/helpers';
import { onlyNumberRegex } from '../../../utils/validationSchemas';
import { ELEVEN_FIFTY_NINE_PM, FIVE_PM, NINE_AM, TWELVE_AM } from '../../../constants/common';
import { validateTimeRange } from '../../../utils/helpers';

const TIME_TYPE = {
  START_TIME: 'startTime',
  END_TIME: 'endTime',
};

const isStartTime = (type) => type === TIME_TYPE.START_TIME;

const CustomAvailabilitySetting = ({
  day,
  index,
  weekStartTime,
  weekEndTime,
  setIsValidCustomAvailabilityTimeRange,
  isValidCustomAvailabilityTimeRange,
  onChange,
}) => {
  const currentStartTime = weekStartTime[index];
  const currentEndTime = weekEndTime[index];

  const getIsEnabled = () => !isUndefined(currentStartTime);

  const getIsAllDay = () => isAllDay(index, weekStartTime, weekEndTime);

  const getStartTimeModel = () => ({
    hour: extractTimeInfo(currentStartTime)?.hour ?? '9',
    minute: extractTimeInfo(currentStartTime)?.minute ?? '00',
    amPm: extractTimeInfo(currentStartTime)?.amPm ?? 'AM',
    time: currentStartTime ?? NINE_AM,
  });

  const getEndTimeModel = () => ({
    hour: extractTimeInfo(currentEndTime)?.hour ?? '5',
    minute: extractTimeInfo(currentEndTime)?.minute ?? '00',
    amPm: extractTimeInfo(currentEndTime)?.amPm ?? 'PM',
    time: currentEndTime ?? FIVE_PM,
  });

  const [enabled, setEnabled] = useState(getIsEnabled());
  const [isAllDayTime, setIsAllDayTime] = useState(getIsAllDay());

  const [startTime, setStartTime] = useState(getStartTimeModel());
  const [endTime, setEndTime] = useState(getEndTimeModel());

  const [isCurrentTimeRangeValid, setIsCurrentTimeRangeValid] = useState(true);

  useEffect(() => {
    setEnabled(getIsEnabled());
    setIsAllDayTime(getIsAllDay());
    setStartTime(getStartTimeModel());
    setEndTime(getEndTimeModel());
  }, [weekStartTime, weekEndTime]);

  const getCurrentTimeByType = (type) => (isStartTime(type) ? startTime : endTime);
  const getCurrentWeekTimeByType = (type) => [...(isStartTime(type) ? weekStartTime : weekEndTime)];

  const onMinuteChangeHandler = (e, timeType) => {
    const currentTime = getCurrentTimeByType(timeType);
    const currentWeekTime = getCurrentWeekTimeByType(timeType);

    const updatedMinute = validateTimeValue(e.target.value, 59, 2);
    const updatedTime = `${currentTime.hour}:${updatedMinute} ${currentTime.amPm}`;

    currentWeekTime.splice(index, 1, updatedTime);

    onChange({
      [timeType]: currentWeekTime,
    });
  };

  const onHourChangeHandler = (e, timeType) => {
    const currentTime = getCurrentTimeByType(timeType);
    const currentWeekTime = getCurrentWeekTimeByType(timeType);

    const updatedHour = validateTimeValue(e.target.value, 12, 2);
    const updatedTime = `${updatedHour}:${currentTime.minute} ${currentTime.amPm}`;

    currentWeekTime.splice(index, 1, updatedTime);

    onChange({
      [timeType]: currentWeekTime,
    });
  };

  const onAmPmChangeHandler = (e, timeType) => {
    const currentTime = getCurrentTimeByType(timeType);
    const currentWeekTime = getCurrentWeekTimeByType(timeType);

    const updatedTime = `${currentTime.hour}:${currentTime.minute} ${e.target.value}`;

    currentWeekTime.splice(index, 1, updatedTime);

    onChange({
      [timeType]: currentWeekTime,
    });
  };

  const onMinutesBlurHandler = (e, timeType) => {
    const currentTime = getCurrentTimeByType(timeType);
    const currentWeekTime = getCurrentWeekTimeByType(timeType);

    const inputMinute = e.target.value;
    const updatedMinute = inputMinute.length === 1 ? `0${inputMinute}` : inputMinute;
    const updatedTime = `${currentTime.hour}:${updatedMinute} ${currentTime.amPm}`;

    currentWeekTime.splice(index, 1, updatedTime);

    onChange({
      [timeType]: currentWeekTime,
    });
  };

  const commonSwitchCheckBoxChangeHandler = (
    condition,
    truthyStartTime,
    truthyEndTime,
    falsyStartTime,
    falsyEndTime
  ) => {
    const updatedStartTimesArray = [...weekStartTime];
    updatedStartTimesArray.splice(index, 1, condition ? falsyStartTime : truthyStartTime);

    const updatedEndTimesArray = [...weekEndTime];
    updatedEndTimesArray.splice(index, 1, condition ? falsyEndTime : truthyEndTime);

    onChange({
      startTime: updatedStartTimesArray,
      endTime: updatedEndTimesArray,
    });
  };

  useEffect(() => {
    const isValid = validateTimeRange(startTime, endTime);
    setIsCurrentTimeRangeValid(isValid);
    const updatedIsValidTimeRangeArr = [...isValidCustomAvailabilityTimeRange];
    updatedIsValidTimeRangeArr.splice(index, 1, isValid);
    setIsValidCustomAvailabilityTimeRange(updatedIsValidTimeRangeArr);
  }, [startTime, endTime]);

  return (
    <>
      <StyledFlex display="flex" flexDirection="row" alignItems="center" height="40px">
        <StyledFlex direction="row" gap="9px">
          <Checkbox
            checkValue={enabled}
            onChange={() => {
              commonSwitchCheckBoxChangeHandler(enabled, startTime.time, endTime.time, undefined, undefined);
            }}
            sx={{ padding: '0px' }}
          />
          <StyledText size="15" width="110px" height="18px" p="0px 20px 0px 0px">
            {day}
          </StyledText>
        </StyledFlex>

        <StyledFlex direction="row" gap="10px" alignItems="center">
          <Switch
            checked={isAllDayTime}
            activeLabel=""
            inactiveLabel=""
            onChange={() => {
              if (enabled) {
                commonSwitchCheckBoxChangeHandler(isAllDayTime, TWELVE_AM, ELEVEN_FIFTY_NINE_PM, NINE_AM, FIVE_PM);
              }
            }}
            disabled={!enabled}
          />
          <StyledText weight={500} width="80px">
            All Day
          </StyledText>
        </StyledFlex>

        {!isAllDayTime && (
          <StyledFlex direction="row"  gap="20px" alignItems="center" display="flex">
            <CustomAvailabilityTimeRange
              hours={startTime.hour}
              minutes={startTime.minute}
              amPm={startTime.amPm}
              onHourChange={(e) => onHourChangeHandler(e, TIME_TYPE.START_TIME)}
              onMinuteChange={(e) => onMinuteChangeHandler(e, TIME_TYPE.START_TIME)}
              onAmPmChange={(e) => onAmPmChangeHandler(e, TIME_TYPE.START_TIME)}
              onMinutesBlur={(e) => onMinutesBlurHandler(e, TIME_TYPE.START_TIME)}
              disabled={!enabled}
              isCurrentTimeRangeValid={isCurrentTimeRangeValid}
            />

            <StyledText weight={600}>to</StyledText>

            <CustomAvailabilityTimeRange
              hours={endTime.hour}
              minutes={endTime.minute}
              amPm={endTime.amPm}
              onHourChange={(e) => onHourChangeHandler(e, TIME_TYPE.END_TIME)}
              onMinuteChange={(e) => onMinuteChangeHandler(e, TIME_TYPE.END_TIME)}
              onAmPmChange={(e) => onAmPmChangeHandler(e, TIME_TYPE.END_TIME)}
              onMinutesBlur={(e) => onMinutesBlurHandler(e, TIME_TYPE.END_TIME)}
              disabled={!enabled}
              isCurrentTimeRangeValid={isCurrentTimeRangeValid}
            />
          </StyledFlex>
        )}
      </StyledFlex>
    </>
  );
};

const validateTimeValue = (value, maxValue, maxValLength) => {
  if (value.length > maxValLength || !value.match(onlyNumberRegex)) return '';

  if (value > maxValue) return '00';

  return value;
};

const isAllDay = (index, customStartTimesArray, customEndTimesArray) => {
  const timeStr = customStartTimesArray[index] + ' - ' + customEndTimesArray[index];
  return timeStr === `${TWELVE_AM} - ${ELEVEN_FIFTY_NINE_PM}`;
};

export default CustomAvailabilitySetting;
