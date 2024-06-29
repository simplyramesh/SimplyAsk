import * as Yup from 'yup';

export const exportReportValidationSchema = Yup.object().shape({
  timeFrame: Yup.object().required('Please select time frame'),
  process: Yup.array().min(1, 'Please select processes'),
});
