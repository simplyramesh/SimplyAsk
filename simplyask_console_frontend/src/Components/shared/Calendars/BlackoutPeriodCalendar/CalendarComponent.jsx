/* eslint-disable radix */

import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';

import classes from './CalendarComponent.module.css';
import calendarIcon from '../../../../Assets/icons/CalendarProcessHistory.svg';
import { displayTime } from '../../../../utils/functions/calendar/calendarHelpers';
import useOutsideClick from '../../../../hooks/useOutsideClick';
import CalendarTimePicker from './TimePicker/CalendarTimePicker';

// TODO: stateValue: : determine if prop is required, it is set in both ProcessHistorySideModalFilters and BulkExecutionSideModalFilters
const CalendarComponent = ({
  setStateFunction,
  calendarNewText1,
  setCalendarNewText1,
  calendarNewText2,
  setCalendarNewText2,
}) => {
  const [selectStartState, setSelectStartState] = useState(false);
  const [selectEndState, setSelectEndState] = useState(false);
  const [showCalendar, setCalendarState] = useState(false);
  const [startTimeMinute, setStartTimeMinute] = useState('');
  const [startTimeHour, setStartTimeHour] = useState('');
  const [startTimeAMPM, setStartTimeAMPM] = useState({
    label: 'AM',
    value: 'AM',
  });
  const [endTimeMinute, setEndTimeMinute] = useState('');
  const [endTimeHour, setEndTimeHour] = useState('');
  const [endTimeAMPM, setEndTimeAMPM] = useState({ label: 'AM', value: 'AM' });
  const [selectedCustomRangeStart, setSelectedCustomRangeStart] = useState();
  const [selectedCustomRangeEnd, setSelectedCustomRangeEnd] = useState();
  const [currentDate, setCurrentDate] = useState();
  const [previewStartTime, setPreviewStartTime] = useState();
  const [previewEndTime, setPreviewEndTime] = useState();
  const [backendStartTime, setBackendStartTime] = useState(null);
  const [backendEndTime, setBackendEndTime] = useState(null);
  const calendarOldText = 'Select Date & Time Range';
  const [calendarNewTextActive, setCalendarNewTextActive] = useState(false);
  const [onChangeMenuLock, setOnChangeMenuLock] = useState(false);

  useEffect(() => {
    const updateFilterQueryState = () => {
      setStateFunction((prev) => ({
        ...prev,
        startDate: backendStartTime,
        endDate: backendEndTime,
      }));
    };
    if (backendStartTime && backendEndTime) {
      updateFilterQueryState();
    }
  }, [backendStartTime, backendEndTime]);

  useEffect(() => {
    if (currentDate) {
      setPreviewStartTime(
        new Date(currentDate[0]).toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        })
      );

      setPreviewEndTime(
        new Date(currentDate[1]).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        })
      );
      setSelectedCustomRangeStart(new Date(currentDate[0]).toLocaleDateString('en-CA', {}));

      setSelectedCustomRangeEnd(new Date(currentDate[1]).toLocaleDateString('en-CA', {}));
    }
  }, [currentDate]);

  const ref = useRef();

  useOutsideClick(ref, () => {
    if (showCalendar && !selectStartState && !selectEndState && !onChangeMenuLock) setCalendarState(false);
  });

  const getStartISOTimeFormat = (currentStartDateLocal) => {
    const selectedDate = currentStartDateLocal;
    let parsedMinutes = startTimeMinute ? parseInt(startTimeMinute) : 0;
    let parsedHour = startTimeHour ? parseInt(startTimeHour) : 0;

    let formattedDate;
    if (startTimeAMPM.value === 'AM') {
      if (parsedHour === 12) {
        parsedHour = 0;
      }
      if (parsedMinutes < 10) {
        parsedMinutes = `0${parsedMinutes}`;
      }

      if (parsedHour < 10 && startTimeAMPM.value === 'AM') {
        parsedHour = `0${parsedHour}`;
      }
      formattedDate = `${selectedDate}T${parsedHour}:${parsedMinutes}:00`;
    } else {
      if (parsedHour === 0) {
        parsedHour = 12;
      }
      if (parsedHour < 12) {
        parsedHour += 12;
      }
      if (parsedMinutes < 10) {
        parsedMinutes = `0${parsedMinutes}`;
      }

      if (parsedHour < 10 && startTimeAMPM.value === 'AM') {
        parsedHour = `0${parsedHour}`;
      }
      formattedDate = `${selectedDate}T${parsedHour}:${parsedMinutes}:00`;
    }

    return formattedDate;
  };

  const getEndISOTimeFormat = (currentEndDateLocal) => {
    const selectedDate = currentEndDateLocal;
    let parsedMinutes = endTimeMinute ? parseInt(endTimeMinute) : 0;
    let parsedHour = endTimeHour ? parseInt(endTimeHour) : 0;

    let formattedDate;
    if (endTimeAMPM.value === 'AM') {
      if (parsedHour === 12) {
        parsedHour = 0;
      }
      if (parsedMinutes < 10) {
        parsedMinutes = `0${parsedMinutes}`;
      }

      if (parsedHour < 10 && startTimeAMPM.value === 'AM') {
        parsedHour = `0${parsedHour}`;
      }
      formattedDate = `${selectedDate}T${parsedHour}:${parsedMinutes}:00`;
    } else {
      if (parsedHour === 0) {
        parsedHour = 12;
      }
      if (parsedHour < 12) {
        parsedHour += 12;
      }

      if (parsedMinutes < 10) {
        parsedMinutes = `0${parsedMinutes}`;
      }

      if (parsedHour < 10 && startTimeAMPM.value === 'AM') {
        parsedHour = `0${parsedHour}`;
      }

      formattedDate = `${selectedDate}T${parsedHour}:${parsedMinutes}:00`;
    }

    return formattedDate;
  };

  const handleStartAMPMOnChange = (e) => {
    if (!e) {
      return;
    }
    setStartTimeAMPM(e);
  };

  const handleEndAMPMOnChange = (e) => {
    if (!e) {
      return;
    }
    setEndTimeAMPM(e);
    setCalendarState(true);
  };

  function handleApplyFilter() {
    let currentStartDateLocal = '';
    let currentEndDateLocal = '';

    currentStartDateLocal = selectedCustomRangeStart;
    currentEndDateLocal = selectedCustomRangeEnd;

    const requiredStartTime = getStartISOTimeFormat(currentStartDateLocal);
    const requiredEndTime = getEndISOTimeFormat(currentEndDateLocal);
    setBackendStartTime(requiredStartTime);
    setBackendEndTime(requiredEndTime);
    const displaySTime = displayTime(currentStartDateLocal, startTimeHour, startTimeMinute, startTimeAMPM.value);
    const displayETime = displayTime(currentEndDateLocal, endTimeHour, endTimeMinute, endTimeAMPM.value);
    setCalendarNewTextActive(true);

    setCalendarNewText1(displaySTime);

    setCalendarNewText2(displayETime);
    setCalendarState(false);
  }

  const calendarButtonOnClickCancel = () => {
    setCalendarNewText1('');
    setCalendarNewText2('');
    setCalendarNewTextActive(false);
    setPreviewStartTime();
    setPreviewEndTime();
    setBackendEndTime('');
    setBackendStartTime('');
    setCurrentDate();
    setStateFunction((prev) => ({
      ...prev,
      startDate: '',
      endDate: '',
    }));
  };

  const calendarButtonOnClickAction = () => {
    setCalendarState(!showCalendar);
  };

  const tempOnClickMenuLock = () => {
    if (!onChangeMenuLock) {
      setOnChangeMenuLock(true);
      setTimeout(() => {
        setOnChangeMenuLock(false);
      }, 3000);
    }
  };
  return (
    <div ref={ref}>
      <button className={`${classes.calendarEH} `} onClick={calendarButtonOnClickAction}>
        <div>
          {' '}
          <div className={classes.select_date_time_font}>
            {calendarNewTextActive ? (
              <div>
                {calendarNewText1} <strong className={classes.to_text_margin_2}> {'  to  '} </strong> {calendarNewText2}
              </div>
            ) : (
              calendarOldText
            )}
          </div>{' '}
        </div>
        {backendEndTime && backendEndTime ? (
          <CloseIcon className={classes.closeIcon} onClick={calendarButtonOnClickCancel} />
        ) : (
          <img src={calendarIcon} alt="" />
        )}
      </button>
      {showCalendar && (
        <div className={classes.relative_calendar_parent}>
          <div className={classes.calendarSmallFormat}>
            <div>
              <div className="">Select Date Range:</div>

              <div className={classes.full_width}>
                <div className={classes.big_calendar_selected_time_text_format}>
                  {(() => {
                    if (
                      previewStartTime !== 'Invalid Date' &&
                      previewEndTime !== 'Invalid Date' &&
                      previewStartTime &&
                      previewEndTime
                    ) {
                      return (
                        <div>
                          {' '}
                          {previewStartTime} - {previewEndTime}
                        </div>
                      );
                    }
                    return <div> Selected Time To be Displayed Here </div>;
                  })()}
                </div>
                <Calendar
                  onChange={setCurrentDate}
                  value={currentDate}
                  className={`${classes.react_calendar}`}
                  selectRange
                  calendarType="US"
                  maxDate={new Date()}
                  showFixedNumberOfWeeks
                  onViewChange={tempOnClickMenuLock}
                />
              </div>
            </div>
            <div>
              <div className={classes.timeSectionBorder}>Select Time Range:</div>
              <div className={classes.selectTimeDisplayFlex}>
                <CalendarTimePicker
                  selectId="selectStartTime"
                  setSelectState={setSelectStartState}
                  setTimeHour={setStartTimeHour}
                  setTimeMinute={setStartTimeMinute}
                  handleAMPMOnChange={handleStartAMPMOnChange}
                  valueTimeAMPM={[startTimeAMPM]}
                />
                <div className={classes.to_text_margin}>to </div>
                <CalendarTimePicker
                  selectId="selectEndTime"
                  setSelectState={setSelectEndState}
                  setTimeHour={setEndTimeHour}
                  setTimeMinute={setEndTimeMinute}
                  handleAMPMOnChange={handleEndAMPMOnChange}
                  valueTimeAMPM={[endTimeAMPM]}
                />
              </div>
            </div>

            <button
              onClick={handleApplyFilter}
              className={`${
                previewStartTime !== 'Invalid Date' &&
                previewEndTime !== 'Invalid Date' &&
                previewStartTime &&
                previewEndTime
                  ? classes.apply_filter_active_format
                  : classes.apply_filter_inactive_format
              }`}
            >
              <p className={classes.apply_filter_text_format}>Apply Filter</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;

CalendarComponent.propTypes = {
  calendarNewText1: PropTypes.string,
  calendarNewText2: PropTypes.string,
  setCalendarNewText1: PropTypes.func,
  setCalendarNewText2: PropTypes.func,
  setStateFunction: PropTypes.func,
};
