import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import moment from 'moment';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { getFileInfo, DATA_TYPES } from '../../../Services/axios/filesAxios';
import { DEFAULT_RETURN_VALUE } from '../../../utils/helperFunctions';
import {
  BASE_DATE_FORMAT,
  BASE_TIME_FORMAT,
  TIME_12H_FROMAT_UTC,
  getInFormattedUserTimezone,
} from '../../../utils/timeUtil';
import { getBytesSizeHelper } from '../../Issues/components/ServiceTickets/utils/helpers';
import { renderRowHoverAction, rowHoverActionColumnProps } from '../../Issues/utills/formatters';
import { isFileInFormat } from '../../Managers/shared/utils/validation';
import { getYupValidationByType } from '../../PublicFormPage/utils/schemas';
import FormErrorMessage from '../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import UsernameWithAvatar from '../../shared/REDISIGNED/components/UsernameWithAvatar/UsernameWithAvatar';
import BaseTextInput from '../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import CustomTableIcons from '../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledCellHoverText, StyledEmptyValue, StyledFlex, StyledText } from '../../shared/styles/styled';

import {
  CRON_EXPRESSION_CONSTANTS,
  EXECUTES_ON,
  REPEATER_TYPE,
  CRITERIA_FIELDS,
  EXECUTION_INPUT_DATA_TYPE,
  EXECUTION_INPUT_DATA_TYPE_LABEL,
  SCHEDULED_TABLE_FILTER_KEY,
  getFrequencyRepeatValue,
  CRITERIA,
  CRITERIA_LABELS,
} from './constants';

const TableDataLabel = ({ children, textAlign, wrap = 'normal' }) => (
  <StyledText size={15} lh={22} weight={600} textAlign={textAlign} wrap={wrap}>
    {children}
  </StyledText>
);

export const renderInputData = ({ cell }, isEditProcessModeData) => {
  const value = isEditProcessModeData || cell.getValue();

  const { source, filename, parsedData } = value;

  const executionsCount = Object.values(parsedData)?.map((row) => row)?.length || 0;

  return (
    <>
      <TableDataLabel textAlign={isEditProcessModeData ? 'right' : 'left'}>
        {EXECUTION_INPUT_DATA_TYPE_LABEL[source]}
      </TableDataLabel>
      {source !== EXECUTION_INPUT_DATA_TYPE.NO_INPUT_DATA && (
        <StyledText size={15} weight={400} lh={22}>
          {source === EXECUTION_INPUT_DATA_TYPE.FILE_UPLOAD
            ? filename
            : `${executionsCount} Execution${executionsCount > 1 ? 's' : ''} Defined`}
        </StyledText>
      )}
    </>
  );
};

export const renderFrequency = ({ cell, row }, isEditProcessModeData) => {
  const value = isEditProcessModeData || cell.getValue();
  const { cronExpression, executionTime, timezone, endsAt } = value;

  const sharedTextAlignProp = {
    textAlign: isEditProcessModeData ? 'right' : 'left',
    wrap: 'nowrap',
  };

  const sharedValueProp = {
    textAlign: isEditProcessModeData ? 'right' : 'left',
    justifyContent: isEditProcessModeData ? 'flex-end' : 'flex-start',
  };

  return (
    <StyledText size={15} weight={400} lh={22}>
      {cronExpression ? (
        <>
          <StyledFlex direction="row" gap="4px" {...sharedValueProp}>
            <TableDataLabel {...sharedTextAlignProp}>Every:</TableDataLabel>
            {getFrequencyRepeatValue(cronExpression)}
          </StyledFlex>
          <StyledFlex direction="row" gap="4px" {...sharedValueProp}>
            <TableDataLabel {...sharedTextAlignProp}>At:</TableDataLabel>
            {getInFormattedUserTimezone(row?.original?.nextExecutionAt, timezone, TIME_12H_FROMAT_UTC)}
          </StyledFlex>
          <StyledFlex direction="row" gap="4px" {...sharedValueProp} wrap={isEditProcessModeData ? 'nowrap' : 'normal'}>
            <TableDataLabel {...sharedTextAlignProp}>Ends:</TableDataLabel>
            {endsAt ? getInFormattedUserTimezone(endsAt, timezone, 'MMM dd, yyyy - hh:mm a zz') : 'Never'}
          </StyledFlex>
        </>
      ) : (
        <>
          <StyledFlex {...sharedValueProp}>
            <TableDataLabel {...sharedTextAlignProp}>Executes Only Once</TableDataLabel>
          </StyledFlex>
          <StyledFlex
            direction="row"
            gap="4px"
            {...sharedValueProp}
            style={{ textWrap: isEditProcessModeData ? 'nowrap' : 'normal' }}
          >
            <TableDataLabel {...sharedTextAlignProp} wrap={isEditProcessModeData ? 'nowrap' : 'normal'}>
              On:
            </TableDataLabel>
            {getInFormattedUserTimezone(executionTime, timezone, 'MMM dd, yyyy - HH:mm a zz')}
          </StyledFlex>
        </>
      )}
    </StyledText>
  );
};

