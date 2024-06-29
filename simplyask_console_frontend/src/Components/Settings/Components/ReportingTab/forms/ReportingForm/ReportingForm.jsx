import * as parser from 'cron-parser';
import cronTime from 'cron-time-generator';
import { useFormik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { memo, useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import { getByString } from '../../../../../../utils/helperFunctions';
import {
  days,
  DAYS_INCLUDED,
  daysIncluded,
  FREQUENCIES,
  frequencies,
  PERIOD,
  period,
  taskTypes,
  time,
} from '../../../../../../utils/reporting';
import classes from '../../../../../Catalog/SubForms/SubForm.module.css';
import EmailAddressesForm from '../../../../../shared/forms/EmailAddressesForm/EmailAddressesForm';
import FormValidationMessage from '../../../../../shared/forms/FormValidationMessage/FormValidationMessage';
import buttons from '../../../../../shared/styles/buttons.module.css';
import forms from '../../../../../shared/styles/forms.module.css';
import TimePicker from '../../../../../shared/TimePicker/TimePicker';
import { createReportingSchema } from '../validation';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const requiredFormFields = {
  name: '',
  schedulerTaskType: taskTypes[0].value,
  parameters: {
    reportDaysToInclude: '',
    countOfRecords: '',
    reportTo: [],
  },
  cronExpression: '',
};

const ReportingForm = ({ initialValues, onSubmit, onInitialFormValuesChanged, isSubmitting }) => {
  const {
    values,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
    setErrors,
    isValid,
    resetForm,
    submitForm,
  } = useFormik({
    initialValues: {
      // required form fields
      ...requiredFormFields,

      // additional form fields
      daysIncluded: daysIncluded[0],
      emailState: '',
      frequency: {
        type: '',
        time: {
          hours: '',
          minutes: '',
          AmPm: time[0],
        },
        days: [],
        every: 1,
        onDay: 1,
        period: period[0],
      },
      ...initialValues,
    },
    validateOnChange: false,
    validationSchema: createReportingSchema,

    onSubmit: (values) => {
      onInitialFormValuesChanged(null);
      onSubmit(values, resetForm);
    },
  });

  const isFieldInvalid = (field) => getByString(errors, field) && getByString(touched, field);

  const handleAddEmail = (e) => {
    if (!e.target.value) return;

    if (e.key === 'Enter' || e.type === 'blur') {
      e.preventDefault();

      setErrors({ ...errors, emailState: null });

      setFieldTouched('emailState', true, true).then((err) => {
        if (!err.emailState) {
          const uniqEmails = Array.from(new Set([...values.parameters.reportTo, values.emailState]));

          setFieldValue('parameters.reportTo', uniqEmails);
          setFieldValue('emailState', '');
        }
      });
    }
  };

  const handleRemoveEmail = (email) => {
    const filteredEmails = values.parameters.reportTo.filter((i) => i !== email);
    setFieldValue('parameters.reportTo', filteredEmails);
  };

  const handleFieldValueChange = (val, field) => {
    setFieldValue(field, val);
  };

  const handleDaysIncludedChange = (val) => {
    handleFieldValueChange(val, 'daysIncluded');

    if (val.value === DAYS_INCLUDED.ALL_DAYS) {
      setFieldValue('parameters.reportDaysToInclude', '');
    }
  };

  useEffect(() => {
    const isChanged = () => {
      const initial = initialValues
        ? {
            name: initialValues.name,
            schedulerTaskType: initialValues.schedulerTaskType,
            parameters: initialValues.parameters,
            cronExpression: initialValues.cronExpression,
          }
        : requiredFormFields;

      const current = {
        name: values.name,
        schedulerTaskType: values.schedulerTaskType,
        parameters: values.parameters,
        cronExpression: values.cronExpression,
      };

      return JSON.stringify(initial) !== JSON.stringify(current);
    };

    onInitialFormValuesChanged({ isChanged: isChanged(), submitForm });
  }, [values, initialValues]);

  useEffect(() => {
    const { frequency } = values;
    const hours = frequency.time.format24?.h;
    const minutes = frequency.time.format24?.m;
    let cron;

    switch (frequency.type?.value) {
      case FREQUENCIES.DAILY:
        cron = cronTime.everyDayAt(hours, minutes);
        break;
      case FREQUENCIES.WEEKLY:
        cron = cronTime.everyWeekDayAt(hours, minutes);
        break;
      case FREQUENCIES.WEEKEND:
        cron = cronTime.everyWeekendAt(hours, minutes);
        break;
      case FREQUENCIES.MONTHLY:
        cron = cronTime.everyMonthOn(frequency.onDay, hours, minutes);
        break;
      case FREQUENCIES.CUSTOM_DAYS:
        if (frequency.days.length) {
          cron = cronTime.onSpecificDaysAt(
            frequency.days.map((i) => i.value),
            hours,
            minutes
          );
        }
        break;
      case FREQUENCIES.CUSTOM_FREQUENCY:
        if (frequency.period.value === PERIOD.DAYS) {
          cron = cronTime.every(+frequency.every).days(hours, minutes);
        }
        if (frequency.period.value === PERIOD.MONTHS && frequency.days.length) {
          const base = cronTime.onSpecificDaysAt(
            frequency.days.map((i) => i.value),
            hours,
            minutes
          );
          const cronArray = base.split(' ');
          cronArray[3] = `*/${frequency.every}`;

          cron = cronArray.join(' ');
        }
        break;
      default:
        cron = '';
        break;
    }

    if (cron) {
      setFieldValue('cronExpression', `0 ${cron}`); // 0 - is required for quartz cron expression
    }
  }, [values.frequency]);

  useEffect(() => {
    setErrors({});
  }, [values]);

  const renderDaySelection = (frequency) =>
    (frequency.type.value === DAYS_INCLUDED.CUSTOM_DAYS || frequency.period.value === PERIOD.MONTHS) && (
      <div className={`${forms.fieldset} ${forms.horizontal}`}>
        <label htmlFor="days">Days</label>
        <CustomSelect
          id="days"
          options={days}
          onChange={(val) => handleFieldValueChange(val, 'frequency.days')}
          value={values.frequency.days}
          placeholder="Select Days"
          isMulti
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          controlTextHidden
          menuPortalTarget={document.body}
          isSearchable={false}
          isClearable={false}
          closeMenuOnSelect
          withSeparator
          form
          mb={0}
        />
        {/* no need check for touched */}
        {getByString(errors, 'frequency.days') ? <FormValidationMessage text={errors.frequency.days} /> : null}
      </div>
    );

  const renderMonthDaySelection = (frequencyType) =>
    frequencyType.value === FREQUENCIES.MONTHLY && (
      <div className={`${forms.fieldset} ${forms.horizontal} ${forms.custom}`}>
        <label htmlFor="every">On day</label>
        <input
          className={`${forms.input} ${isFieldInvalid('frequency.onDay') && forms.invalid}`}
          value={values.frequency.onDay}
          onChange={(e) => handleFieldValueChange(e.target.value, 'frequency.onDay')}
        />
        <span>of month</span>

        {isFieldInvalid('frequency.onDay') ? <FormValidationMessage text={errors.frequency.onDay} /> : null}
      </div>
    );

  const renderCustomSelection = (frequencyType) =>
    frequencyType.value === FREQUENCIES.CUSTOM_FREQUENCY && (
      <div className={`${forms.fieldset} ${forms.horizontal} ${forms.custom}`}>
        <label htmlFor="every">Every</label>
        <input
          className={`${forms.input} ${isFieldInvalid('frequency.every') && forms.invalid}`}
          value={values.frequency.every}
          onChange={(e) => handleFieldValueChange(e.target.value, 'frequency.every')}
        />
        <CustomSelect
          options={period}
          onChange={(val) => handleFieldValueChange(val, 'frequency.period')}
          value={values.frequency.period}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          controlTextHidden
          menuPortalTarget={document.body}
          isSearchable={false}
          isClearable={false}
          closeMenuOnSelect
          withSeparator
          form
          mb={0}
        />
        {isFieldInvalid('frequency.every') ? <FormValidationMessage text={errors.frequency.every} /> : null}
      </div>
    );

  const renderCustomDaysToInclude = (daysIncluded) =>
    daysIncluded.value === DAYS_INCLUDED.CUSTOM_DAYS && (
      <div className={`${forms.fieldset} ${forms.horizontal} ${forms.custom}`}>
        <label htmlFor="past">Past</label>
        <input
          className={`${forms.input} ${isFieldInvalid('parameters.reportDaysToInclude') && forms.invalid}`}
          value={values.parameters.reportDaysToInclude}
          onChange={(e) =>
            handleFieldValueChange(e.target.value ? Number(e.target.value) : '', 'parameters.reportDaysToInclude')
          }
        />
        <span>Days of Data</span>
      </div>
    );

  const renderNextReportSentDate = () => {
    let dateNewReport = 'Not available';

    try {
      if (isValid && values.cronExpression) {
        const interval = parser.parseExpression(values.cronExpression);
        const next = interval.next();

        dateNewReport = moment(next.toString()).format('YYYY-MM-DD');
      }
    } catch {}

    return dateNewReport;
  };

  useEffect(() => {
    if (initialValues?.reportDaysToInclude === 0) {
      handleDaysIncludedChange(daysIncluded[0]);
    }
  }, [initialValues?.reportDaysToInclude]);

  return (
    <form className={forms.form} onSubmit={handleSubmit}>
      <div className={forms.header}>
        <div className={forms.headerItem}>
          <b>Report Creation Date</b>
          <span>{moment().format('YYYY-MM-DD')}</span>
        </div>
        <div className={forms.headerItem}>
          <b>Date Next Report is Sent</b>
          <span>{renderNextReportSentDate()}</span>
        </div>
      </div>
      <Scrollbars className={classes.scrollbars}>
        <div className={forms.body}>
          <div className={forms.fieldset}>
            <label className={forms.label} htmlFor="reportName">
              Report name
            </label>
            <input
              className={`${forms.input} ${isFieldInvalid('name') && forms.invalid}`}
              placeholder="Report name"
              id="reportName"
              value={values.name}
              onChange={(e) => setFieldValue('name', e.target.value)}
              disabled={initialValues}
            />
            {isFieldInvalid('name') ? <FormValidationMessage text={errors.name} /> : null}
          </div>
          <div className={forms.fieldset}>
            <label className={forms.label} htmlFor="workflowName">
              Workflow name
            </label>
            <CustomSelect
              id="workflowName"
              options={taskTypes}
              onChange={({ value }) => handleFieldValueChange(value, 'taskType')}
              placeholder="Workflow name"
              value={taskTypes.filter(({ value }) => value === values.schedulerTaskType)}
              getOptionLabel={({ label }) => label}
              getOptionValue={({ value }) => value}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              controlTextHidden
              menuPortalTarget={document.body}
              isSearchable={false}
              isClearable={false}
              closeMenuOnSelect
              withSeparator
              form
              mb={0}
            />

            {isFieldInvalid('taskType') ? <FormValidationMessage text={errors.schedulerTaskType} /> : null}
          </div>
          <EmailAddressesForm
            inputValue={values.emailState}
            emailValues={values.parameters.reportTo}
            onChange={(e) => handleFieldValueChange(e.target.value, 'emailState')}
            onRemove={handleRemoveEmail}
            onKeyPress={handleAddEmail}
            onBlur={handleAddEmail}
            placeholder="Insert Email Address and press Enter"
            isInvalid={isFieldInvalid('parameters.reportTo') || isFieldInvalid('emailState')}
            validationMessage={
              <>
                {isFieldInvalid('emailState') ? <FormValidationMessage text={errors.emailState} /> : null}
                {isFieldInvalid('parameters.reportTo') ? (
                  <FormValidationMessage text={errors.parameters.reportTo} />
                ) : null}
              </>
            }
          />
          <div className={forms.fieldset}>
            <label className={forms.label}>Sending Frequency</label>

            <div className={`${forms.fieldset} ${forms.horizontal}`}>
              <label htmlFor="type">Frequency</label>
              <CustomSelect
                id="type"
                options={frequencies}
                onChange={(val) => handleFieldValueChange(val, 'frequency.type')}
                value={values.frequency.type}
                placeholder="Select Frequency"
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                controlTextHidden
                menuPortalTarget={document.body}
                isSearchable={false}
                isClearable={false}
                closeMenuOnSelect
                withSeparator
                form
                mb={0}
              />
              {isFieldInvalid('frequency.type') ? <FormValidationMessage text={errors.frequency.type} /> : null}
            </div>

            <TimePicker
              onChange={(val) => handleFieldValueChange(val, 'frequency.time')}
              value={values.frequency.time}
              errors={errors.frequency?.time}
              errorTemplate={
                <>
                  {isFieldInvalid('frequency.time.hours') ? (
                    <FormValidationMessage text={errors.frequency?.time?.hours} />
                  ) : null}
                  {isFieldInvalid('frequency.time.minutes') ? (
                    <FormValidationMessage text={errors.frequency?.time?.minutes} />
                  ) : null}
                </>
              }
            />
            {renderMonthDaySelection(values.frequency.type)}
            {renderCustomSelection(values.frequency.type)}
            {renderDaySelection(values.frequency)}
          </div>

          <div className={forms.fieldset}>
            <label className={forms.label} htmlFor="daysIncluded">
              Number of Previous Days Data Points Included in the Report
            </label>

            <div className={forms.fieldset}>
              <CustomSelect
                id="daysIncluded"
                options={daysIncluded}
                onChange={handleDaysIncludedChange}
                value={values.daysIncluded}
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                controlTextHidden
                menuPortalTarget={document.body}
                isSearchable={false}
                isClearable={false}
                closeMenuOnSelect
                withSeparator
                form
                mb={0}
              />
            </div>

            {renderCustomDaysToInclude(values.daysIncluded)}

            {isFieldInvalid('parameters.reportDaysToInclude') ? (
              <FormValidationMessage text={errors.parameters.reportDaysToInclude} />
            ) : null}
          </div>
        </div>
      </Scrollbars>

      <div className={forms.footer}>
        <Button color="primary" className={buttons.formButton} type="submit" disabled={!isValid || isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default memo(ReportingForm);

ReportingForm.propTypes = {
  isSubmitting: PropTypes.bool,
  onInitialFormValuesChanged: PropTypes.func,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};
