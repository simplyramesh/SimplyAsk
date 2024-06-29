import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import { isValid } from 'date-fns';

import DuplicateIcon from '../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';
import { DEFAULT_RETURN_VALUE } from '../../../../utils/helperFunctions';
import {
  BASE_DATE_FORMAT, BASE_DATE_TIME_FORMAT, BASE_TIME_FORMAT, formatLocalTime, getInFormattedUserTimezone, ISO_UTC_DATE_AND_TIME_FORMAT,
} from '../../../../utils/timeUtil';
import ServiceTicketStatus from '../../../Issues/components/ServiceTickets/components/shared/ServiceTicketStatus/ServiceTicketStatus';
import { rowHoverActionColumnProps, TableRowIconWithTooltip } from '../../../Issues/utills/formatters';
import { STATUSES_COLORS } from '../../../Settings/Components/FrontOffice/constants/iconConstants';
import ProgressBar from '../../../shared/REDISIGNED/progressBar/ProgressBar';
import { ComponentsConfiguration } from '../../../shared/REDISIGNED/table-v2/BaseTable/BaseTable';
import RichTextCell from '../../../shared/REDISIGNED/table-v2/TableCells/RichTextCell/RichTextCell';
import TagsCell from '../../../shared/REDISIGNED/table-v2/TableCells/TagsCell/TagsCell';
import TextCell from '../../../shared/REDISIGNED/table-v2/TableCells/TextCell/TextCell';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  StyledCellHoverText, StyledEmptyValue, StyledFlex,
  StyledIconButton,
  StyledRowHoverActionCellIconWrapper,
  StyledText,
} from '../../../shared/styles/styled';
import TestIcon from '../components/TestIcon/TestIcon';
import { executionToProgressBarDataMapper, getPercentage, testStatusToLabelMapper } from '../utils/helpers';

import { EXECUTION_FRAMEWORK_OPTIONS, TEST_CASE_EXECUTION_STATUS, TEST_ENTITY_TYPE } from './constants';

export const TEST_MANAGER_FILTERS_KEY = {
  SIDE_FILTER: 'sideFilter',
  TYPES: 'types',
  CREATED_AFTER: 'createdAfter',
  CREATED_BEFORE: 'createdBefore',
  CREATED_DATE: 'createdDate',
  EDITED_AFTER: 'editedAfter',
  EDITED_BEFORE: 'editedBefore',
  EDITED_DATE: 'editedDate',
  EXECUTED_AFTER: 'executedAfter',
  EXECUTED_BEFORE: 'executedBefore',
  EXECUTED_DATE: 'executedDate',
  TAGS: 'tags',
  IS_FAVOURITE: 'isFavourite',
  IS_ARCHIVED: 'isArchived',
};

export const TEST_MANAGER_FILTER_INITIAL_VALUES = {
  [TEST_MANAGER_FILTERS_KEY.SIDE_FILTER]: {
    [TEST_MANAGER_FILTERS_KEY.CREATED_DATE]: '',
    [TEST_MANAGER_FILTERS_KEY.EDITED_DATE]: '',
    [TEST_MANAGER_FILTERS_KEY.EXECUTED_DATE]: '',
    [TEST_MANAGER_FILTERS_KEY.TAGS]: [],
  },
  [TEST_MANAGER_FILTERS_KEY.TYPES]: [],
  [TEST_MANAGER_FILTERS_KEY.CREATED_AFTER]: '',
  [TEST_MANAGER_FILTERS_KEY.CREATED_BEFORE]: '',
  [TEST_MANAGER_FILTERS_KEY.EDITED_AFTER]: '',
  [TEST_MANAGER_FILTERS_KEY.EDITED_BEFORE]: '',
  [TEST_MANAGER_FILTERS_KEY.EXECUTED_AFTER]: '',
  [TEST_MANAGER_FILTERS_KEY.EXECUTED_BEFORE]: '',
  [TEST_MANAGER_FILTERS_KEY.IS_FAVOURITE]: false,
  [TEST_MANAGER_FILTERS_KEY.IS_ARCHIVED]: false,
};

export const testManagerFormatter = (values) => {
  const sideFilter = values[TEST_MANAGER_FILTERS_KEY.SIDE_FILTER];

  return {
    createdAfter: sideFilter.createdDate?.filterValue?.createdAfter || '',
    createdBefore: sideFilter.createdDate?.filterValue?.createdBefore || '',
    editedAfter: sideFilter.editedDate?.filterValue?.editedAfter || '',
    editedBefore: sideFilter.editedDate?.filterValue?.editedBefore || '',
    executedAfter: sideFilter.executedDate?.filterValue?.executedAfter || '',
    executedBefore: sideFilter.executedDate?.filterValue?.executedBefore || '',
    tags: sideFilter.tags?.map(({ value }) => value) || [],
    types: values.types?.map(({ value }) => value) || [],
    ...(values.isFavourite && { isFavourite: values.isFavourite }),
    ...(values.isArchived && { isArchived: values.isArchived }),
    timezone: values.timezone || '',
  };
};