export const renderDate = ({ cell, table }, isEditProcessModeData) => {
  const time = isEditProcessModeData ? isEditProcessModeData?.time : cell.getValue();
  const timezone = isEditProcessModeData ? isEditProcessModeData?.timezone : table.options.meta.currentUser?.timezone;

  return (
    <StyledText size={15} weight={400} lh={22}>
      {time ? getInFormattedUserTimezone(time, timezone, BASE_DATE_FORMAT) : DEFAULT_RETURN_VALUE}
    </StyledText>
  );
};

export const renderDateTime = ({ cell, table }, isEditProcessModeData) => {
  const time = isEditProcessModeData ? isEditProcessModeData?.time : cell.getValue();
  const timezone = isEditProcessModeData ? isEditProcessModeData?.timezone : table.options.meta.currentUser?.timezone;

  return (
    <StyledText size={15} weight={400} lh={22} textAlign={isEditProcessModeData ? 'right' : 'left'}>
      {time ? (
        <>
          <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_DATE_FORMAT)}</StyledFlex>
          <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_TIME_FORMAT)}</StyledFlex>
        </>
      ) : (
        DEFAULT_RETURN_VALUE
      )}
    </StyledText>
  );
};

export const renderAssignee = ({ cell, table }, isEditProcessModeData) => {
  let fullName;

  if (isEditProcessModeData) {
    fullName = isEditProcessModeData?.userFullName;
  } else {
    fullName = cell.getValue();
  }

  if (!fullName) return DEFAULT_RETURN_VALUE;

  const splittedName = fullName?.split(' ');

  return (
    <UsernameWithAvatar
      firstName={splittedName?.[0]}
      lastName={splittedName?.[1]}
      color={isEditProcessModeData?.color || table.options.meta?.colors?.primary}
    />
  );
};

export const renderGroupName = ({ cell }, isEditProcessModeData) => {
  const getData = isEditProcessModeData || cell.getValue();
  const { parsedData, executionName } = getData;

  const convertedArr = Object.values(parsedData)?.map((row) => row) || [];

  return (
    <StyledText
      size={15}
      lh={22}
      textAlign={isEditProcessModeData ? 'right' : 'left'}
      wrap="normal"
      {...(!isEditProcessModeData && { ellipsis: true })}
    >
      {convertedArr?.length > 1 && executionName ? executionName : 'Not Applicable'}
    </StyledText>
  );
};

const tableRowClick = {
  muiTableBodyCellProps: ({ row, table }) => ({
    onClick: () => table.options.meta.onTableRowClick?.(row?.original),
    sx: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }),
};

