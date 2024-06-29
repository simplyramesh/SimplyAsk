import { useFormik } from 'formik';
import fileDownload from 'js-file-download';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { dateWithoutTimeFromISOString } from '../../../../../utils/functions/modifyTime';
import { getDescriptiveDateFromDateString } from '../../../../../utils/helperFunctions';
import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledLoadingButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu, { CUSTOM_CALENDAR_WITHOUT_TIME_MOMENT, QUICK_RANGE, singleDateOrRangeOutput } from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../shared/styles/styled';
import { PROCESS_HISTORY_EXPORT_SUBMIT_TYPES } from '../../../constants/core';
import useGenerateAuditReportCSV from '../../../hooks/useGenerateAuditReportCSV';
import useGenerateAuditReportHTML from '../../../hooks/useGenerateAuditReportHTML';
import { exportReportValidationSchema } from '../../../utils/validationSchemas';

const ExportProcessHistoryReport = ({
  onClose,
  processesTriggerOptions,
  isProcessTriggersLoading,
}) => {
  const allDaysTimeFrame = QUICK_RANGE.find((range) => range.label === 'All Days')?.value;

  const exportProcessHistoryReportInitialValues = {
    process: [],
    timeFrame: {
      label: singleDateOrRangeOutput(allDaysTimeFrame, CUSTOM_CALENDAR_WITHOUT_TIME_MOMENT),
      value: allDaysTimeFrame,
      filterValue: {
        editedAfter: allDaysTimeFrame?.[0],
        editedBefore: allDaysTimeFrame?.[1],
      },
    },
    submitType: null,
  };

  const {
    generateAuditReportCSV,
    isGenerateAuditReportCSVLoading,
  } = useGenerateAuditReportCSV({
    onSuccess: ({ data, variables }) => {
      fileDownload(
        data.data,
        `Process History Report from ${getDescriptiveDateFromDateString(variables.from)} to ${getDescriptiveDateFromDateString(variables.to)}.csv`,
      );
      resetForm();
      toast.info('Your download has been started successfully');
      onClose?.();
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const {
    generateAuditReportHTML,
    isGenerateAuditReportHTMLLoading,
  } = useGenerateAuditReportHTML({
    onSuccess: ({ data, variables }) => {
      fileDownload(
        data.data,
        `Process History Report from ${getDescriptiveDateFromDateString(variables.from)} to ${getDescriptiveDateFromDateString(variables.to)}.html`,
      );
      resetForm();
      toast.info('Your download has been started successfully');
      onClose?.();
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const {
    values, setFieldValue, errors, touched, submitForm, resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: exportProcessHistoryReportInitialValues,
    validationSchema: exportReportValidationSchema,
    onSubmit: (val) => {
      const payload = {
        source: 'API',
        from: dateWithoutTimeFromISOString(values?.timeFrame?.filterValue?.editedAfter),
        to: dateWithoutTimeFromISOString(values?.timeFrame?.filterValue?.editedBefore),
        params: { workflowIds: values?.process?.map((workflow) => workflow.value)?.join(',') },
      };

      val.submitType === PROCESS_HISTORY_EXPORT_SUBMIT_TYPES.HTML_REPORT ? generateAuditReportHTML(payload)
        : generateAuditReportCSV(payload);
    },
  });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  const fetchHTMLReports = async () => {
    setFieldValue('submitType', PROCESS_HISTORY_EXPORT_SUBMIT_TYPES.HTML_REPORT);

    submitForm();
  };

  const fetchCSVReports = async () => {
    setFieldValue('submitType', PROCESS_HISTORY_EXPORT_SUBMIT_TYPES.CSV_REPORT);

    submitForm();
  };

  const isLoading = isProcessTriggersLoading || isGenerateAuditReportHTMLLoading || isGenerateAuditReportCSVLoading;

  return (
    <>
      <StyledFlex marginBottom="19px">
        {isLoading && <Spinner fadeBgParent medium />}

        <InputLabel label="Select Process to Export" />
        <CustomSelect
          name="process"
          options={processesTriggerOptions}
          onChange={handleDropdownFilterChange}
          value={values.process}
          placeholder="Select Processes"
          maxHeight={34}
          menuPortalTarget={document.body}
          mb={3}
          isMulti
          isSearchable
          withSeparator
          components={{
            Option: CustomCheckboxOption,
            DropdownIndicator: CustomIndicatorArrow,
          }}
          closeMenuOnSelect={false}
          invalid={errors.process && touched.process}
        />
        {errors.process && touched.process && <FormErrorMessage>{errors.process}</FormErrorMessage>}

      </StyledFlex>

      <StyledFlex>
        <InputLabel label="Select Timeframe" />
        <CustomSelect
          name="timeFrame"
          placeholder="Select date"
          onChange={handleDropdownFilterChange}
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          closeMenuOnSelect={false}
          openMenuOnClick
          isSearchable={false}
          minMenuHeight={496}
          maxMenuHeight={600}
          value={values.timeFrame}
          defaultQuickValueIndex={6}
          menuWidth={600}
          alignMenu="right"
          maxHeight={34}
          menuPortalTarget={document.body}
        />
      </StyledFlex>

      <StyledFlex justifyContent="space-between" gap={2} flexDirection="row">
        <StyledLoadingButton
          variant="outlined"
          primary
          onClick={fetchHTMLReports}
        >
          Export to HTML
        </StyledLoadingButton>
        <StyledLoadingButton
          variant="outlined"
          primary
          onClick={fetchCSVReports}
        >
          Export to CSV
        </StyledLoadingButton>
      </StyledFlex>
    </>
  );
};

export default ExportProcessHistoryReport;

ExportProcessHistoryReport.propTypes = {
  onClose: PropTypes.func,
};
