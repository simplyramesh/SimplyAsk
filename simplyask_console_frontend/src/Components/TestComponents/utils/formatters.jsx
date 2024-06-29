import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import moment from 'moment';

import { TableRowIconWithTooltip, rowHoverActionColumnProps } from '../../Issues/utills/formatters';
import { ACTIVE_STATUSES, DONE_STATUSES } from '../../Managers/TestManager/constants/constants';
import { renderNameAndId } from '../../Managers/TestManager/constants/formatters';
import { TEST_HISTORY_FILTERS, TEST_HISTORY_FILTERS_KEY } from '../../Managers/TestManager/utils/constants';
import { testStatusToLabelMapper } from '../../Managers/TestManager/utils/helpers';
import {
  StyledActions,
  StyledActionsIconWrapper,
} from '../../Settings/AccessManagement/components/table/StyledActions';
import CustomTableIcons from '../../shared/REDISIGNED/icons/CustomTableIcons';
import HeaderCell from '../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import TagsCell from '../../shared/REDISIGNED/table-v2/TableCells/TagsCell/TagsCell';
import TextCell from '../../shared/REDISIGNED/table-v2/TableCells/TextCell/TextCell';
import { StyledTooltip } from '../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledRowHoverActionCellIconWrapper, StyledText } from '../../shared/styles/styled';

import { renderExecutionStatusCell, renderTime } from './helper';

export const TEST_RUNS_TABLE = [
  {
    header: 'Name',
    accessorFn: (row) => row.displayName,
    Cell: ({ cell }) => (
      <StyledText cursor="pointer" size={16}>
        {cell.getValue()}
      </StyledText>
    ),
    id: 'name',
    enableGlobalFilter: true,
    enableColumnFilter: false,
    size: 230,
  },
  {
    header: 'Created at',
    accessorFn: (row) => row.createdAt,
    Cell: ({ cell }) => (
      <StyledFlex width="110px">
        <StyledText cursor="pointer" size={16} lh={22.4}>
          {moment(cell.getValue()).format('MMM D, YYYY - h:mm a')}
        </StyledText>
      </StyledFlex>
    ),
    id: 'createdAt',
    enableGlobalFilter: false,
    enableColumnFilter: true,
    filterFn: (rows, id, filterValue) => {
      if (filterValue === '') return true;

      const value = rows.getValue(id);

      if (Array.isArray(filterValue)) {
        return moment(value).isBetween(filterValue[0], filterValue[1], 'day', '[]');
      }

      return moment(value).isSame(filterValue, 'day');
    },
    size: 110,
  },
  {
    header: 'Actions',
    id: 'actions',
    align: 'right',
    accessorFn: (row) => row,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ table, row }) => (
      <StyledActions>
        <StyledTooltip title="Delete Test Run" arrow placement="top">
          <StyledActionsIconWrapper
            onClick={(e) => {
              e.stopPropagation();

              table.options.meta.onDelete(row.original);
            }}
          >
            <CustomTableIcons icon="BIN" width={24} />
          </StyledActionsIconWrapper>
        </StyledTooltip>
      </StyledActions>
    ),
    enableGlobalFilter: false,
    enableColumnFilter: false,
    enableSorting: false,
    size: 80,
  },
];

export const testHistoryFormatter = (values) => {
  const sideFilter = values[TEST_HISTORY_FILTERS_KEY];

  return {
    startDateAfter: sideFilter.startTime?.filterValue?.startDateAfter || '',
    startDateBefore: sideFilter.startTime?.filterValue?.startDateBefore || '',
    endDateAfter: sideFilter.endTime?.filterValue?.endDateAfter || '',
    endDateBefore: sideFilter.endTime?.filterValue?.endDateBefore || '',
    types: sideFilter.types?.map(({ value }) => value) || [],
    environment: sideFilter.environment?.map(({ value }) => value) || [],
    status: sideFilter.status?.map(({ value }) => value) || [],
    tags: sideFilter.tags?.map(({ value }) => value) || [],
    timezone: values.timezone || '',
  };
};

