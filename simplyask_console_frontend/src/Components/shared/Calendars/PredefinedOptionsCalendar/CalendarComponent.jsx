/* eslint-disable radix */

import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';

import calendarIcon from '../../../../Assets/icons/CalendarProcessHistory.svg';
import useOutsideClick from '../../../../hooks/useOutsideClick';
import { displayTime } from '../../../../utils/functions/calendar/calendarHelpers';
import { getDescriptiveDateFromDateString } from '../../../../utils/helperFunctions';
import { calendarDataSet as dataSet, dateCriteriaKeys } from '../../../../utils/schemas/calendarSchemas';
import CalendarTimePicker from '../../TimePicker/CalendarTimePicker';
import classes from './CalendarComponent.module.css';
import DateCriteriaButton from './DateCriteriaButton';
import { StyledCalendarIsolationWrapper } from './StyledIsolateCalendarCss';

export const CALENDAR_DIMENSION_KEYS = {
  INPUT_WIDTH: 'inputWidth',
  NEGATIVE_CALENDAR_MARGIN: 'addNegativeMarginToCalendar',
  SHOW_ELLIPSIS_IN_FIRST_DATE: 'showEllipsisInFirstDate',
};

export const CALENDAR_DATE_KEYS = {
  EDITED_AFTER: 'editedAfter',
  EDITED_BEFORE: 'editedBefore',
  CREATED_AFTER: 'createdAfter',
  CREATED_BEFORE: 'createdBefore',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  INCLUSIVE_END_DATE: 'inclusiveEndDate',
};

const DATE_TYPE = {
  EDITED_DATE: 'editedDate',
  CREATED_DATE: 'createdDate',
};

const radioOptions = [
  { value: DATE_TYPE.EDITED_DATE, label: 'Last Edited Date' },
  { value: DATE_TYPE.CREATED_DATE, label: 'Created Date' },
];

const CHARACTER_SEPARATING_DATE_AND_TIME = '-';

