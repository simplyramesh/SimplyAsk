import moment from 'moment';
import PropTypes from 'prop-types';
import ReactCalendar from 'react-calendar';

import { CalendarContainer } from './StyledCalendar';

const today = new Date();
const maxHowFarBack = new Date(2014, 1, 1);

const Calendar = ({ value, onRangeChange }) => {
  return (
    <CalendarContainer>
      <ReactCalendar
        value={value}
        onChange={(date, e) => onRangeChange(date, e)}
        maxDate={today}
        minDate={maxHowFarBack}
        maxDetail="month"
        minDetail="month"
        selectRange
        returnValue="range"
        calendarType="US"
        tileClassName={({ date }) => {
          if (moment(date).format('dd') === 'Sa') return 'calendar__saturday';
          if (moment(date).format('dd') === 'Su') return 'calendar__sunday';
          return '';
        }}
      />
    </CalendarContainer>
  );
};

export default Calendar;

Calendar.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onRangeChange: PropTypes.func,
};
