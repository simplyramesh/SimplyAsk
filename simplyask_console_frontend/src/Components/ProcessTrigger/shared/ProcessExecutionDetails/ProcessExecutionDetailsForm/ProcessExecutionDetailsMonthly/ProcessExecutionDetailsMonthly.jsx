import { memo, useEffect, useState } from 'react';

import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import RadioGroupSet from '../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledRadio } from '../../../../../shared/styles/styled';
import {
  EXECUTES_WHEN,
  REPEATER_TYPE,
  REPEATER_REGEX,
  EXECUTES_ON,
  DAY_OF_WEEK_REPEATER_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
  getMonthDay,
  CRON_EXPRESSION_CONSTANTS,
  getDayOfMonthsOptions,
} from '../../../../utils/constants';
import {
  getStartsOnInitialVal, getEndsOnInitialVal, getEndDateFinalVal, getStartDateFinalVal, getRepeaterVal,
} from '../../../../utils/initialValueHelpers';
import ProcessExecutionDetailsCalendar from '../ProcessExecutionDetailsCalendar/ProcessExecutionDetailsCalendar';

const ProcessExecutionDetailsMonthly = ({ onChange, editModeData, valueExecutionDetailsStep3 }) => {
  const [startsOn, setStartsOn] = useState(getStartsOnInitialVal(editModeData));
  const [endsOn, setEndsOn] = useState(getEndsOnInitialVal(editModeData, valueExecutionDetailsStep3));

  const [repeaterValue, setRepeaterValue] = useState(getRepeaterVal(valueExecutionDetailsStep3));

  const [startDate, setStartDate] = useState(getStartDateFinalVal(valueExecutionDetailsStep3));
  const [endDate, setEndDate] = useState(getEndDateFinalVal(valueExecutionDetailsStep3));
  const [executesOn, setExecutesOn] = useState(valueExecutionDetailsStep3?.executionTime?.repeater?.subrepeater?.type || EXECUTES_ON.DAY_OF_MONTH);

  const getCurrentDayOfMonthOption = () => {
    const currentDay = parseInt(getMonthDay(new Date()));

    return getDayOfMonthsOptions(0)[currentDay - 1];
  };

  const [dayOfMonth, setDayOfMonth] = useState(getCurrentDayOfMonthOption());
  const [dayOfWeek, setDayOfWeek] = useState(DAY_OF_WEEK_OPTIONS.find(({ value }) => value === CRON_EXPRESSION_CONSTANTS.DAY));
  const [dayOfWeekRepeater, setDayOfWeekRepeater] = useState(DAY_OF_WEEK_REPEATER_OPTIONS[0]);

  useEffect(() => {
    const payload = {
      startsNow: startsOn === EXECUTES_WHEN.NOW,
      neverEnds: endsOn === EXECUTES_WHEN.NEVER,
      repeater: {
        type: REPEATER_TYPE.MONTH,
        value: repeaterValue,
        subrepeater: {
          type: executesOn,
          ...(executesOn === EXECUTES_ON.DAY_OF_MONTH
            ? { value: dayOfMonth.value.toString() }
            : { value: [dayOfWeekRepeater.value, dayOfWeek.value] }
          ),
        },
      },
      startDate,
      endDate,
    };

    onChange(payload);
  }, [startsOn, endsOn, repeaterValue, executesOn, startDate, endDate, dayOfMonth, dayOfWeek, dayOfWeekRepeater]);

  const DayOfMonthSelect = () => (
    <StyledFlex width="100px">
      <CustomSelect
        options={getDayOfMonthsOptions(0)}
        value={dayOfMonth}
        closeMenuOnSelect
        closeMenuOnScroll
        isClearable={false}
        isSearchable
        onChange={(val) => setDayOfMonth(val)}
        isDisabled={executesOn === EXECUTES_ON.DAY_OF_WEEK}
        maxMenuHeight={174}
        form
        menuPlacement="auto"
      />
    </StyledFlex>
  );

  const DayOfWeekSelect = () => (
    <>
      <StyledFlex width="220px">
        <CustomSelect
          options={DAY_OF_WEEK_REPEATER_OPTIONS}
          value={dayOfWeekRepeater}
          onChange={(val) => setDayOfWeekRepeater(val)}
          closeMenuOnSelect
          closeMenuOnScroll
          isClearable={false}
          isSearchable={false}
          isDisabled={executesOn === EXECUTES_ON.DAY_OF_MONTH}
          maxHeight={30}
          form
          menuPlacement="auto"
        />
      </StyledFlex>

      <StyledFlex width="220px">
        <CustomSelect
          options={DAY_OF_WEEK_OPTIONS}
          value={dayOfWeek}
          onChange={(val) => setDayOfWeek(val)}
          closeMenuOnSelect
          closeMenuOnScroll
          isClearable={false}
          isSearchable={false}
          isDisabled={executesOn === EXECUTES_ON.DAY_OF_MONTH}
          maxMenuHeight={174}
          form
          menuPlacement="auto"
        />
      </StyledFlex>
    </>
  );

  return (
    <StyledFlex gap="16px">
      <StyledFlex direction="row" alignItems="center" gap="20px">
        <InputLabel label="When:" mb={0} />

        <StyledFlex direction="row" alignItems="center" gap="8px" fontSize="15px">
          Every
          <StyledFlex width="52px">
            <BaseTextInput
              maxLength={2}
              value={repeaterValue}
              onChange={(e) => {
                const { value } = e.target;

                if (REPEATER_REGEX.test(value)) {
                  setRepeaterValue(e.target.value);
                }
              }}
              onBlur={() => {
                if (!repeaterValue) {
                  setRepeaterValue(1);
                }
              }}
            />
          </StyledFlex>
          Month(s)
        </StyledFlex>
      </StyledFlex>

      <StyledFlex direction="row" alignItems="center">
        <InputLabel label="On:" mb={0} />

        <StyledFlex ml={2.5} direction="row" gap="24px">
          <StyledFlex direction="row">
            <RadioGroupSet
              row
              name="executeOn"
              value={executesOn}
              onChange={(e) => setExecutesOn(e.target.value)}
            >
              <StyledRadio
                value={EXECUTES_ON.DAY_OF_MONTH}
                size={15}
              />
            </RadioGroupSet>

            <StyledFlex
              direction="row"
              alignItems="center"
              flexShrink={0}
              gap="8px"
              opacity={executesOn === EXECUTES_ON.DAY_OF_MONTH ? '1' : '0.5'}
              fontSize={15}
            >
              The
              {' '}
              <DayOfMonthSelect />
              {' '}
              of the month
            </StyledFlex>
          </StyledFlex>
          <StyledFlex direction="row">

            <RadioGroupSet
              row
              name="executeOn"
              value={executesOn}
              onChange={(e) => setExecutesOn(e.target.value)}
            >
              <StyledRadio
                value={EXECUTES_ON.DAY_OF_WEEK}
                size={15}
              />
            </RadioGroupSet>

            <StyledFlex
              direction="row"
              alignItems="center"
              flexShrink={0}
              gap="8px"
              opacity={executesOn === EXECUTES_ON.DAY_OF_WEEK ? '1' : '0.5'}
              fontSize={15}
            >
              The
              {' '}
              <DayOfWeekSelect />
            </StyledFlex>
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>

      <StyledFlex direction="row" alignItems="center" gap="20px">
        <InputLabel label="Starts on:" mb={0} />
        {!editModeData && (
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

export default memo(ProcessExecutionDetailsMonthly);
