import { Skeleton } from '@mui/material';

import HeaderCell from '../../../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import { StyledCellHoverText, StyledEmptyValue, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { ISSUE_PRIORITIES } from '../../../constants/core';
import RenderIssueAssignee from '../../shared/TableFormatters/RenderIssueAssignee';
import RenderIssueAssigneeEdit from '../../shared/TableFormatters/RenderIssueAssigneeEdit';
import RenderIssueDueDate from '../../shared/TableFormatters/RenderIssueDueDate';
import RenderIssuePriority from '../../shared/TableFormatters/RenderIssuePriority';
import RenderIssuePriorityEdit from '../../shared/TableFormatters/RenderIssuePriorityEdit';
import RenderIssueTime from '../../shared/TableFormatters/RenderIssueTime';
import RenderIssueTimePicker from '../../shared/TableFormatters/RenderIssueTimePicker';
import RenderStatusEdit from './TableFormatters/RenderStatusEdit';

const renderProcessName = ({ row, cell, table }) => {
  const { name, id, isUpdating } = cell.getValue();

  if (isUpdating) return <Skeleton />;

  return (
    <StyledFlex onClick={() => table.options.meta.onNameClick(row.original)}>
      <StyledCellHoverText pointer>
        <StyledText size={15} weight={600} lh={22} color="inherit" maxLines={2}>
          {name}
        </StyledText>
        <StyledText size={13} weight={400} lh={18} color="inherit">{`#${id}`}</StyledText>
      </StyledCellHoverText>
    </StyledFlex>
  );
};

const renderCell = ({ cell, fieldKey }) => {
  const { isUpdating } = cell.getValue();

  const value = cell.getValue()?.[fieldKey];

  if (isUpdating) return <Skeleton />;

  return value ? <StyledText maxLines={3}>{value}</StyledText> : <StyledEmptyValue />;
};

// Todo Remove "|| row.displayName;" when all fallouts have processDisplayName in BE
export const FALLOUT_TICKETS_COLUMNS = [
  {
    header: 'Related Process Name',
    accessorFn: (row) => ({ name: row.processDisplayName || row.displayName, id: row.id, isUpdating: row?.isUpdating }),
    id: 'processDisplayName',
    Header: (props) => <HeaderCell {...props} />,
    Cell: renderProcessName,
    enableGlobalFilter: false,
    size: 350,
    align: 'left',
    enableSorting: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => ({
      status: row.status,
      isUpdating: row?.isUpdating,
      id: row.id,
    }),
    id: 'status',
    Cell: ({ cell, row, table }) => (
      <RenderStatusEdit
        {...{
          cell,
          row,
          table,
        }}
      />
    ),
    size: 220,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: true,
  },
  {
    header: 'Priority',
    accessorFn: (row) => ({
      priority: ISSUE_PRIORITIES[row.priority],
      isUpdating: row?.isUpdating,
    }),
    id: 'priority',
    Cell: ({ cell, table }) => <RenderIssuePriority cell={cell} table={table} />,
    Edit: ({ cell, row, table }) => <RenderIssuePriorityEdit cell={cell} table={table} row={row} />,
    size: 128,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: true,
  },
  {
    header: 'Incident Time',
    accessorFn: (row) => ({
      createdAt: row.createdAt,
      isUpdating: row?.isUpdating,
    }),
    id: 'createdAt',
    Cell: ({ cell, table }) => <RenderIssueTime cell={cell} table={table} fieldName="createdAt" />,
    size: 165,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
  },
  {
    header: 'Incident Step',
    accessorFn: (row) => ({ failedTaskName: row.additionalFields?.failedTaskName, isUpdating: row?.isUpdating }),
    id: 'failedTaskName',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => renderCell({ cell, fieldKey: 'failedTaskName' }),
    size: 243,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Fallout Message',
    accessorFn: (row) => ({ incidentMessage: row.additionalFields?.incidentMessage, isUpdating: row?.isUpdating }),
    id: 'incidentMessage',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => renderCell({ cell, fieldKey: 'incidentMessage' }),
    size: 350,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
  },
  {
    header: 'Assignee',
    accessorFn: (row) => ({
      assignedTo: row.assignedTo?.name,
      isUpdating: row?.isUpdating,
    }),
    id: 'assignedTo',
    Cell: ({ cell, table }) => <RenderIssueAssignee cell={cell} table={table} />,
    Edit: ({ row, table }) => <RenderIssueAssigneeEdit row={row} table={table} />,
    size: 220,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: true,
  },
  {
    header: 'Due Date',
    accessorFn: (row) => ({
      dueDate: row?.dueDate,
      isUpdating: row?.isUpdating,
    }),
    id: 'dueDate',
    Cell: ({ cell, table, row }) => <RenderIssueDueDate cell={cell} table={table} row={row} />,
    Edit: ({ cell, table, row }) => <RenderIssueTimePicker cell={cell} table={table} row={row} />,
    size: 225,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: true,
  },
  {
    header: 'Resolved On',
    accessorFn: (row) => ({
      resolvedAt: row.resolvedAt,
      isUpdating: row?.isUpdating,
    }),
    id: 'resolvedAt',
    Cell: ({ cell, table }) => <RenderIssueTime cell={cell} table={table} fieldName="resolvedAt" />,
    size: 165,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
  },
];
