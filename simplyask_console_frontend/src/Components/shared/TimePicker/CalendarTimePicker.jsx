import PropTypes from 'prop-types';

import { getAMPMTimeOptions } from '../../../utils/functions/calendar/calendarHelpers';
import { isNumber } from '../../../utils/validationFunctions';
import classes from './CalendarTimePicker.module.css';
import CustomIndicatorArrow from '../REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../REDISIGNED/selectMenus/CustomSelect';
import React from 'react';

const CalendarTimePicker = ({
  selectId,
  setSelectState,
  setTimeHour,
  setTimeMinute,
  handleAMPMOnChange,
  valueTimeAMPM,
}) => {
  const handleCurrentHourTime = (e) => {
    if (isNumber(e.target.value) || e.target.value.length === 0) {
      if (e.target.value.length < 3 && e.target.value < 13) {
        setTimeHour(e.target.value);
      } else {
        e.target.value = '';
      }
    }
  };

  const handleCurrentMinutesTime = (e) => {
    if (isNumber(e.target.value) || e.target.value.length === 0) {
      if (e.target.value.length < 3 && e.target.value < 60) {
        setTimeMinute(e.target.value);
      } else {
        e.target.value = '';
      }
    }
  };

  return (
    <div className={classes.selectTimeDisplayFlex_2}>
      <div className={`${classes.selectTimeDisplayFlex_3} ${classes.select_div}`}>
        <input
          id="hours"
          name="hours"
          placeholder="00"
          type="number"
          min="1"
          max="12"
          className={`${classes.input_styling}`}
          onChange={handleCurrentHourTime}
        />{' '}
        <p className={classes.colon_position}>:</p>
        <input
          id="minutes"
          name="minutes"
          placeholder="00"
          type="number"
          min="0"
          max="60"
          className={`${classes.input_styling}`}
          onChange={handleCurrentMinutesTime}
        />
      </div>
      <CustomSelect
        id={selectId}
        options={getAMPMTimeOptions()}
        onChange={handleAMPMOnChange}
        value={valueTimeAMPM}
        defaultValue={{ label: 'AM', value: 'AM' }}
        placeholder="AM"
        onMenuOpen={() => setSelectState(true)}
        onMenuClose={() => setSelectState(false)}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
        }}
        menuPortalTarget={document.body}
        closeMenuOnSelect
        filter
        mb={0}
      />
    </div>
  );
};

export default CalendarTimePicker;

CalendarTimePicker.propTypes = {
  selectId: PropTypes.string.isRequired,
  setSelectState: PropTypes.func.isRequired,
  setTimeHour: PropTypes.func.isRequired,
  setTimeMinute: PropTypes.func.isRequired,
  handleAMPMOnChange: PropTypes.func.isRequired,
  valueTimeAMPM: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
};
