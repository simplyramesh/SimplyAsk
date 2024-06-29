import classnames from 'classnames';
import { endOfDay, endOfMonth, format, startOfDay, startOfMonth, subDays } from 'date-fns';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { components } from 'react-select';

import { StyledDivider } from '../../../../../../shared/styles/styled';
import { convertToISOStr, formatDateMonthDayYear } from '../../../../utils/formatters';
import ApplyFiltersButton from '../../../buttons/ApplyFilters/ApplyFiltersButton';
import Calendar from '../../../Calendar/Calendar';
import RadioGroup from '../../../inputs/radio/RadioGroup';
import RadioInput from '../../../inputs/radio/RadioInput';
import css from './CustomCalendarMenu.module.css';

const TITLE = [
  { title: 'Select Date Filter Type:' },
  { title: 'Select Date Range:' },
];

const QUICK_RANGE = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'Last 30 days', value: 'last30days' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'All Days', value: 'allDays' },
  { label: 'Custom Range', value: 'customRange' },
];

const convertForSelect = (date) => {
  if (date instanceof Array) {
    if (format(date[0], 'yyyy-MM-dd') === format(date[1], 'yyyy-MM-dd')) return formatDateMonthDayYear(date[0]);

    return `${formatDateMonthDayYear(date[0])} - ${formatDateMonthDayYear(date[1])}`;
  }

  return formatDateMonthDayYear(date);
};

const SET_ISO_DATE = {
  Today: [startOfDay(new Date()), endOfDay(new Date())],
  Yesterday: [startOfDay(subDays(new Date(), 1)), endOfDay(subDays(new Date(), 1))],
  'Last 7 days': [subDays(new Date(), 7), new Date()],
  'Last 30 days': [subDays(new Date(), 30), new Date()],
  'This Month': [startOfMonth(new Date()), new Date()],
  'Last Month': [
    startOfMonth(subDays(startOfMonth(new Date()), 1)),
    endOfMonth(subDays(startOfMonth(new Date()), 1)),
  ],
  'All Days': [new Date('2021-01-01'), new Date()],
};

const CustomCalendarMenu = ({
  selectOption, selectProps, innerRef, ...props
}) => {
  const [radioValue, setRadioValue] = useState(selectProps?.filterValue?.name || 'edited');
  const [rangeType, setRangeType] = useState(selectProps?.filterValue?.rangeType || 'today');

  // calendar date format must be a Date() object;
  // when user chooses, it returns: DDD MMM DD YYYY HH:mm:ss GMT+0000 (Coordinated Universal Time)
  const [calendarValue, setCalendarValue] = useState(selectProps?.filterValue?.value || SET_ISO_DATE.Today);

  // select label format must be string
  const [selectLabel, setSelectLabel] = useState(
    selectProps?.filterValue?.label || format(new Date(),'LLLL d, yyyy'),
  );

  const onRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  const onRangeChange = (date) => {
    const convertedSelectDate = convertForSelect(date);

    setRangeType('customRange'); // abbr does not have 'name' or 'id' attributes assigned
    setSelectLabel(convertedSelectDate);
    setCalendarValue(date);
  };

  const onQuickRangeChange = (e) => {
    const currentDateValue = convertForSelect(SET_ISO_DATE[e.target.name]);

    setRangeType(e.target.id);
    setSelectLabel(currentDateValue);
    setCalendarValue(SET_ISO_DATE[e.target.name]);
  };

  const handleApplyDate = () => {
    const filterValue = Array.isArray(calendarValue)
      ? [convertToISOStr(calendarValue[0]), convertToISOStr(calendarValue[1])]
      : convertToISOStr(calendarValue);

  const calendarFilter = {
    name: selectProps?.name || radioValue,
    columnId: radioValue === 'edited' ? 'modifiedDate' : 'createdDate',
    rangeType,
    filterValue,
    value: calendarValue,
    label: selectLabel,
  };

    selectOption(calendarFilter);

    if (selectProps?.onFilterSelect) selectProps?.onFilterSelect(calendarFilter);

    if (selectProps?.onApplyCalendarFilter) {
      const isDateRange = Array.isArray(filterValue);

      const beforeDate = isDateRange ? filterValue[1] : filterValue;
      const afterDate = isDateRange ? filterValue[0] : filterValue;

      selectProps.onApplyCalendarFilter({
        [`${radioValue}After`]: afterDate,
        [`${radioValue}Before`]: beforeDate,
      });
    }

    selectProps.onMenuClose();
  };

  return (
    <components.Menu {...props}>
      <div className={css.calendarMenu} ref={innerRef}>
        {selectProps.isDateModified ?? (
          <div className={css.calendarMenu_header}>
            <p className={css.calendarMenu_title}>{TITLE[0].title}</p>
            <RadioGroup name="dateRange">
              <RadioInput
                label="Last Modified Date"
                checked={radioValue === 'edited'}
                value="edited"
                onChange={onRadioChange}
              />
              <RadioInput
                label="Date Added"
                checked={radioValue === 'created'}
                value="created"
                onChange={onRadioChange}
              />
            </RadioGroup>
          </div>
        )}
        <p className={css.calendarMenu_title}>{TITLE[1].title}</p>
        <div className={css.calendarMenu_body}>
          <div className={css.calendarMenu_body_left}>
            {/* Calendar Range Options, e.g.: Last 7 days */}
            {QUICK_RANGE.map((item) => (
              <button
                key={item.value}
                className={classnames({
                  [css.calendarMenu_body_quickSelect]: true,
                  [css['calendarMenu_body_quickSelect--active']]: rangeType === item.value,
                })}
                id={item.value}
                name={item.label}
                onClick={onQuickRangeChange}
              >
                {item.label}
              </button>
            ))}
          </div>
          <StyledDivider orientation="vertical" variant="middle" flexItem />
          {/* Calendar */}
          <div className={css.calendarMenu_body_right}>
            <p className={
              classnames(css.calendarMenu_title, css.calendarMenu_range)
            }
            >
              {convertForSelect(calendarValue)}
            </p>
            <Calendar onRangeChange={onRangeChange} value={calendarValue} />
          </div>
        </div>
        {/* Set Selected Option (filter not applied to table) */}
        <div className={css.calendarMenu_footer}>
          <ApplyFiltersButton onClick={handleApplyDate} />
        </div>
      </div>
    </components.Menu>
  );
};

export default CustomCalendarMenu;

CustomCalendarMenu.propTypes = {
  selectOption: PropTypes.func,
  selectProps: PropTypes.object,
  innerRef: PropTypes.func,
};