export const selectedTestManagerFiltersMeta = {
  key: TEST_MANAGER_FILTERS_KEY.SIDE_FILTER,
  formatter: {
    createdDate: ({ v, k }) => ({
      label: 'Created Date',
      value: v?.label || '',
      k,
    }),
    editedDate: ({ v, k }) => ({
      label: 'Edited Date',
      value: v?.label || '',
      k,
    }),
    executedDate: ({ v, k }) => ({
      label: 'Execute Date',
      value: v?.label || '',
      k,
    }),
    tags: ({ v, k }) => ({
      label: 'Tags',
      value: v?.map((item) => item.label) || '',
      k,
    }),
  },
};

export const renderNameAndId = (props) => {
  const { cell, table, row } = props;
  const value = cell.getValue();

  const onClick = table.options.meta.onNameClick ?? (() => {});

  return (
    <StyledFlex direction="row" alignItems="center" gap="12px" onClick={() => onClick(row.original)}>
      <TestIcon entityType={value.type} />
      <StyledFlex gap="4px">
        <StyledCellHoverText>
          <StyledText size={15} lh={21} weight={600} maxLines={2} color="inherit">
            {value.name}
          </StyledText>
          <StyledText size={13} lh={18} color="inherit">
            #
            {value.id}
          </StyledText>
        </StyledCellHoverText>
      </StyledFlex>
    </StyledFlex>
  );
};

const renderActions = (props) => {
  const { cell, table, row } = props;
  const { isArchived, isFavourite } = cell.getValue();
  const { colors } = table.options.meta.theme;

  const getFavouriteTooltipText = () => (isFavourite ? 'Unfavourite' : 'Favourite');
  const getArchiveTooltipText = () => (isArchived ? 'Unarchive' : 'Archive');
  const favouriteFn = isFavourite ? table.options.meta.onRowUnfavourite : table.options.meta.onRowFavourite;
  const archiveFn = isArchived ? table.options.meta.onRowUnarchive : table.options.meta.onRowArchive;

  return (
    <StyledFlex direction="row" gap="16px">
      <StyledTooltip title={getFavouriteTooltipText()} placement="top" arrow>
        <StyledIconButton
          iconColor={isFavourite ? colors.starYellow : colors.primary}
          bgColor="transparent"
          hoverBgColor={colors.tableEditableCellBg}
          iconSize="28px"
          onClick={() => favouriteFn(row.original)}
        >
          {isFavourite ? <StarRounded /> : <StarBorderRoundedIcon />}
        </StyledIconButton>
      </StyledTooltip>

      <StyledTooltip title={getArchiveTooltipText()} placement="top" arrow>
        <StyledIconButton
          iconColor={isArchived ? colors.archiveGray : colors.primary}
          bgColor="transparent"
          hoverBgColor="transparent"
          iconSize="24px"
          onClick={() => archiveFn(row.original)}
        >
          {isArchived ? <InventoryIcon /> : <Inventory2OutlinedIcon />}
        </StyledIconButton>
      </StyledTooltip>
    </StyledFlex>
  );
};

const renderType = (props) => {
  const value = props?.cell?.getValue()?.toUpperCase();
  const typeLabel = EXECUTION_FRAMEWORK_OPTIONS.find((option) => option.value === value)?.label;
  return (
    <StyledText size={15} lh={21}>
      {typeLabel ?? 'N/A'}
    </StyledText>
  );
};

const renderLastExecution = (props) => {
  const { table, cell } = props;
  const value = cell.getValue();
  const timezone = table.options.meta.user?.timezone;
  const isoFormat = formatLocalTime(value?.executionTime, ISO_UTC_DATE_AND_TIME_FORMAT);

  return (
    <StyledText size={15} weight={400} lh={22}>
      {isoFormat ? (
        <>
          <StyledFlex>{getInFormattedUserTimezone(isoFormat, timezone, BASE_DATE_TIME_FORMAT)}</StyledFlex>
          <StyledFlex>{value.environmentName}</StyledFlex>
        </>
      ) : (
        DEFAULT_RETURN_VALUE
      )}
    </StyledText>
  );
};

const renderTime = (props) => {
  const { table, cell } = props;
  const timezone = table.options.meta.user?.timezone;

  const time = cell.getValue();

  const isoFormat = formatLocalTime(time, ISO_UTC_DATE_AND_TIME_FORMAT);

  return (
    <StyledText size={15} weight={400} lh={22} textAlign="center">
      {time ? (
        <StyledText size={15} weight={400} lh={22}>
          <StyledFlex>{getInFormattedUserTimezone(isoFormat, timezone, BASE_DATE_FORMAT)}</StyledFlex>
          <StyledFlex>{getInFormattedUserTimezone(isoFormat, timezone, BASE_TIME_FORMAT)}</StyledFlex>
        </StyledText>
      )
        : <StyledEmptyValue />}

    </StyledText>
  );
};

