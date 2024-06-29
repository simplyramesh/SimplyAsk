import React from 'react';
import { StyledFlex, StyledRadio, StyledText } from '../../../../../../shared/styles/styled';
import RadioGroupSet from '../../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import CalendarTimeRange from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CalendarTimeRange/CalendarTimeRange';
import { parse } from 'date-fns';

window.parse = parse;

const CustomExecutes = ({
  job,
  onChange,
  customChecked,
}) => {
  const handleRadioGroupChange = (e, startKey, endKey) => {
    if (e.target.name === 'custom') {
      onChange(startKey, '05:00 PM');
      onChange(endKey, '09:00 PM');
    } else {
      onChange(startKey, '');
      onChange(endKey, '');
    }
  };

  return (
    <StyledFlex gap="10px">
      <StyledFlex>
        <RadioGroupSet
          name="delay"
          onChange={(e) => handleRadioGroupChange(e, 'customStartTime', 'customEndTime')}
        >
          <StyledRadio
            checked={!customChecked}
            name="none"
            label="Anytime"
          />
          <StyledRadio
            checked={customChecked}
            name="custom"
            label="Custom"
          />
        </RadioGroupSet>
      </StyledFlex>

      {customChecked && (
        <StyledFlex direction="row" gap="20px" alignItems="center">
          <CalendarTimeRange
            dateTimeRange={job.customStartTime}
            onChange={(value) => onChange('customStartTime', value)}
            parseFormat="hh:mm a"
          />
          <StyledText size={16} weight={600} lh={18}>to</StyledText>
          <CalendarTimeRange
            dateTimeRange={job.customEndTime}
            onChange={(value) => onChange('customEndTime', value)}
            parseFormat="hh:mm a"
          />
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default CustomExecutes;
