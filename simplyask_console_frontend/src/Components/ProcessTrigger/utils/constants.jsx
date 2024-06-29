import moment from 'moment';
import * as Yup from 'yup';
import { getInFormattedUserTimezone } from '../../../utils/timeUtil';
import { renderRowHoverAction } from '../../Issues/utills/formatters';
import { DAYS_OF_WEEK } from '../../Settings/Components/FrontOffice/constants/common';
import ViewOnlySignature from '../../shared/REDISIGNED/controls/Signature/ViewOnlySignature';
import CustomTableIcons from '../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledEmptyValue, StyledFlex, StyledText } from '../../shared/styles/styled';
import RenderMaskedIcon from './TableFormatters/RenderMaskedIcon';
import HiddenValue from '../../Settings/Components/FrontOffice/components/shared/HiddenValue';

export const ACCEPTED_FILE_TYPES =
  '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
export const MOMENT_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

export const DATA_TYPES = {
  PROCESS_EXECUTION_INPUT: 'processExecutionInput ',
  FILE: 'file',
  UPDATED_INPUT: 'updatedInput',
};

export const EXECUTION_ACTION = {
  DELETE: 'DELETE',
};

export const EXECUTION_FREQUENCY = {
  ONCE: 'ONCE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
};

export const EXECUTES_WHEN = {
  NOW: 'NOW',
  DATE: 'DATE',
  NEVER: 'NEVER',
};

export const EXECUTES_ON = {
  DAY_OF_MONTH: 'DAY_OF_MONTH',
  DAY_OF_WEEK: 'DAY_OF_WEEK',
};

export const REPEATER_TYPE = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
};

export const CRON_EXPRESSION_CONSTANTS = {
  DAY: 'D',
  WEEKDAY: 'W',
  LAST: 'L',
};

export const DAY_OF_WEEK_REPEATER_OPTIONS = [
  {
    label: 'First',
    value: '1',
  },
  {
    label: 'Second',
    value: '2',
  },
  {
    label: 'Third',
    value: '3',
  },
  {
    label: 'Fourth',
    value: '4',
  },
  {
    label: 'Last',
    value: CRON_EXPRESSION_CONSTANTS.LAST,
  },
];

export const DAY_OF_WEEK_OPTIONS = [
  ...DAYS_OF_WEEK.map((day) => ({ label: day, value: day })),
  { label: 'Day', value: CRON_EXPRESSION_CONSTANTS.DAY },
  { label: 'Weekday', value: CRON_EXPRESSION_CONSTANTS.WEEKDAY },
];

export const MONTH_OPTIONS = [
  { label: 'January', value: '0' },
  { label: 'February', value: '1' },
  { label: 'March', value: '2' },
  { label: 'April', value: '3' },
  { label: 'May', value: '4' },
  { label: 'June', value: '5' },
  { label: 'July', value: '6' },
  { label: 'August', value: '7' },
  { label: 'September', value: '8' },
  { label: 'October', value: '9' },
  { label: 'November', value: '10' },
  { label: 'December', value: '11' },
];

export const REPEATER_REGEX = /^(?:[1-9]|[1-9]\d)?$/;

export const getDayOfMonthsOptions = (month) => {
  const maxDay = getLastDayOfMonth(month);

  return Array.from({ length: maxDay }).map((_, index) => ({
    label: (index + 1).toString(),
    value: (index + 1).toString(),
  }));
};

export const getWeekNumberLabel = (weekNumber) => {
  switch (weekNumber) {
    case 1:
    case '1':
      return 'First';
    case 2:
    case '2':
      return 'Second';
    case 3:
    case '3':
      return 'Third';
    case 4:
    case '4':
      return 'Fourth';
    case 5:
    case '5':
    case 'L':
      return 'Last';
    default:
      return '';
  }
};

export const getDayOfWeekLabel = (dayOfWeek) => {
  if (dayOfWeek === CRON_EXPRESSION_CONSTANTS.WEEKDAY) {
    return 'Weekday';
  }
  if (dayOfWeek === CRON_EXPRESSION_CONSTANTS.DAY) {
    return 'Day';
  }
  return dayOfWeek;
};