const renderPinnedActions = ({ row, table }) => {
  const { colors } = table.options.meta.theme;

  return (
    <StyledRowHoverActionCellIconWrapper className="showOnRowHover">
      <StyledFlex
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap="8px"
        width="100%"
        pr={2}
        color={colors.primary}
      >
        <TableRowIconWithTooltip
          icon={<DeleteOutlineOutlinedIcon />}
          toolTipTitle="Delete"
          onClick={() => table.options.meta.onRowDelete(row.original)}
        />
        {row.original.type === TEST_ENTITY_TYPE.CASE && (
          <TableRowIconWithTooltip
            icon={(
              <StyledFlex>
                <DuplicateIcon />
              </StyledFlex>
            )}
            toolTipTitle="Duplicate Test Case"
            onClick={() => table.options.meta.onDuplicate(row.original)}
          />
        )}
        <TableRowIconWithTooltip
          icon={row.original.isArchived ? <PlayCircleOutlineIcon opacity={0.5} /> : <PlayCircleOutlineIcon />}
          toolTipTitle={row.original.isArchived ? 'Cannot Execute an Archived Case' : 'Execute'}
          onClick={() => (!row.original.isArchived ? table.options.meta.onRowExecute(row.original) : null)}
        />
        {row.original.type === TEST_ENTITY_TYPE.CASE && (
          <TableRowIconWithTooltip
            icon={<OpenInNewIcon />}
            toolTipTitle="Open In Test Editor"
            onClick={() => table.options.meta.onOpenInEditor(row.original)}
          />
        )}
      </StyledFlex>
    </StyledRowHoverActionCellIconWrapper>
  );
};

export const TEST_MANAGER_COLUMNS_SCHEMA = [
  {
    header: 'Name',
    accessorFn: (row) => ({
      id: row.id,
      name: row.displayName,
      type: row.type,
    }),
    id: 'displayName',
    Cell: (props) => renderNameAndId(props),
    size: 370,
    enableSorting: false,
  },
  {
    header: '',
    accessorFn: (row) => ({
      isArchived: row.isArchived,
      isFavourite: row.isFavourite,
    }),
    id: 'archiveAndFavourite',
    Cell: (props) => renderActions(props),
    size: 80,
    enableSorting: false,
  },
  {
    header: 'Description',
    accessorFn: (row) => row.description,
    id: 'description',
    Cell: (props) => <RichTextCell {...props} />,
    size: 375,
    enableSorting: false,
  },
  {
    header: 'Cases',
    accessorFn: (row) => row.testCaseCount,
    id: 'testCaseCount',
    Cell: (props) => <TextCell {...props} />,
    size: 100,
    enableSorting: true,
  },
  {
    header: 'Type',
    accessorFn: (row) => row.processType,
    id: 'processType',
    Cell: (props) => renderType(props),
    size: 243,
    enableSorting: false,
  },
  {
    header: 'Last Executed',
    accessorFn: (row) => ({
      executionTime: row.executedAt,
      environmentName: row.executedOnEnvironment,
    }),
    id: 'executedAt',
    Cell: (props) => renderLastExecution(props),
    size: 265,
    enableSorting: true,
  },
  {
    header: 'Last Edited',
    accessorFn: (row) => row.updatedAt,
    id: 'updatedAt',
    Cell: (props) => renderTime(props),
    size: 150,
    enableSorting: true,
  },
  {
    header: 'Created On',
    accessorFn: (row) => row.createdAt,
    id: 'createdAt',
    Cell: (props) => renderTime(props),
    size: 150,
    enableSorting: true,
  },
  {
    header: 'Tags',
    accessorFn: (row) => ({ tags: row.tags, limit: 2 }),
    id: 'tags',
    Cell: (props) => <TagsCell {...props} />,
    size: 320,
    enableSorting: false,
  },
  {
    header: '',
    accessorKey: 'actions',
    id: 'actions',
    Cell: (props) => renderPinnedActions(props),
    ...rowHoverActionColumnProps(),
    size: 130,
  },
];

const renderKeyValueRow = (key, value) => (
  <StyledText size={14} weight={600} lh={21}>
    {`${key}: `}
    <StyledText display="inline" size={14} weight={400} lh={21}>
      {value || DEFAULT_RETURN_VALUE}
    </StyledText>
  </StyledText>
);