const DeleteButton = React.memo(
  ({ handleSingleDelete, cell }) => {
    const { isDeleting, webhookId, name } = cell.getValue() || {};

    if (isDeleting) return <Skeleton />;

    return (
      <>
        {renderRowHoverAction({
          icon: <CustomTableIcons width={32} icon="REMOVE" />,
          onClick: () => handleSingleDelete({ webhookId, name }),
          toolTipTitle: 'Delete',
        })}
      </>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.cell.getValue(), nextProps.cell.getValue())
);

export const SCHEDULED_PROCESSES_COLUMNS = [
  {
    header: 'Process Name',
    accessorFn: (row) => row.workflowName,
    id: 'workflowName',
    Cell: ({ cell }) => (
      <StyledText ellipsis size={15} lh={22}>
        {cell.getValue() || DEFAULT_RETURN_VALUE}
      </StyledText>
    ),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Group Name',
    id: 'executionName',
    accessorFn: (row) => ({
      parsedData: row.parsedData,
      executionName: row.executionName,
    }),
    Cell: ({ cell }) =>
      renderGroupName({
        cell,
      }),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Input Data',
    accessorFn: (row) => ({
      source: row.source,
      filename: row.filename,
      parsedData: row.parsedData,
    }),
    id: 'inputData',
    Cell: ({ cell }) =>
      renderInputData({
        cell,
      }),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Frequency',
    accessorFn: ({ cronExpression, executionTime, timezone, endsAt }) => ({
      cronExpression,
      executionTime,
      timezone,
      endsAt,
    }),
    id: 'cronExpression',
    Cell: ({ cell, row }) => renderFrequency({ cell, row }),
    size: 320,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Next Execution',
    accessorFn: (row) => row.nextExecutionAt,
    id: 'nextExecutionAt',
    Cell: ({ cell, table }) =>
      renderDate({
        cell,
        table,
      }),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Last Execution',
    accessorFn: (row) => row.completedAt || row.executedAt,
    id: 'executedAt',
    Cell: ({ cell, table }) =>
      renderDate({
        cell,
        table,
      }),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Created On',
    accessorFn: (row) => row.createdAt,
    id: 'createdAt',
    Cell: ({ cell, table }) =>
      renderDateTime({
        cell,
        table,
      }),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Created By',
    accessorFn: (row) => row.userFullName,
    id: 'userFullName',
    Cell: ({ cell, table }) => renderAssignee({ cell, table }),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
    ...tableRowClick,
  },
];

export const EVENT_TRIGGERS_COLUMNS = [
  {
    header: 'Name',
    accessorFn: (row) => row.name,
    id: 'name',
    Cell: ({ table, cell, row }) => (
      <StyledCellHoverText>
        <StyledText color="inherit" ellipsis size={15} lh={22} maxLines={3}>
          {cell.getValue() || DEFAULT_RETURN_VALUE}
        </StyledText>
      </StyledCellHoverText>
    ),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Filter Expression',
    accessorFn: (row) => row.filterExpression,
    id: 'filterExpression',
    Cell: ({ cell }) => (
      <StyledText ellipsis size={15} lh={22} maxLines={3}>
        {cell.getValue() || DEFAULT_RETURN_VALUE}
      </StyledText>
    ),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Process',
    accessorFn: (row) => row.process.displayName,
    id: 'workflow.displayName',
    Cell: ({ cell }) => (
      <StyledText ellipsis size={15} lh={22} maxLines={3}>
        {cell.getValue() || DEFAULT_RETURN_VALUE}
      </StyledText>
    ),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Environment',
    accessorFn: (row) => row.environment?.envName,
    id: 'environment.envName',
    Cell: ({ cell }) => (
      <StyledText ellipsis size={15} lh={22} maxLines={3}>
        {cell.getValue() || DEFAULT_RETURN_VALUE}
      </StyledText>
    ),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Last Updated',
    accessorFn: (row) => row.updatedAt,
    id: 'updatedAt',
    Cell: ({ cell, table }) =>
      renderDate({
        cell,
        table,
      }),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: 'Created On',
    accessorFn: (row) => row.createdAt,
    id: 'createdAt',
    Cell: ({ cell, table }) =>
      renderDateTime({
        cell,
        table,
      }),
    size: 252,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
    ...tableRowClick,
  },
  {
    header: '',
    accessorKey: 'deleteById',
    id: 'deleteById',
    accessorFn: (row) => ({
      isDeleting: row?.isDeleting,
      webhookId: row.webhookId,
      name: row.name,
    }),
    Cell: ({ row, table, cell }) => (
      <DeleteButton handleSingleDelete={table.options.meta.handleSingleDelete} cell={cell} row={row} />
    ),
    ...rowHoverActionColumnProps(),
    size: 70,
    align: 'right',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
];

export const EVENT_PAYLOAD_MAPPING_COLUMNS = [
  {
    header: 'Process Parameter',
    accessorFn: (row) => row?.name,
    id: 'name',
    Cell: ({ table, cell, row }) => (
      <StyledText ellipsis size={15} lh={22} maxLines={3}>
        {cell.getValue() || <StyledEmptyValue />}
      </StyledText>
    ),
    size: 85,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Expected Data Type',
    accessorFn: (row) => row?.type,
    id: 'type',
    Cell: ({ cell }) => (
      <StyledText ellipsis size={15} lh={22} maxLines={3}>
        {cell.getValue() || <StyledEmptyValue />}
      </StyledText>
    ),
    size: 85,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Mandatory Or Optional',
    accessorFn: (row) => row?.criteria,
    id: 'criteria',
    Cell: ({ cell }) => (
      <StyledText ellipsis size={15} lh={22} maxLines={3}>
        {CRITERIA_LABELS[cell.getValue()] || cell.getValue() || <StyledEmptyValue />}
      </StyledText>
    ),
    size: 85,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Payload Mapping',
    accessorFn: (row) => row?.value,
    id: 'value',
    Cell: ({ cell, table }) => (
      <StyledText ellipsis size={15} lh={22} maxLines={3}>
        {cell.getValue() || <StyledEmptyValue />}
      </StyledText>
    ),
    size: 85,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
];

export const EVENT_EDITABLE_PAYLOAD_MAPPING_COLUMNS = [
  ...EVENT_PAYLOAD_MAPPING_COLUMNS.slice(0, 3),
  {
    header: 'Payload Mapping',
    accessorFn: (row) => row?.value,
    id: 'value',
    Cell: ({ cell, table, row }) => {
      const error = table.options.meta.errors?.parameters?.[row.index]?.value;
      const touched = table.options.meta.touched?.parameters?.[row.index]?.value;
      const showError = error && touched;

      return (
        <StyledFlex>
          <BaseTextInput
            name={row.original.name}
            value={cell.getValue()}
            invalid={showError}
            onChange={(e) => table.options.meta.onParamMappingChange(cell.row.original.name, e.target.value)}
          />
          {showError && (
            <FormErrorMessage>{table.options.meta.errors?.parameters?.[row.index]?.value}</FormErrorMessage>
          )}
        </StyledFlex>
      );
    },
    size: 85,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: true,
  },
];

export const eventTriggerValidationSchema = Yup.object().shape({
  name: Yup.string().required('A name is required'),
  process: Yup.object().nullable().required('A Process is required'),
  environment: Yup.object().nullable().required('An Environment is required'),
  filterExpression: Yup.string().nullable(),
  parameters: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string(),
        type: Yup.string(),
        criteria: Yup.string(),
        value: Yup.string().when('criteria', {
          is: CRITERIA.MANDATORY,
          then: Yup.string().required('A value for this field is required'),
          otherwise: Yup.string().nullable(),
        }),
      })
    )
    .required(),
});

