import { memo, useEffect, useState } from 'react';

import { DAYS_OF_WEEK } from '../../../../../Settings/Components/FrontOffice/constants/common';
import Checkbox from '../../../../../shared/REDISIGNED/controls/Checkbox/Checkbox';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import RadioGroupSet from '../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import { StyledFlex, StyledRadio, StyledText } from '../../../../../shared/styles/styled';
import { EXECUTES_WHEN, REPEATER_TYPE } from '../../../../utils/constants';
import {
  getStartsOnInitialVal, getEndsOnInitialVal, getEndDateFinalVal, getStartDateFinalVal,
} from '../../../../utils/initialValueHelpers';
import ProcessExecutionDetailsCalendar from '../ProcessExecutionDetailsCalendar/ProcessExecutionDetailsCalendar';

const ProcessExecutionDetailsWeekly = ({
  onChange,
  valueExecutionDetailsStep3,
  editModeData,
}) => {
  const getWeeklySubRepeaterInitialVal = () => {
    const subrepeater = valueExecutionDetailsStep3?.executionTime?.repeater?.subrepeater?.value;

    return DAYS_OF_WEEK.map((day, index) => ({
      value: day,
      isEnabled: subrepeater?.length > 0 ? subrepeater.includes(day) : index === 0,
    }));
  };

  const [startsOn, setStartsOn] = useState(getStartsOnInitialVal(editModeData));
  const [endsOn, setEndsOn] = useState(getEndsOnInitialVal(editModeData, valueExecutionDetailsStep3));
  const [onDays, setOnDays] = useState(getWeeklySubRepeaterInitialVal());

  const [startDate, setStartDate] = useState(getStartDateFinalVal(valueExecutionDetailsStep3));
  const [endDate, setEndDate] = useState(getEndDateFinalVal(valueExecutionDetailsStep3));

  const getEnabledCount = () => onDays?.filter((day) => day.isEnabled).length;

  const onDayChange = (changeDay) => {
    if (getEnabledCount() === 1 && changeDay.isEnabled) {
      return;
    }

    setOnDays((prev) => prev.map((day) => (changeDay.value === day.value ? { ...day, isEnabled: !changeDay.isEnabled } : day)));
  };

  useEffect(() => {
    const repeatDays = onDays
      .filter(({ isEnabled }) => isEnabled)
      .map(({ value }) => value);

    const payload = {
      startsNow: startsOn === EXECUTES_WHEN.NOW,
      neverEnds: endsOn === EXECUTES_WHEN.NEVER,
      repeater: {
        type: REPEATER_TYPE.WEEK,
        value: 1,
        subrepeater: {
          value: repeatDays,
        },
      },
      startDate,
      endDate,
    };

    onChange(payload);
  }, [startsOn, endsOn, startDate, endDate, onDays]);

  return (
    <StyledFlex gap="16px">
      <StyledFlex direction="row" alignItems="center" gap="20px">
        <InputLabel label="When:" mb={0} />

        <StyledFlex direction="row" alignItems="center" gap="8px" fontSize="15px">
          Every week
        </StyledFlex>
      </StyledFlex>

      <StyledFlex direction="row" alignItems="center" gap="20px">
        <InputLabel label="On:" mb={0} />
        <StyledFlex direction="row" gap="20px">
          { onDays.map((day, index) => (
            <StyledFlex direction="row" alignItems="center" key={index}>
              <Checkbox checkValue={day.isEnabled} onChange={() => onDayChange(day)} />
              <StyledText>
                {day.value}
              </StyledText>
            </StyledFlex>
          ))}
        </StyledFlex>
      </StyledFlex>

      <StyledFlex direction="row" alignItems="center" gap="20px">
        <InputLabel label="Starts on:" mb={0} />
        {!editModeData
        && (
          <RadioGroupSet
            row
            name="startsOn"
            value={startsOn}
            onChange={(e) => setStartsOn(e.target.value)}
          >
            <StyledRadio
              value={EXECUTES_WHEN.NOW}
              label="Execute Now"
              size={15}
            />

            <StyledRadio
              value={EXECUTES_WHEN.DATE}
              label="Schedule for Later"
              size={15}
            />
          </RadioGroupSet>
        )}

        <StyledFlex width="265px">
          <ProcessExecutionDetailsCalendar
            isDisabled={startsOn === EXECUTES_WHEN.NOW}
            placeholder="Select Start Date & Time"
            onChange={(e) => setStartDate(e)}
            value={startDate}
            minDate={new Date()}
          />
        </StyledFlex>
      </StyledFlex>

      <StyledFlex direction="row" alignItems="center" gap="20px">
        <InputLabel label="Ends on:" mb={0} />
        <RadioGroupSet
          row
          name="endsOn"
          value={endsOn}
          onChange={(e) => setEndsOn(e.target.value)}
        >
          <StyledRadio
            value={EXECUTES_WHEN.NEVER}
            label="Execute Indefinitely"
            size={15}
          />

          <StyledRadio
            value={EXECUTES_WHEN.DATE}
            label="Execute until"
            size={15}
          />
        </RadioGroupSet>

        <StyledFlex width="265px">
          <ProcessExecutionDetailsCalendar
            isDisabled={endsOn === EXECUTES_WHEN.NEVER}
            placeholder="Select End Date & Time"
            onChange={(e) => setEndDate(e)}
            value={endDate}
            minDate={startDate || new Date()}
          />
        </StyledFlex>
      </StyledFlex>
    </StyledFlex>
  );
};

export default memo(ProcessExecutionDetailsWeekly);
