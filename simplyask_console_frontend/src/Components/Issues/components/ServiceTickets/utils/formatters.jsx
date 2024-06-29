import React from 'react';

import RenderIssueAssignee from '../../shared/TableFormatters/RenderIssueAssignee';
import RenderIssueAssigneeEdit from '../../shared/TableFormatters/RenderIssueAssigneeEdit';
import RenderIssueDueDate from '../../shared/TableFormatters/RenderIssueDueDate';
import RenderIssuePriority from '../../shared/TableFormatters/RenderIssuePriority';
import RenderIssuePriorityEdit from '../../shared/TableFormatters/RenderIssuePriorityEdit';
import RenderIssueTime from '../../shared/TableFormatters/RenderIssueTime';
import RenderIssueTimePicker from '../../shared/TableFormatters/RenderIssueTimePicker';

import HeaderCell from '../../../../shared/REDISIGNED/table-v2/TableCells/HeaderCell/HeaderCell';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledStatus, StyledText } from '../../../../shared/styles/styled';
import { ISSUE_PRIORITIES } from '../../../constants/core';
import { rowHoverActionColumnProps } from '../../../utills/formatters';
import RenderCreatedBy from './TableFormatters/RenderCreatedBy';
import RenderDeleteServiceTicket from './TableFormatters/RenderDeleteServiceTicket';
import RenderRelatedEntities from './TableFormatters/RenderRelatedEntities';
import RenderStatusEdit from './TableFormatters/RenderStatusEdit';
import RenderTicketName from './TableFormatters/RenderTicketName';

export const SERVICE_TICKETS_COLUMNS = [
  {
    header: 'Ticket Name',
    accessorFn: (row) => ({
      name: row.displayName,
      id: row.id,
      type: row.issueType,
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
    }),
    id: 'ticketName',
    Cell: ({ cell, row, table }) => <RenderTicketName cell={cell} row={row} table={table} />,
    size: 400,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => ({
      status: row.status,
      isDeleting: row?.isDeleting,
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
    size: 210,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: true,
  },
  {
    header: 'Priority',
    accessorFn: (row) => ({
      priority: ISSUE_PRIORITIES[row.priority],
      isDeleting: row?.isDeleting,
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
    header: 'Ticket Tasks',
    accessorFn: (row) => ({
      relatedEntities: row.relatedEntities?.reduce(
        (acc, entity) => (!entity.relatedEntity ? acc : [...acc, entity]),
        []
      ),
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
    }),
    id: 'relatedEntities',
    Cell: ({ cell }) => <RenderRelatedEntities cell={cell} />,
    size: 135,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Assignee',
    accessorFn: (row) => ({
      assignedTo: row.assignedTo?.name,
      isDeleting: row?.isDeleting,
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
      isDeleting: row?.isDeleting,
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
      resolvedAt: row?.resolvedAt,
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
    }),
    id: 'resolvedAt',
    Cell: ({ cell, table }) => <RenderIssueTime cell={cell} table={table} fieldName="resolvedAt" />,
    size: 225,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
  },
  {
    header: 'Created On',
    accessorFn: (row) => ({
      createdAt: row.createdAt,
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
    }),
    id: 'createdAt',
    Cell: ({ cell, table }) => <RenderIssueTime cell={cell} table={table} fieldName="createdAt" />,
    size: 225,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
  },
  {
    header: 'Created By',
    accessorFn: (row) => ({
      createdBy: row.createdBy,
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
    }),
    id: 'createdBy',
    Cell: ({ cell, row }) => <RenderCreatedBy cell={cell} row={row} />,
    size: 150,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: '',
    accessorKey: 'deleteById',
    id: 'deleteById',
    accessorFn: (row) => ({
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
      id: row.id,
      name: row.displayName,
    }),
    Cell: ({ row, table, cell }) => (
      <RenderDeleteServiceTicket handleSingleDelete={table.options.meta.handleSingleDelete} cell={cell} row={row} />
    ),
    ...rowHoverActionColumnProps(),
    size: 70,
    align: 'right',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
];

export const BOA_PROCESS_COLUMNS = [
  {
    id: 'processName',
    header: 'Process Name / ID',
    enableColumnFilter: false,
    accessorFn: (row) => `${row.projectName}, ${row.procInstanceId}`,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => {
      const [projectName, procInstanceId] = cell.getValue().split(',');

      return (
        <StyledFlex gap="4px 0" width="100%">
          <StyledText size={15} lh={18} weight={600}>
            {projectName}
          </StyledText>
          <StyledText size={15} lh={18}>
            {procInstanceId}
          </StyledText>
        </StyledFlex>
      );
    },
    size: 329,
    muiTableBodyCellProps: ({ row, table }) => ({
      onClick: () => table.options.meta.setRowSelection(row.original),
      sx: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
    }),
  },
  {
    id: 'parameters',
    header: 'Parameters',
    enableColumnFilter: false,
    accessorFn: (row) => Object.keys(JSON.parse(row.requestData)?.params).join(','), // so mui react table can filter by this column
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => {
      const cellValue = cell.getValue().split(',');
      const cellValueLength = cellValue.length;

      const renderCellValue = () => (
        <StyledFlex width="fit-content">
          <StyledText size={15} lh={18}>
            {cellValue[0]}
          </StyledText>
          <StyledTooltip
            title={
              <StyledFlex gap="2px 0">
                {cellValue.reduce((acc, curr, index) => {
                  if (index === 0) return [...acc];

                  return [
                    ...acc,
                    <StyledText key={curr} size={15} lh={18} color="white">
                      {curr}
                    </StyledText>,
                  ];
                }, [])}
              </StyledFlex>
            }
            arrow
            placement="top"
            maxWidth="auto"
          >
            {cellValueLength > 1 && (
              <StyledText size={15} lh={18} weight={600}>{`+ ${cellValueLength - 1} more`}</StyledText>
            )}
          </StyledTooltip>
        </StyledFlex>
      );

      return renderCellValue();
    },
    size: 289,
    muiTableBodyCellProps: ({ row, table }) => ({
      onClick: () => table.options.meta.setRowSelection(row.original),
      sx: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
    }),
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    enableColumnFilter: true,
    filterFn: (rows, id, filterValue) => {
      const includesFilter = filterValue.includes(rows.getValue(id));

      return filterValue.length > 0 ? includesFilter : true;
    },
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => {
      const statusColor = {
        SUCCESS: 'green',
        FAILED: 'red',
      };

      const cellValue = cell.getValue();

      return (
        <StyledFlex alignItems="center" justifyContent="center" mr="-36px">
          <StyledStatus color={statusColor[cellValue]}>{cellValue}</StyledStatus>
        </StyledFlex>
      );
    },
    size: 130,
    align: 'center',
    muiTableBodyCellProps: ({ row, table }) => ({
      onClick: () => table.options.meta.setRowSelection(row.original),
      sx: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
    }),
  },
];