export const formatFilePreviewData = (row) => {
  const filterNullValues = row?.replaceAll('null', '');
  const splitItems = filterNullValues?.split(',');
  return splitItems;
};

export const createDynamicValidationSchema = (sideBarInitialValues, dataHeaderColumns) => {
  const initialValues = sideBarInitialValues();

  return Yup.object().shape(
    dataHeaderColumns?.reduce(
      (schema, field) => ({
        ...schema,
        [field.fieldName]: getYupValidationByType(
          field.fieldValidationType,
          field.fieldName,
          field.fieldCriteria === CRITERIA_FIELDS.MANDATORY
        ),
      }),
      initialValues
    )
  );
};
export const scheduledProcessesSearchFormatter = (values) => {
  const nextExecutionDate = values?.[SCHEDULED_TABLE_FILTER_KEY]?.nextExecutionDate?.filterValue;
  const lastExecutionDate = values?.[SCHEDULED_TABLE_FILTER_KEY]?.lastExecutionDate?.filterValue;
  const createdDate = values?.[SCHEDULED_TABLE_FILTER_KEY]?.createdDate?.filterValue;
  const executionName = values?.[SCHEDULED_TABLE_FILTER_KEY]?.executionName?.value;

  return {
    ...(nextExecutionDate && nextExecutionDate),
    ...(lastExecutionDate && lastExecutionDate),
    ...(createdDate && createdDate),
    ...(executionName && { executionName }),
    search: values[SCHEDULED_TABLE_FILTER_KEY]?.searchText || '',
    timezone: values.timezone || '',
    isScheduled: true,
  };
};

export const scheduledProcessesFiltersMeta = {
  key: SCHEDULED_TABLE_FILTER_KEY,
  formatter: {
    executionName: ({ v, k }) => ({
      label: 'Group Name',
      value: v?.label || '',
      k,
    }),
    lastExecutionDate: ({ v, k }) => ({
      label: 'Last Execution Date',
      value: v?.label || '',
      k,
    }),
    nextExecutionDate: ({ v, k }) => ({
      label: 'Next Execution Date',
      value: v?.label || '',
      k,
    }),
    createdDate: ({ v, k }) => ({
      label: 'Created Date',
      value: v?.label || '',
      k,
    }),
  },
};

// Execution Time formatters

const getDailyExecutionCronValues = (repeater) => [`*/${repeater.value}`, '*', '?'];

const getWeeklyExecutionCronValues = (repeater) => {
  const { subrepeater } = repeater;
  const daysOfWeek = subrepeater.value.map((dayOfWeek) => dayOfWeek.substr(0, 3).toUpperCase()).join(',');

  return ['?', '*', daysOfWeek];
};