export const getMonthDay = (date) => moment(date).format('D');

export const getDayOfWeekNameFromNumber = (dayOfWeekNumber) => moment().day(dayOfWeekNumber).format('dddd');

export const getMonthNumber = (date) => moment(date).month();

export const getLastDayOfMonth = (month) => moment().month(month).endOf('month').format('D');

export const getMonthNameFromNumber = (monthNumber) => moment().month(monthNumber).format('MMMM');

export const CRITERIA_FIELDS = {
  MANDATORY: 'M',
  OPTIONAL: 'O',
  DATA_TYPE: 'dataType',
  EXAMPLE: 'example',
};

export const parseCron = (cronExpression) => {
  const cronValues = cronExpression.split(' ');

  if (cronValues.length !== 6) {
    console.error(`${cronExpression} is invalid cron epxression`);
    return '';
  }

  return {
    dayOfWeek: cronValues[5],
    month: cronValues[4],
    day: cronValues[3],
    hour: cronValues[2],
    minute: cronValues[1],
    second: cronValues[0],
  };
};

export const getFrequencyRepeatTime = (cronExpression, timezone, format = 'hh:mm a z') => {
  const { minute, hour } = parseCron(cronExpression);

  const value = moment().hour(hour).minute(minute).utc(true);

  return getInFormattedUserTimezone(value, timezone, format);
};

export const getRepeaterFromCronValue = (cronValue) => {
  const repeaterRegex = /\*\/(.*)$/;
  const match = cronValue.match(repeaterRegex);

  if (match) {
    return match[1];
  }
};

export const getFrequencyRepeatValue = (cronExpression) => {
  const { day, month, dayOfWeek } = parseCron(cronExpression);
  const ITERATOR_CHAR = '#';

  const dayRepeater = getRepeaterFromCronValue(day);

  if (dayRepeater) {
    return `${dayRepeater} days`;
  }

  const monthRepeater = getRepeaterFromCronValue(month);

  if (monthRepeater) {
    return `${monthRepeater} months`;
  }

  if (dayOfWeek.includes(ITERATOR_CHAR)) {
    const [dayOfWeekNumber, weekNumber] = dayOfWeek.split(ITERATOR_CHAR);

    return `${getWeekNumberLabel(parseInt(weekNumber))} ${getDayOfWeekNameFromNumber(dayOfWeekNumber)}`;
  }
  return dayOfWeek === '?' ? 'Year' : dayOfWeek;
};

const sharedTableActionProps = {
  muiTableHeadCellProps: {
    sx: ({ colors }) => ({
      boxShadow: 'none',
      backgroundColor: 'transparent',
      borderBottom: `1px solid ${colors.primary}`,
      pointerEvents: 'none',
    }),
  },
  muiTableBodyCellProps: {
    sx: ({ colors }) => ({
      boxShadow: 'none',
      backgroundColor: 'transparent',
      '&:hover': {
        borderBottom: `1px solid ${colors.dividerColor}`,
      },
    }),
  },
  enableSorting: false,
  enableGlobalFilter: false,
  enableColumnFilter: false,
};

