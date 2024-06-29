import { memo, useEffect, useState } from 'react';

import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import RadioGroupSet from '../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import { StyledFlex, StyledRadio } from '../../../../../shared/styles/styled';
import { EXECUTES_WHEN, REPEATER_TYPE, REPEATER_REGEX } from '../../../../utils/constants';
import {
  getStartsOnInitialVal, getEndsOnInitialVal, getStartDateFinalVal, getEndDateFinalVal, getRepeaterVal,
} from '../../../../utils/initialValueHelpers';
import ProcessExecutionDetailsCalendar from '../ProcessExecutionDetailsCalendar/ProcessExecutionDetailsCalendar';

const ProcessExecutionDetailsDaily = ({
  onChange,
  valueExecutionDetailsStep3,
  editModeData,
}) => {
  const [startsOn, setStartsOn] = useState(getStartsOnInitialVal(editModeData));
  const [endsOn, setEndsOn] = useState(getEndsOnInitialVal(editModeData, valueExecutionDetailsStep3));

  const [repeaterValue, setRepeaterValue] = useState(getRepeaterVal(valueExecutionDetailsStep3));
  const [startDate, setStartDate] = useState(getStartDateFinalVal(valueExecutionDetailsStep3));
  const [endDate, setEndDate] = useState(getEndDateFinalVal(valueExecutionDetailsStep3));

  useEffect(() => {
    onChange({
      startsNow: startsOn === EXECUTES_WHEN.NOW,
      neverEnds: endsOn === EXECUTES_WHEN.NEVER,
      repeater: {
        type: REPEATER_TYPE.DAY,
        value: repeaterValue,
      },
      startDate,
      endDate,
    });
  }, [startsOn, endsOn, repeaterValue, startDate, endDate]);

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
          Day(s)
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

export default memo(ProcessExecutionDetailsDaily);
