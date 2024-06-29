import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, formatLocalTime } from '../../../utils/timeUtil';
import { rowHoverActionColumnProps } from '../../Issues/utills/formatters';
import UsernameWithAvatar from '../../shared/REDISIGNED/components/UsernameWithAvatar/UsernameWithAvatar';
import { StyledTooltip } from '../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  StyledCellHoverText,
  StyledEmptyValue,
  StyledFlex,
  StyledRowHoverActionCellIconWrapper,
  StyledStatus,
  StyledText,
} from '../../shared/styles/styled';
import {
  PROCESS_EXECUTION_FILTERS,
  PROCESS_HISTORY_EXECUTION_STATUS_COLOR_MAP,
  PROCESS_STATUSES,
} from '../constants/core';

import { formatDurationFromSeconds } from './helpers';

const renderTooltip = (children, title, colors) => {
  const tooltipColorAndBg = colors ? { color: colors.primary, bgTooltip: colors.white } : {};

  return (
    <StyledTooltip
      key={title}
      title={title}
      arrow
      placement="top"
      p="10px 15px"
      maxWidth="auto"
      disableInteractive
      {...tooltipColorAndBg}
    >
      {children}
    </StyledTooltip>
  );
};

const renderTextCell = (values, key) => (
  <StyledFlex {...(key && { key })}>
    {[].concat(values).map((v, i) => (
      <StyledText as="p" key={i} weight={400} size={15} lh={23} maxLines={key ? 2 : undefined}>
        {v}
      </StyledText>
    ))}
  </StyledFlex>
);

const renderTimeCell = ({ cell, row, table }) => {
  const cellValue = cell.getValue();

  const { status } = row.original;
  const endTimeText = [PROCESS_STATUSES.PREPARING, PROCESS_STATUSES.EXECUTING].includes(status) ? (
    ['To Be Determined', `(${status})`]
  ) : (
    <StyledEmptyValue />
  );

  const textArr = cellValue
    ? [formatLocalTime(cellValue, BASE_DATE_FORMAT), formatLocalTime(cellValue, BASE_TIME_FORMAT)]
    : endTimeText;

  return renderTextCell(textArr);
};

