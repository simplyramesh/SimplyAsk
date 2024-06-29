import {
  memo, useEffect, useState,
} from 'react';

import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import RadioGroupSet from '../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import { StyledFlex, StyledRadio } from '../../../../../shared/styles/styled';
import { EXECUTES_WHEN } from '../../../../utils/constants';
import { getStartsOnInitialVal, getStartDateFinalVal } from '../../../../utils/initialValueHelpers';
import ProcessExecutionDetailsCalendar from '../ProcessExecutionDetailsCalendar/ProcessExecutionDetailsCalendar';

const ProcessExecutionDetailsOnce = ({
  onChange,
  valueExecutionDetailsStep3,
  editModeData,
}) => {
  const [executeWhen, setExecuteWhen] = useState(getStartsOnInitialVal(editModeData));
  const [startDate, setStartDate] = useState(getStartDateFinalVal(valueExecutionDetailsStep3));

  useEffect(() => {
    onChange(executeWhen === EXECUTES_WHEN.NOW ? { startsNow: true } : {
      startsNow: false,
      startDate,
      endDate: undefined,
    });
  }, [executeWhen]);

  useEffect(() => {
    if (executeWhen === EXECUTES_WHEN.NOW) {
      return;
    }

    onChange({
      startsNow: false,
      startDate,
      endDate: undefined,
    });
  }, [startDate]);

  return (
    <StyledFlex direction="row" alignItems="center" gap="20px">
      <InputLabel label="When:" mb={0} />
      {!editModeData
      && (
        <RadioGroupSet
          row
          name="executeWhen"
          value={executeWhen}
          onChange={(e) => setExecuteWhen(e.target.value)}
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
          isDisabled={executeWhen === EXECUTES_WHEN.NOW}
          placeholder="Select Start Date & Time"
          onChange={(e) => setStartDate(e)}
          value={startDate}
          minDate={new Date()}
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default memo(ProcessExecutionDetailsOnce);
