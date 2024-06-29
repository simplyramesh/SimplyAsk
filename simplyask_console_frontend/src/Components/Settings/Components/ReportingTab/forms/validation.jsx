import * as yup from 'yup';

import { FREQUENCIES } from '../../../../../utils/reporting';
import { timepickerScheme } from '../../../../shared/TimePicker/validation';

export const createReportingSchema = yup.lazy(({ daysIncluded }) => {
  return yup.object().shape({
    name: yup.string().required('A report name is required'),
    schedulerTaskType: yup.string().required('A workflow name is required'),
    parameters: yup.object().shape({
      reportDaysToInclude: daysIncluded.value === 'customDays'
        ? yup.number().required('Select Days Count').positive().integer()
          .min(1, 'At least 1 day is required')
          .label('Past')
        : yup.number(),
      countOfRecords: yup.number(),
      reportTo: yup.array().of(yup.string()).min(1, 'At least 1 valid email address is required'),
    }),
    cronExpression: yup.string(),
    daysIncluded: yup.object(),
    emailState: yup.string().email('Invalid email'),
    frequency: yup.object().shape({
      type: yup.object().required('Select a Frequency'),
      time: timepickerScheme,
      days: yup.array()
        .when('type', {
          is: (obj) => obj?.value === FREQUENCIES.CUSTOM_DAYS,
          then: (schema) => schema.min(1, 'Select Days'),
        }),
      every: yup.number()
        .when('type', {
          is: (obj) => obj?.value === FREQUENCIES.CUSTOM_FREQUENCY,
          then: (schema) => schema
            .required('Select Days Count').positive().integer().label('Every'),
        }),

      onDay: yup.number()
        .when('type', {
          is: (obj) => obj?.value === FREQUENCIES.MONTHLY,
          then: (schema) => schema
            .required('Select day of the month').positive()
            .min(1, 'Select valid day of the month')
            .max(31, 'Select valid day of the month'),
        }),
    }),
  });
});