export const PROCESS_HISTORY_INDIVIDUAL_COLUMNS = [
  {
    header: 'Process Name',
    accessorFn: (row) => ({
      name: row[PROCESS_EXECUTION_FILTERS.WORKFLOW_NAME] || row.projectName,
      id: row[PROCESS_EXECUTION_FILTERS.WORKFLOW_ID] || row.procInstanceId,
    }),
    id: PROCESS_EXECUTION_FILTERS.PROCESS_NAME,
    Cell: ({ cell, row, table }) => {
      const { name, id } = cell.getValue();
      const { onRowClick } = table.options.meta;

      return (
        <StyledFlex cursor="pointer" onClick={() => onRowClick(row.original)}>
          <StyledCellHoverText pointer>
            <StyledText as="p" weight={600} size={15} lh={21} color="inherit">
              {name}
            </StyledText>
            <StyledText as="p" weight={400} size={13} lh={18} color="inherit">
              {`#${id}`}
            </StyledText>
          </StyledCellHoverText>
        </StyledFlex>
      );
    },
    minSize: 348,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => row[PROCESS_EXECUTION_FILTERS.STATUS],
    id: PROCESS_EXECUTION_FILTERS.STATUS,
    Cell: ({ cell }) => {
      const cellValue = cell.getValue();

      return (
        <StyledStatus
          minWidth="unset"
          height="34px"
          color={PROCESS_HISTORY_EXECUTION_STATUS_COLOR_MAP[cellValue]?.color}
        >
          {PROCESS_HISTORY_EXECUTION_STATUS_COLOR_MAP[cellValue]?.label}
        </StyledStatus>
      );
    },
    minSize: 148,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Current Task',
    accessorFn: (row) =>
      [
        PROCESS_STATUSES.SUCCESS,
        PROCESS_STATUSES.STOPPED,
        PROCESS_STATUSES.CANCELLED,
        PROCESS_STATUSES.PREPARING,
      ].includes(row[PROCESS_EXECUTION_FILTERS.STATUS]) ? (
        <StyledEmptyValue />
      ) : (
        row[PROCESS_EXECUTION_FILTERS.CURRENT_TASK]
      ),
    id: PROCESS_EXECUTION_FILTERS.CURRENT_TASK,
    Cell: ({ cell }) => renderTextCell(cell.getValue()),
    minSize: 280,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Input Parameters',
    accessorFn: (row) =>
      row[PROCESS_EXECUTION_FILTERS.REQUEST_DATA] ? JSON.parse(row[PROCESS_EXECUTION_FILTERS.REQUEST_DATA]).params : {},
    id: PROCESS_EXECUTION_FILTERS.REQUEST_DATA,
    Cell: ({ cell, table }) => {
      const cellValues = Object.entries(cell.getValue() ?? {}).filter(([, v]) => v);
      const hasContent = cellValues.length > 0;
      const { colors } = table.options.meta;

      if (!hasContent) return <StyledEmptyValue />;

      const createTextCell = ([key, value], isCommaNeeded) =>
        renderTextCell(`${value}${isCommaNeeded ? ', ' : ''}`, key);

      const renderAdditionalItemsTooltip = (remainingItems) => {
        const tooltipContent = (
          <StyledFlex direction="column" align="flex-start" gap="4px 0">
            {remainingItems.map(([k, v]) => (
              <StyledText size={15} key={k} weight={600} lh={18} color="inherit" maxLines={2}>
                {v}
              </StyledText>
            ))}
          </StyledFlex>
        );

        return renderTooltip(
          <StyledFlex as="span" cursor="pointer" width="fit-content">
            <StyledText size={15} weight={600} lh={18} themeColor="linkColor">
              {`+${remainingItems.length} more`}
            </StyledText>
          </StyledFlex>,
          tooltipContent,
          colors
        );
      };

      if (cellValues.length <= 2) {
        return cellValues.map((item, index) => createTextCell(item, index === 0 && cellValues.length > 1));
      }

      const displayedItems = cellValues.slice(0, 2).map((item, index) => createTextCell(item, index === 0));
      const remainingItems = cellValues.slice(2);
      const additionalItemsTooltip = renderAdditionalItemsTooltip(remainingItems);

      return [...displayedItems, additionalItemsTooltip];
    },
    minSize: 310,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
  },
  {
    header: 'Environment',
    accessorFn: (row) => row[PROCESS_EXECUTION_FILTERS.ENVIRONMENT] || 'No Environment',
    id: PROCESS_EXECUTION_FILTERS.ENVIRONMENT,
    Cell: ({ cell }) => renderTextCell(cell.getValue()),
    minSize: 286,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Start Time',
    accessorFn: (row) => row[PROCESS_EXECUTION_FILTERS.START_TIME],
    id: PROCESS_EXECUTION_FILTERS.START_TIME,
    Cell: renderTimeCell,
    minSize: 143,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'End Time',
    accessorFn: (row) => row[PROCESS_EXECUTION_FILTERS.END_TIME],
    id: PROCESS_EXECUTION_FILTERS.END_TIME,
    Cell: renderTimeCell,
    minSize: 179,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Duration',
    accessorFn: (row) => row[PROCESS_EXECUTION_FILTERS.DURATION],
    id: PROCESS_EXECUTION_FILTERS.DURATION,
    Cell: ({ cell }) => renderTextCell(formatDurationFromSeconds(Number(cell.getValue() ?? 0))),
    minSize: 134,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Trigger Method',
    accessorFn: (row) => row.businessKey.source,
    id: PROCESS_EXECUTION_FILTERS.TRIGGER_METHODS,
    Cell: ({ cell }) => renderTextCell(cell.getValue()),
    minSize: 181,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Triggered By',
    accessorFn: (row) =>
      row.firstName && row.lastName ? (
        <UsernameWithAvatar firstName={row.firstName} lastName={row.lastName} />
      ) : (
        <StyledEmptyValue />
      ),
    id: PROCESS_EXECUTION_FILTERS.TRIGGER_BY,
    Cell: ({ cell }) => cell.getValue(),
    minSize: 286,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: '',
    accessorKey: 'cancelExecutionById',
    id: 'cancelExecutionById',
    accessorFn: (row) => ({
      isCancellable: row.status === PROCESS_STATUSES.EXECUTING || row.status === PROCESS_STATUSES.PREPARING,
    }),
    Cell: ({ row, cell, table }) => {
      const { isCancellable } = cell.getValue();

      const tooltipChild = (
        <StyledFlex as="span">
          <StyledRowHoverActionCellIconWrapper
            className="showOnRowHover"
            onClick={() => table.options.meta.onCancelExecution(row.original)}
          >
            <CloseRoundedIcon />
          </StyledRowHoverActionCellIconWrapper>
        </StyledFlex>
      );

      return isCancellable ? renderTooltip(tooltipChild, 'Cancel Execution') : null;
    },
    ...rowHoverActionColumnProps(),
    enableResizing: false,
  },
];