const renderExecutionInfo = ({ cell, table }) => {
  const {
    id, environment, startTime, endTime,
  } = cell.getValue();
  const { timezone, theme } = table.options.meta;

  const startTimeText = isValid(new Date(startTime))
    ? getInFormattedUserTimezone(startTime, timezone, BASE_DATE_TIME_FORMAT)
    : startTime;
  const endTimeText = isValid(new Date(endTime))
    ? getInFormattedUserTimezone(endTime, timezone, BASE_DATE_TIME_FORMAT)
    : endTime;

  return (
    <StyledFlex gap="4px 0">
      <StyledCellHoverText>
        <StyledText size={16} weight={600} lh={24} color={theme.colors.linkColor} mb={8}>{`#${id}`}</StyledText>
      </StyledCellHoverText>
      {renderKeyValueRow('Start Time', startTimeText)}
      {renderKeyValueRow('End Time', endTimeText)}
      {renderKeyValueRow('Environment', environment)}
    </StyledFlex>
  );
};

export const executionStatusWithDescription = (status, statusColor, description) => (
  <StyledFlex alignItems="flex-end" gap="8px">
    <ServiceTicketStatus color={statusColor} height="34px">
      {status}
    </ServiceTicketStatus>
    <StyledText size={15} lh={21}>
      {description}
    </StyledText>
  </StyledFlex>
);

const renderExecutionStatus = ({ cell, table, row }) => {
  const { theme, type } = table.options.meta;
  const rowData = row.original;
  const status = cell.getValue();

  const isExecutionError = false;
  const isExecutionCancelled = false;

  if (isExecutionError) {
    return executionStatusWithDescription('Failed', STATUSES_COLORS.RED, 'Failed To Execute');
  }

  if (isExecutionCancelled) {
    return executionStatusWithDescription('Stopped', STATUSES_COLORS.CHARCOAL, 'Canceled Before Finished Executing');
  }

  const progressData = executionToProgressBarDataMapper(type, rowData, theme);

  const singleStatus = type === TEST_ENTITY_TYPE.CASE;
  const isCompletedSingleStatus = status === TEST_CASE_EXECUTION_STATUS.DONE || status === TEST_CASE_EXECUTION_STATUS.FAILED;
  const isSomeCompletedMultipleStatus = rowData.testCasePass > 0 || rowData.testCaseFail > 0;

  const total = TEST_ENTITY_TYPE.SUITE ? rowData.testCaseExecutions : rowData.testCaseExecutionsTotal;
  const executedPercentage = getPercentage((rowData.testCasePass || 0) + (row.testCaseFail || 0), total);
  const passedPercentage = getPercentage(rowData.testCasePass || 0, total);

  return (
    <StyledFlex alignItems="flex-end" gap="6px">
      <ProgressBar
        data={progressData}
        entityName="Test Case Executions"
        disableTooltip={singleStatus}
        hideNulls={singleStatus}
      />

      {singleStatus ? (
        <>
          <StyledText textAlign="right" weight={isCompletedSingleStatus ? 600 : 400}>
            {isCompletedSingleStatus
              ? `${status === TEST_CASE_EXECUTION_STATUS.DONE ? '100%' : '0%'} Passed`
              : testStatusToLabelMapper(status)}
          </StyledText>
          {isCompletedSingleStatus && <StyledText textAlign="right">100% Test Cases Executed</StyledText>}
        </>
      ) : (
        <>
          <StyledText textAlign="right" weight={isSomeCompletedMultipleStatus ? 600 : 400}>
            {isSomeCompletedMultipleStatus ? `${passedPercentage}% Passed` : testStatusToLabelMapper(status)}
          </StyledText>
          {isSomeCompletedMultipleStatus && (
            <StyledText textAlign="right">
              {`${executedPercentage}%`}
              {' '}
              Test Cases Executed
            </StyledText>
          )}
        </>
      )}
    </StyledFlex>
  );
};

const recentExecutionsTableRowClick = {
  muiTableBodyCellProps: ({ row, table }) => ({
    onClick: () => table.options.meta.onTableRowClick?.(row.original),
    ...ComponentsConfiguration.muiTableBodyCellProps,
  }),
};

export const RECENT_EXECUTIONS_COLUMNS = [
  {
    header: 'Execution',
    accessorFn: (row) => ({
      startTime: row.startTime || row.startAt,
      endTime: row.endTime || row.endAt || `To Be Determined ${row.testCaseExecutionStatus || row.status}`,
      id: row.testCaseExecutionId || row.testSuiteId || row.testGroupId,
      environment: row.environment,
    }),
    id: 'createdAt',
    Cell: (props) => renderExecutionInfo(props),
    size: 550,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    ...recentExecutionsTableRowClick,
  },
  {
    header: 'Status',
    accessorFn: (row) => row.testCaseExecutionStatus || row.status,
    id: 'status',
    Cell: (props) => renderExecutionStatus(props),
    size: 300,
    align: 'right',
    enableGlobalFilter: false,
    enableSorting: false,
  },
];
