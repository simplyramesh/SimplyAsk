import React from 'react';

import CustomCalendar from './CustomCalendar';

const CustomSingleCalendar = ({
  value,
  onChange,
  calendarWidth = '100%',
  ...rest
}) => {
  return (
    <CustomCalendar
      value={value}
      onChange={onChange}
      calendarWidth={calendarWidth}
      {...rest}
    />
  );
};

export default CustomSingleCalendar;