export const selectedTestHistoryFiltersMeta = {
  key: TEST_HISTORY_FILTERS_KEY,
  formatter: {
    startTime: ({ v, k }) => ({
      label: 'Start Time',
      value: v?.label || '',
      k,
    }),
    endTime: ({ v, k }) => ({
      label: 'End Time',
      value: v?.label || '',
      k,
    }),
    status: ({ v, k }) => ({
      label: 'Status',
      value: v?.map((item) => item.label) || '',
      k,
    }),
    types: ({ v, k }) => ({
      label: 'Types',
      value: v?.map((item) => item.label) || '',
      k,
    }),
    environment: ({ v, k }) => ({
      label: 'Environment',
      value: v?.map((item) => item.label) || '',
      k,
    }),
    tags: ({ v, k }) => ({
      label: 'Tags',
      value: v?.map((item) => item.label) || '',
      k,
    }),
  },
};

const testHistoryTableRowClick = {
  muiTableBodyCellProps: ({ row, table }) => ({
    onClick: () => table.options.meta.onTableRowClick?.(row.original),
    sx: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }),
};

const renderPinnedActions = ({ row, table }) => {
  const { colors } = table.options.meta.theme;
  const status = row.original?.status;
  const isExecuting = ACTIVE_STATUSES.includes(status);
  const isDone = DONE_STATUSES.includes(status);

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
          onClick={() => table.options.meta.onRowDelete?.(row.original)}
        />
        {isExecuting && (
          <TableRowIconWithTooltip
            icon={<CloseIcon />}
            toolTipTitle="Cancel Execution"
            onClick={() => table.options.meta.onRowCancel?.(row.original)}
          />
        )}

        {isDone && (
          <TableRowIconWithTooltip
            icon={<CachedIcon />}
            toolTipTitle="Re-execute"
            onClick={() => table.options.meta.onRowReexecute?.(row.original)}
          />
        )}
      </StyledFlex>
    </StyledRowHoverActionCellIconWrapper>
  );
};

export const TEST_HISTORY_COLUMNS_SCHEMA = [
  {
    header: 'Execution Name',
    accessorFn: (row) => ({
      id: row.id,
      name: row.executionName,
      type: row.type,
    }),
    id: TEST_HISTORY_FILTERS.EXECUTION_NAME,
    Cell: (props) => renderNameAndId(props),
    size: 368,
    enableSorting: false,
    ...testHistoryTableRowClick,
  },
  {
    header: 'Cases',
    accessorFn: (row) => row.testCaseCount,
    id: TEST_HISTORY_FILTERS.TEST_CASE_COUNT,
    Cell: (props) => <TextCell {...props} />,
    size: 147,
    enableSorting: true,
    ...testHistoryTableRowClick,
  },
  {
    header: 'Execution Status',
    accessorFn: (row) => row.executionMap,
    id: TEST_HISTORY_FILTERS.EXECUTION_PROGRESS,
    Cell: renderExecutionStatusCell,
    size: 436,
    enableSorting: false,
    ...testHistoryTableRowClick,
  },
  {
    header: 'Environment',
    accessorFn: (row) => row.executedOnEnvironment,
    id: TEST_HISTORY_FILTERS.ENVIRONMENT,
    Cell: (props) => <TextCell {...props} />,
    size: 225,
    enableSorting: true,
    ...testHistoryTableRowClick,
  },
  {
    header: 'Start Time',
    accessorFn: (row) => row.startTime,
    id: TEST_HISTORY_FILTERS.START_TIME,
    Cell: (props) => renderTime(props),
    size: 143,
    enableSorting: true,
    ...testHistoryTableRowClick,
  },
  {
    header: 'End Time',
    accessorFn: (row) => row.endTime,
    id: TEST_HISTORY_FILTERS.END_TIME,
    Cell: (props) =>
      renderTime(props, `To Be Determined ${testStatusToLabelMapper(props.row?.original?.status) || ''}`),
    size: 177,
    enableSorting: true,
    ...testHistoryTableRowClick,
  },
  {
    header: 'Duration',
    accessorFn: (row) => row.duration,
    id: TEST_HISTORY_FILTERS.DURATION,
    Cell: (props) => <TextCell {...props} />,
    size: 130,
    enableSorting: true,
    ...testHistoryTableRowClick,
  },
  {
    header: 'Related Tags',
    accessorFn: (row) => ({ tags: row.tags.map((tag) => tag.name), limit: 2 }),
    id: TEST_HISTORY_FILTERS.TAGS,
    Cell: (props) => <TagsCell {...props} />,
    size: 391,
    enableSorting: false,
    ...testHistoryTableRowClick,
  },
  {
    header: '',
    accessorKey: 'actions',
    id: TEST_HISTORY_FILTERS.ACTIONS,
    Cell: (props) => renderPinnedActions(props),
    ...rowHoverActionColumnProps(),
    size: 120,
  },
];
