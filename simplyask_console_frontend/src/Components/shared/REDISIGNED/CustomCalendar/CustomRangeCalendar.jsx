import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import CustomCalendar from './CustomCalendar';

const todayStartOfDay = moment().startOf('day').toDate();
const todayEndOfDay = moment().endOf('day').toDate();

const externalTimes = (dates) => {
  const [start, end] = dates;

  return [
    moment(start).startOf('day').format('YYYY-MM-DDTHH:00:00'),
    moment(end).endOf('day').format('YYYY-MM-DDTHH:59:00'),
  ];
};

const CustomRangeCalendar = (props) => {
  const {
    calendarWidth = '100%',
    onChange = () => { },
    value = [],
    minDate = moment('2020-01-01').startOf('day').toDate(),
    maxDate = todayEndOfDay,
  } = props;

  const [calendarValue, setCalendarValue] = useState([todayStartOfDay, todayEndOfDay]);

  useEffect(() => {
    if (value.length === 2) {
      const [start, end] = value;

      const startOfCalendarValue = moment(calendarValue[0]).startOf('day');
      const endOfCalendarValue = moment(calendarValue[1]).startOf('day');

      const startOfValue = moment(start).startOf('day');
      const endOfValue = moment(end).startOf('day');

      if (startOfCalendarValue.isSame(startOfValue) && endOfCalendarValue.isSame(endOfValue)) return;

      setCalendarValue([startOfValue.toDate(), endOfValue.toDate()]);
    }
  }, [value]);

  const handleOnChange = (date, e) => {
    let datesArray = date;

    // Add end date for current start date when a date btn is single clicked
    if (datesArray?.length === 1) {
      datesArray = [date[0], date[0]];
    }

    const externalTimeFormat = externalTimes(datesArray);

    onChange(externalTimeFormat, e);

    setCalendarValue(datesArray);
  };

  return (
    <CustomCalendar
      value={calendarValue}
      onChange={handleOnChange}
      maxDate={maxDate}
      minDate={minDate}
      calendarWidth={calendarWidth}
      returnValue="range" // will always return an array of two dates
      selectRange
    />
  );
};

export default CustomRangeCalendar;

CustomRangeCalendar.propTypes = {
  calendarWidth: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.array,
};