const CalendarComponent = ({
  setStateFunction,
  calendarNewText1,
  setCalendarNewText1,
  calendarNewText2,
  setCalendarNewText2,
  selectedDateCriteria,
  setSelectedDateCriteria,
  viewBackupFilters,
  hideTimeStamps = false,
  enableDateFilterType = false,
  calendarInputDisplayText = 'Select Date & Time Range',
  inputWidth = '584px',
  inputHeight = '40px',
  calendarWidth = '584px',
  addNegativeMarginToCalendar = '0px',
  showEllipsisInFirstDate = false,
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
  const [calendarNewTextActive, setCalendarNewTextActive] = useState(false);
  const [onChangeMenuLock, setOnChangeMenuLock] = useState(false);
  const [selectedRadioDate, setSelectedRadioDate] = useState(radioOptions[0].value);
  const [triggerDateChange, setTriggerDateChange] = useState(true);
  const [isInclusiveEndDate, setIsInclusiveEndDate] = useState(true);

  useEffect(() => {
    const updateFilterQueryState = () => {
      if (enableDateFilterType) {
        if (selectedRadioDate === DATE_TYPE.EDITED_DATE) {
          setStateFunction((prev) => ({
            ...prev,
            [CALENDAR_DATE_KEYS.EDITED_AFTER]: backendStartTime,
            [CALENDAR_DATE_KEYS.EDITED_BEFORE]: backendEndTime,
            [CALENDAR_DATE_KEYS.CREATED_AFTER]: '',
            [CALENDAR_DATE_KEYS.CREATED_BEFORE]: '',
            [CALENDAR_DATE_KEYS.INCLUSIVE_END_DATE]: isInclusiveEndDate,
          }));
        } else {
          setStateFunction((prev) => ({
            ...prev,
            [CALENDAR_DATE_KEYS.EDITED_AFTER]: '',
            [CALENDAR_DATE_KEYS.EDITED_BEFORE]: '',
            [CALENDAR_DATE_KEYS.CREATED_AFTER]: backendStartTime,
            [CALENDAR_DATE_KEYS.CREATED_BEFORE]: backendEndTime,
            [CALENDAR_DATE_KEYS.INCLUSIVE_END_DATE]: isInclusiveEndDate,
          }));
        }
      } else {
        setStateFunction((prev) => ({
          ...prev,
          [CALENDAR_DATE_KEYS.START_DATE]: backendStartTime,
          [CALENDAR_DATE_KEYS.END_DATE]: backendEndTime,
          [CALENDAR_DATE_KEYS.INCLUSIVE_END_DATE]: isInclusiveEndDate,
        }));
      }
    };
    if (backendStartTime && backendEndTime) {
      updateFilterQueryState();
    }
  }, [backendStartTime, backendEndTime, enableDateFilterType, triggerDateChange]);

  useEffect(() => {
    if (viewBackupFilters?.selectedDateCriteria === null || !viewBackupFilters) {
      setCalendarNewTextActive(false);
    }
  }, [viewBackupFilters?.selectedDateCriteria]);

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

  const handleCriteriaSelection = (event) => {
    const value = event.target.value;

    if (value === selectedDateCriteria) {
      setPreviewStartTime();
      setPreviewEndTime();
      setCurrentDate();
      return setSelectedDateCriteria();
    }
    if (value !== dateCriteriaKeys.CUSTOMRANGE) {
      setCurrentDate();
    }
    setSelectedDateCriteria(value);
    convertTimeHelper(value);
  };

  function convertTimeHelper(value) {
    let currentStartDateLocal = '';
    let currentEndDateLocal = '';

    const getDateType = dataSet.find((item) => item.dateTypeKey === value);
    if (value === dateCriteriaKeys.CUSTOMRANGE) {
      currentStartDateLocal = selectedCustomRangeStart;
      currentEndDateLocal = selectedCustomRangeEnd;
    } else if (value === dateCriteriaKeys.ALLDAYS) {
      currentStartDateLocal = 'All Days';
      currentEndDateLocal = getDateType.currentEndDateApply;
    } else if (getDateType) {
      currentStartDateLocal = getDateType.currentStartDateApply;

      currentEndDateLocal = getDateType.currentEndDateApply;
    }

    if (value !== dateCriteriaKeys.ALLDAYS) {
      setPreviewStartTime(getDescriptiveDateFromDateString(currentStartDateLocal));
    } else {
      setPreviewStartTime(currentStartDateLocal);
    }
    setPreviewEndTime(getDescriptiveDateFromDateString(currentEndDateLocal));
  }

  function handleApplyFilter() {
    let currentStartDateLocal = '';
    let currentEndDateLocal = '';
    const getDateType = dataSet.find((item) => item.dateTypeKey === selectedDateCriteria);
    if (selectedDateCriteria === dateCriteriaKeys.CUSTOMRANGE) {
      currentStartDateLocal = selectedCustomRangeStart;
      currentEndDateLocal = selectedCustomRangeEnd;
    } else if (getDateType) {
      currentStartDateLocal = getDateType.currentStartDateApply;

      currentEndDateLocal = getDateType.currentEndDateApply;
    } else {
    }

    if (
      startTimeHour.length === 0 &&
      startTimeMinute.length === 0 &&
      startTimeAMPM.value === 'AM' &&
      endTimeHour.length === 0 &&
      endTimeMinute.length === 0 &&
      endTimeAMPM.value === 'AM'
    ) {
      setIsInclusiveEndDate(true);
    } else {
      setIsInclusiveEndDate(false);
    }

    const requiredStartTime = getStartISOTimeFormat(currentStartDateLocal);
    const requiredEndTime = getEndISOTimeFormat(currentEndDateLocal);

    setBackendStartTime(requiredStartTime);
    setBackendEndTime(requiredEndTime);

    const displaySTime = displayTime(
      currentStartDateLocal,
      startTimeHour,
      startTimeMinute,
      startTimeAMPM.value,
      hideTimeStamps
    );
    const displayETime = displayTime(
      currentEndDateLocal,
      endTimeHour,
      endTimeMinute,
      endTimeAMPM.value,
      hideTimeStamps
    );
    setCalendarNewTextActive(true);
    if (selectedDateCriteria === dateCriteriaKeys.ALLDAYS) {
      setCalendarNewText1('All Days');
    } else {
      setCalendarNewText1(displaySTime);
    }
    setCalendarNewText2(displayETime);
    setCalendarState(false);

    setTimeout(() => {
      setTriggerDateChange((prev) => !prev);
    }, 350);
  }

  const calendarButtonOnClickCancel = () => {
    setCalendarNewText1('');
    setCalendarNewText2('');
    setCalendarNewTextActive(false);
    setPreviewStartTime();
    setPreviewEndTime();
    setBackendEndTime('');
    setBackendStartTime('');

    if (enableDateFilterType) {
      setStateFunction((prev) => ({
        ...prev,
        [CALENDAR_DATE_KEYS.EDITED_AFTER]: '',
        [CALENDAR_DATE_KEYS.EDITED_BEFORE]: '',
        [CALENDAR_DATE_KEYS.CREATED_AFTER]: '',
        [CALENDAR_DATE_KEYS.CREATED_BEFORE]: '',
      }));
    } else {
      setStateFunction((prev) => ({
        ...prev,
        [CALENDAR_DATE_KEYS.START_DATE]: '',
        [CALENDAR_DATE_KEYS.END_DATE]: '',
      }));
    }
  };

  const handleChange = (e) => {
    setSelectedRadioDate(e.target.value);
  };

  const calendarButtonOnClickAction = () => {
    setCalendarState(!showCalendar);
    if (!calendarNewText1) {
      setSelectedDateCriteria();
    }
  };

  const tempOnClickMenuLock = () => {
    if (!onChangeMenuLock) {
      setOnChangeMenuLock(true);
      setTimeout(() => {
        setOnChangeMenuLock(false);
      }, 3000);
    }
  };

  const GetCalendarText = () => {
    let firstText = calendarNewText1;
    const secondText = calendarNewText2;

    if (showEllipsisInFirstDate) {
      if (!hideTimeStamps) {
        const getDateSeparationIndex = firstText.split(CHARACTER_SEPARATING_DATE_AND_TIME);
        firstText = `${getDateSeparationIndex[0]} ....`;
      } else {
        firstText = `${firstText} ....`;
      }
    }

    return (
      <div className={classes.calendar_btn_text}>
        {firstText} <strong className={classes.to_text_margin_2}> {!showEllipsisInFirstDate && '  to  '} </strong>{' '}
        {!showEllipsisInFirstDate && secondText}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      style={{
        width: inputWidth,
        height: inputHeight,
        transition: 'all 200ms linear',
      }}
    >
      <button
        className={`${classes.calendarEH} `}
        onClick={calendarButtonOnClickAction}
        style={{ height: inputHeight }}
      >
        <div>
          {' '}
          <div className={classes.select_date_time_font} onClick={calendarButtonOnClickAction}>
            {calendarNewTextActive ? <GetCalendarText /> : calendarInputDisplayText}
          </div>{' '}
        </div>
        {backendEndTime && backendEndTime ? (
          <CloseIcon className={classes.closeIcon} onClick={calendarButtonOnClickCancel} />
        ) : (
          <img src={calendarIcon} alt="" />
        )}
      </button>
      {showCalendar && (
        <div
          className={classes.relative_calendar_parent}
          style={{ width: calendarWidth, marginLeft: addNegativeMarginToCalendar }}
        >
          <div
            className={`${classes.calendarSmallFormat}
          ${!hideTimeStamps && classes.hideTimeStampCalendarBottom}`}
          >
            <div className={classes.calendar_first_child}>
              {enableDateFilterType && (
                <>
                  <div
                    className={`${classes.titles} 
              ${classes.select_date_filter_type}`}
                  >
                    Select Date Filter Type:
                  </div>

                  <FormControl component="fieldset" className={classes.calendarMuiRadioButtons}>
                    <RadioGroup
                      aria-label="date"
                      name="controlled-radio-buttons-group"
                      value={selectedRadioDate ?? ''}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value={radioOptions[0].value}
                        control={
                          <Radio className={`${selectedRadioDate === radioOptions[0].value && classes.colorRadio}`} />
                        }
                        label={radioOptions[0].label}
                      />
                      <FormControlLabel
                        value={radioOptions[1].value}
                        control={
                          <Radio className={`${selectedRadioDate === radioOptions[1].value && classes.colorRadio}`} />
                        }
                        label={radioOptions[1].label}
                      />
                    </RadioGroup>
                  </FormControl>
                </>
              )}
              <div
                className={`${classes.titles} 
              ${classes.select_date_range}`}
              >
                Select Date Range:
              </div>
              <div className={classes.flex_row_2}>
                <div>
                  {' '}
                  <DateCriteriaButton
                    label="Today"
                    value={dateCriteriaKeys.TODAY}
                    onClick={handleCriteriaSelection}
                    conditional={selectedDateCriteria === dateCriteriaKeys.TODAY}
                  />
                  <DateCriteriaButton
                    label="Yesterday"
                    value={dateCriteriaKeys.YESTERDAY}
                    onClick={handleCriteriaSelection}
                    conditional={selectedDateCriteria === dateCriteriaKeys.YESTERDAY}
                  />
                  <DateCriteriaButton
                    label="Last 7 Days"
                    value={dateCriteriaKeys.LAST7DAYS}
                    onClick={handleCriteriaSelection}
                    conditional={selectedDateCriteria === dateCriteriaKeys.LAST7DAYS}
                  />
                  <DateCriteriaButton
                    label="Last 30 Days"
                    value={dateCriteriaKeys.LAST30DAYS}
                    onClick={handleCriteriaSelection}
                    conditional={selectedDateCriteria === dateCriteriaKeys.LAST30DAYS}
                  />
                  <DateCriteriaButton
                    label="This Month"
                    value={dateCriteriaKeys.THISMONTH}
                    onClick={handleCriteriaSelection}
                    conditional={selectedDateCriteria === dateCriteriaKeys.THISMONTH}
                  />
                  <DateCriteriaButton
                    label="Last Month"
                    value={dateCriteriaKeys.LASTMONTH}
                    onClick={handleCriteriaSelection}
                    conditional={selectedDateCriteria === dateCriteriaKeys.LASTMONTH}
                  />
                  <DateCriteriaButton
                    label="This Year"
                    value={dateCriteriaKeys.THISYEAR}
                    onClick={handleCriteriaSelection}
                    conditional={selectedDateCriteria === dateCriteriaKeys.THISYEAR}
                  />
                  <DateCriteriaButton
                    label="Last Year"
                    value={dateCriteriaKeys.LASTYEAR}
                    onClick={handleCriteriaSelection}
                    conditional={selectedDateCriteria === dateCriteriaKeys.LASTYEAR}
                  />
                  <DateCriteriaButton
                    label="All Days"
                    value={dateCriteriaKeys.ALLDAYS}
                    onClick={handleCriteriaSelection}
                    conditional={selectedDateCriteria === dateCriteriaKeys.ALLDAYS}
                  />
                  <div>
                    <button
                      value={dateCriteriaKeys.CUSTOMRANGE}
                      className={` ${classes.all_day_div_mb} ${
                        selectedDateCriteria === dateCriteriaKeys.CUSTOMRANGE
                          ? classes.button_onclick_font_styling
                          : classes.button_border_none
                      }`}
                      onClick={handleCriteriaSelection}
                    >
                      Custom Range
                    </button>
                  </div>
                </div>
                <StyledCalendarIsolationWrapper hideTimeStamps={hideTimeStamps}>
                  {/* <div className={`${classes.full_width}
                ${hideTimeStamps && classes.hiddenTimezone_full_width_height}`}
                > */}
                  <div className={classes.big_calendar_selected_time_text_format}>
                    {(() => {
                      if (
                        previewStartTime !== 'Invalid Date' &&
                        previewEndTime !== 'Invalid Date' &&
                        previewStartTime !== '---' &&
                        previewEndTime !== '---' &&
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
                    className={`${classes.react_calendar} ${
                      selectedDateCriteria === dateCriteriaKeys.CUSTOMRANGE ? null : classes.calendar_disable
                    }`}
                    selectRange
                    calendarType="US"
                    maxDate={new Date()}
                    showFixedNumberOfWeeks
                    onViewChange={tempOnClickMenuLock}
                  />
                </StyledCalendarIsolationWrapper>
                {/* </div> */}
              </div>
            </div>
            {!hideTimeStamps && (
              <div>
                <div
                  className={`${classes.titles} 
                ${classes.select_time_range}`}
                >
                  Select Time Range:
                </div>
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
            )}
            <button
              onClick={handleApplyFilter}
              disabled={!selectedDateCriteria}
              className={`${
                selectedDateCriteria && previewStartTime !== '---'
                  ? classes.apply_filter_active_format
                  : classes.apply_filter_inactive_format
              } ${hideTimeStamps && classes.margin_top_15px}`}
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
  addNegativeMarginToCalendar: PropTypes.string,
  inputHeight: PropTypes.string,
  calendarWidth: PropTypes.string,
  inputWidth: PropTypes.string,
  enableDateFilterType: PropTypes.bool,
  showEllipsisInFirstDate: PropTypes.bool,
  hideTimeStamps: PropTypes.bool,
  calendarNewText1: PropTypes.string,
  calendarNewText2: PropTypes.string,
  calendarInputDisplayText: PropTypes.string,
  selectedDateCriteria: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  setCalendarNewText1: PropTypes.func,
  setCalendarNewText2: PropTypes.func,
  setSelectedDateCriteria: PropTypes.func,
  setStateFunction: PropTypes.func,
  viewBackupFilters: PropTypes.shape({
    selectedDateCriteria: PropTypes.string,
  }),
};
