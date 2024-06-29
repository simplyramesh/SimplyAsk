import { endOfDay, format } from 'date-fns';
import React, { useState } from 'react';
import { components } from 'react-select';

import { convertFromToFormat, TIME_12H_FROMAT, TIME_24H_FORMAT } from '../../../../../../utils/timeUtil';
import {
  StyledCard, StyledFlex, StyledText, StyledDivider,
} from '../../../../styles/styled';
import { StyledButton } from '../../../controls/Button/StyledButton';
import CustomSingleCalendar from '../../../CustomCalendar/CustomSingleCalendar';
import CalendarTimeRange from '../menus/CalendarTimeRange/CalendarTimeRange';

const SingleCalendarMenuList = (props) => {
  const todayEOD = endOfDay(new Date().setSeconds(0));

  const { selectProps, selectOption } = props;
  const value = selectProps.value || todayEOD;
  const [calendarValue, onCalendarValueChange] = useState(value);
  const [timeValue, onTimeValueChange] = useState(format(value, TIME_24H_FORMAT));

  const getBackgroundColor = (props) => {
    return props?.selectProps?.bgColor ? props.selectProps.bgColor : undefined;
  }

  const getTextColor = (props) => {
    return props?.selectProps?.textColor ? props.selectProps.textColor : undefined;
  }

  const getBorderColor = (props) => {
    return props?.selectProps?.borderColor ? props.selectProps.borderColor : 'black';
  }

  const minMaxDateProps = {
    ...(selectProps.minDate && { minDate: selectProps.minDate }),
    ...(selectProps.maxDate && { maxDate: selectProps.maxDate }),
  };
  return (
    <components.Menu {...props}>
      <StyledCard p="20px 30px 30px" borderRadius="10px" width="396px" bgColor={getBackgroundColor(props)}>
        <StyledText color={getTextColor(props)} weight={600} mb={8}>Select Date:</StyledText>
        <CustomSingleCalendar
          onChange={(date) => onCalendarValueChange(date)}
          value={calendarValue}
          bgColor={getBackgroundColor(props)}
          textColor={getTextColor(props)}
          {...minMaxDateProps}
        />

        { selectProps.timePicker && (
          <StyledFlex mt={1} gap={2}>
            <StyledDivider color={getTextColor(props)} orientation="horizontal" height="2px" />
            <StyledText color={getTextColor(props)} weight={600}>Select Time:</StyledText>
            <CalendarTimeRange
              selectProps={selectProps}
              dateTimeRange={timeValue}
              parseFormat={TIME_24H_FORMAT}
              textColor={getTextColor(props)}
              borderColor={getBorderColor(props)}
              onChange={(e) => {
                const newTime = convertFromToFormat(e, TIME_12H_FROMAT, TIME_24H_FORMAT);

                if (newTime) {
                  onTimeValueChange(newTime);
                }
              }}
            />
          </StyledFlex>
        )}

        <StyledFlex width="100%" mt={2}>
          <StyledButton
            secondary
            variant="contained"
            onClick={() => {
              const dateValue = new Date(calendarValue);
              const [hours, minutes] = timeValue.split(':');
              dateValue.setHours(hours);
              dateValue.setMinutes(minutes);

              selectOption(dateValue);
            }}
            fullWidth
          >
            Apply Selection
          </StyledButton>
        </StyledFlex>
      </StyledCard>
    </components.Menu>

  );
};

export default SingleCalendarMenuList;