const getMonthlyExecutionCronValues = (repeater) => {
  const { subrepeater } = repeater;
  const monthNumber = repeater.value;

  if (subrepeater.type === EXECUTES_ON.DAY_OF_MONTH) {
    const dayOfMonth = subrepeater.value;

    return [dayOfMonth, `*/${monthNumber}`, '?'];
  }

  const [dayOfWeekRepeater, dayOfWeek] = subrepeater.value;

  if (dayOfWeek === CRON_EXPRESSION_CONSTANTS.DAY) {
    return [dayOfWeekRepeater, `*/${monthNumber}`, '?'];
  }

  if (dayOfWeek === CRON_EXPRESSION_CONSTANTS.WEEKDAY) {
    return [dayOfWeekRepeater + dayOfWeek, `*/${monthNumber}`, '?'];
  }

  const dayOfWeekLabel = dayOfWeek.substr(0, 3).toUpperCase();

  return [
    '?',
    `*/${monthNumber}`,
    dayOfWeekRepeater === CRON_EXPRESSION_CONSTANTS.LAST
      ? `${dayOfWeekLabel}${dayOfWeekRepeater}`
      : `${dayOfWeekLabel}#${dayOfWeekRepeater}`,
  ];
};

const getYearlyExecutionCronValues = (repeater) => {
  const { subrepeater } = repeater;

  if (subrepeater.type === EXECUTES_ON.DAY_OF_MONTH) {
    const [dayOfMonth, monthNumber] = subrepeater.value;

    return [dayOfMonth, parseInt(monthNumber) + 1, '?'];
  }

  const [dayOfWeekRepeater, dayOfWeek] = subrepeater.value;
  const monthRepeater = dayOfWeekRepeater === CRON_EXPRESSION_CONSTANTS.LAST ? '12' : '1';

  if (dayOfWeek === CRON_EXPRESSION_CONSTANTS.DAY) {
    return [dayOfWeekRepeater, monthRepeater, '?'];
  }

  if (dayOfWeek === CRON_EXPRESSION_CONSTANTS.WEEKDAY) {
    return [dayOfWeekRepeater + dayOfWeek, monthRepeater, '?'];
  }

  const dayOfWeekLabel = dayOfWeek.substr(0, 3).toUpperCase();

  return [
    '?',
    monthRepeater,
    dayOfWeekRepeater === CRON_EXPRESSION_CONSTANTS.LAST
      ? `${dayOfWeekLabel}${dayOfWeekRepeater}`
      : `${dayOfWeekLabel}#${dayOfWeekRepeater}`,
  ];
};

const getCronExpressionExecutionTime = (executionTime) => [
  '0',
  moment(executionTime).utc().minutes().toString(),
  moment(executionTime).utc().hours().toString(),
];

export const getCronExpressionValues = (executionDate, repeater) => {
  const executionTimeCronValues = getCronExpressionExecutionTime(executionDate);

  let repeaterCronValues;

  switch (repeater?.type) {
    case REPEATER_TYPE.DAY:
      repeaterCronValues = getDailyExecutionCronValues(repeater);
      break;
    case REPEATER_TYPE.WEEK:
      repeaterCronValues = getWeeklyExecutionCronValues(repeater);
      break;
    case REPEATER_TYPE.MONTH:
      repeaterCronValues = getMonthlyExecutionCronValues(repeater);
      break;
    case REPEATER_TYPE.YEAR:
      repeaterCronValues = getYearlyExecutionCronValues(repeater);
      break;
    default:
      return [];
  }

  return [...executionTimeCronValues, ...repeaterCronValues];
};

export const processFileInputFormatter = (field, files = []) => {
  try {
    const currentFile = files[0];
    const allowedFileSizeInMB = field?.fileSize;
    const ONE_MB = 1024;

    const sizeInMB = Math.ceil(getBytesSizeHelper(currentFile?.size || 0, 2)) / (ONE_MB * ONE_MB);

    const moreThanAllowedSize = sizeInMB > allowedFileSizeInMB;
    const acceptedFileExtensions = field.fileTypeList && JSON.parse(field.fileTypeList).map((item) => item.value);

    const isValidFormat = field.fileTypeList ? isFileInFormat(currentFile?.name, acceptedFileExtensions) : true;

    if (moreThanAllowedSize) {
      toast.error(`File size limit is ${allowedFileSizeInMB} MB.`);
      return;
    }

    if (!isValidFormat) {
      toast.error(`Only ${acceptedFileExtensions?.join(', ')} files are accepted`);
      return;
    }

    const data = new FormData();
    const fileInfo = getFileInfo(null, null, false, currentFile?.name);

    data.append(DATA_TYPES.FILE, currentFile);
    data.append(DATA_TYPES.FILE_INFO, JSON.stringify([fileInfo]));
    data.append(DATA_TYPES.FILE_PFP, false);

    return data;
  } catch (error) {
    console.log(error);
  }
};
