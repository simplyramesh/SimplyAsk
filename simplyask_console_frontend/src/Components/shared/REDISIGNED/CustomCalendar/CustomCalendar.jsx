import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import moment from 'moment/moment';
import React from 'react';
import ReactCalendar from 'react-calendar';

import { StyledFlex, StyledText } from '../../styles/styled';

import { StyledCalendarWrapper } from './StyledCustomCalendar';

const CustomCalendar = ({ calendarWidth, ...rest }) => (
  <StyledCalendarWrapper width={calendarWidth} textColor={rest.textColor} bgColor={rest.bgColor}>
    <ReactCalendar
      maxDetail="month"
      minDetail="month"
      calendarType="US"
      navigationLabel={({ date }) => moment(date).format('MMMM YYYY')}
      nextLabel={<KeyboardArrowRightRoundedIcon />}
      prevLabel={<KeyboardArrowLeftRoundedIcon />}
      next2Label={<KeyboardDoubleArrowRightRoundedIcon />}
      prev2Label={<KeyboardDoubleArrowLeftRoundedIcon />}
      tileContent={({ date }) => (
        <StyledFlex>
          <StyledFlex as="p">
            <StyledText as="span" size={16} weight={500} lh={22} color="inherit">
              {moment(date).format('D')}
            </StyledText>
          </StyledFlex>
        </StyledFlex>
      )}
      className={['custom-calendar']}
      tileClassName={({ date }) => {
        if (moment(date).format('dd') === 'Su') {
          return ['custom-calendar__month-view__days__day--sunday', 'custom-calendar__day__tile'];
        }

        if (moment(date).format('dd') === 'Sa') {
          return ['custom-calendar__month-view__days__day--saturday', 'custom-calendar__day__tile'];
        }

        return 'custom-calendar__day__tile';
      }}
      allowPartialRange
      {...rest}
    />
  </StyledCalendarWrapper>
);

export default CustomCalendar;