export const columnFieldsProcessTriggerFromEntryDataTable = (dataHeaderColumns) =>
  dataHeaderColumns
    ?.map((workflow) => ({
      header: workflow.displayName || workflow.fieldName,
      id: workflow.id,
      Cell: ({ row, table }) => {
        const isProtected = workflow.isProtected;

        const rowId = row.original?.uniqueIdFormEntryTable;

        const isTextMaskDisbaled = !!table.options.meta?.showMaskedTableRows?.[rowId];

        const dynamicKey = workflow.fieldName;
        let value = row.original[dynamicKey];

        if (typeof value === 'string' && value?.includes('data:image')) {
          return (
            <StyledFlex>
              <ViewOnlySignature src={value} alt={dynamicKey} />
            </StyledFlex>
          );
        }

        if (isProtected && !isTextMaskDisbaled) {
          return <HiddenValue showIcon={false} showToolTip={false} />;
        }

        if (value?.type === DATA_TYPES.FILE) {
          value = value.name;
        }

        return <StyledText>{value || <StyledEmptyValue />}</StyledText>;
      },
      size: 200,
      align: 'left',
    }))
    .concat([
      {
        header: '',
        id: 'masked',
        Cell: ({ table, row }) => <RenderMaskedIcon table={table} row={row} />,
        size: 30,
        ...sharedTableActionProps,
      },
      {
        header: '',
        id: 'update',
        Cell: ({ table, row }) => (
          <>
            {renderRowHoverAction({
              icon: <CustomTableIcons icon="EDIT" width={30} />,
              onClick: (event) => table.options.meta?.onUpdateIcon(row.original, event),
              toolTipTitle: 'Edit',
            })}
          </>
        ),
        size: 30,
        ...sharedTableActionProps,
      },
      {
        header: '',
        id: 'delete',
        Cell: ({ table, row }) => (
          <>
            {renderRowHoverAction({
              icon: <CustomTableIcons icon="BIN" width={25} />,
              onClick: (event) => table.options.meta?.onDeleteIcon(row),
              toolTipTitle: 'Delete',
            })}
          </>
        ),
        size: 50,
        ...sharedTableActionProps,
      },
    ]);

export const executionDetailsFormSchema = Yup.object().shape({
  executionFrequency: Yup.object().nullable().required('Execution Frequency is required'),
});

export const EXECUTION_INPUT_DATA_TYPE = {
  MANUAL_ENTRY: 'MANUAL_ENTRY',
  FILE_UPLOAD: 'FILE_UPLOAD',
  NO_INPUT_DATA: 'NO_INPUT_DATA',
};

export const EXECUTION_INPUT_DATA_TYPE_LABEL = {
  [EXECUTION_INPUT_DATA_TYPE.MANUAL_ENTRY]: 'Form Entry',
  [EXECUTION_INPUT_DATA_TYPE.FILE_UPLOAD]: 'File Upload',
  [EXECUTION_INPUT_DATA_TYPE.NO_INPUT_DATA]: 'No Input Data',
};

export const EDIT_PROCESS_MODAL_TYPES = {
  UNSAVED_CHANGES: 'UNSAVED_CHANGES',
  SUBMIT_UPDATES: 'SUBMIT_UPDATES',
};

export const PROCESS_TRIGGER_MODAL_TYPES = {
  STEP_1_CHANGES: 'STEP_1_CHANGES',
};

export const SCHEDULED_TABLE_FILTER_KEY = 'sideFilter';

export const TRIGGER_RADIO = {
  PROCESS: 'PROCESS',
  ORCHESTRATION: 'ORCHESTRATION',
};

export const PROCESS_TRIGGER_DATA_VALUE_SEPARATOR = '-;-';

export const EVENT_TRIGGER_QUERY_KEYS = {
  GET_EVENT_TRIGGERS: 'GET_EVENT_TRIGGERS',
};

export const CRITERIA = {
  MANDATORY: 'MANDATORY',
  OPTIONAL: 'OPTIONAL',
};

export const CRITERIA_LABELS = {
  MANDATORY: 'Mandatory',
  OPTIONAL: 'Optional',
};

export const FREQUENCY_OPTIONS = [
  {
    label: 'Only Once',
    value: EXECUTION_FREQUENCY.ONCE,
  },
  {
    label: 'Daily',
    value: EXECUTION_FREQUENCY.DAILY,
  },
  {
    label: 'Weekly',
    value: EXECUTION_FREQUENCY.WEEKLY,
  },
  {
    label: 'Monthly',
    value: EXECUTION_FREQUENCY.MONTHLY,
  },
  {
    label: 'Yearly',
    value: EXECUTION_FREQUENCY.YEARLY,
  },
];
