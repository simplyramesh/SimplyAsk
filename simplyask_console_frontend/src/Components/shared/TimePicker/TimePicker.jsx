import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { time } from '../../../utils/reporting';
import { convert12To24 } from '../../../utils/timeUtil';
import forms from '../styles/forms.module.css';
import css from './TimePicker.module.css';
import { timepickerScheme } from './validation';
import { getAMPMTimeOptions } from '../../../utils/functions/calendar/calendarHelpers';
import CustomIndicatorArrow from '../REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../REDISIGNED/selectMenus/CustomSelect';

const timeDefault = {
  hours: '',
  minutes: '',
  AmPm: time[0],
};

const TimePicker = ({ value = timeDefault, onChange, errorTemplate, errors }) => {
  const getFormattedTime = (val) => (val < 10 && val !== '' ? `0${val}` : val);

  const { values, setFieldValue, isValid } = useFormik({
    validateOnChange: false,
    initialValues: {
      ...value,
      hours: getFormattedTime(value.hours),
      minutes: getFormattedTime(value.minutes),
    },
    validationSchema: timepickerScheme,
  });

  const handleAmPmChange = (val) => {
    setFieldValue('AmPm', val);
  };

  const handleTimeFieldBlur = (field, e) => {
    e.target.value === '0' && setFieldValue(field, '00');
  };

  const handleTimeChange = (field, e) => {
    const MAX_TIME_VALUES = {
      hours: 12,
      minutes: 59,
    };

    const maxValue = MAX_TIME_VALUES[field];

    let { value } = e.target;
    const reg = /^[0-9]*$/;

    if (!reg.test(value)) return;

    if (`${+value}`.length > 2) return;

    if (value > maxValue) {
      value = maxValue;
    } else if (value < 10 && value > 0) {
      value = `0${+value}`;
    } else if (value >= 10) {
      value = +value;
    }

    setFieldValue(field, value);
  };

  useEffect(() => {
    if (isValid) {
      onChange({
        ...values,
        format24: convert12To24(values),
      });
    }
  }, [values, isValid]);

  return (
    <div className={`${forms.fieldset} ${css.timepicker}`}>
      <label>Time</label>
      <div className={`${css.inputGroup}`}>
        <input
          className={`${forms.input} ${css.input} ${errors?.hours && css.invalid}`}
          value={values.hours}
          placeholder="00"
          onChange={(e) => handleTimeChange('hours', e)}
          onBlur={(e) => handleTimeFieldBlur('hours', e)}
        />
        <span className={css.dots}>:</span>
        <input
          className={`${forms.input} ${css.input} ${errors?.minutes && css.invalid}`}
          value={values.minutes}
          placeholder="00"
          onChange={(e) => handleTimeChange('minutes', e)}
          onBlur={(e) => handleTimeFieldBlur('minutes', e)}
        />
      </div>

      <CustomSelect
        options={time}
        onChange={handleAmPmChange}
        value={[values.AmPm]}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
        }}
        menuPortalTarget={document.body}
        closeMenuOnSelect
        filter
        isClearable={false}
        isSearchable={false}
        mb={0}
      />

      {errorTemplate}
    </div>
  );
};

export default TimePicker;

TimePicker.propTypes = {
  errorTemplate: PropTypes.element,
  errors: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.shape({
    AmPm: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    format24: PropTypes.shape({
      h: PropTypes.number,
      m: PropTypes.number,
    }),
    // hours and minutes: (only these ones), when this value has a leading zero, ("03"), it is a string when it has two integers (12), it is a number.
    hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minutes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};
