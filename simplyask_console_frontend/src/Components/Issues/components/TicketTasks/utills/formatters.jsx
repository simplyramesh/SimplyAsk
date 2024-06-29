import React from 'react';

import { Skeleton } from '@mui/material';
import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../../utils/timeUtil';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import HeaderCell from '../../../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import { StyledEmptyValue, StyledFlex, StyledStatus, StyledText } from '../../../../shared/styles/styled';
import { ISSUE_ENTITY_RELATIONS } from '../../../constants/core';
import { renderRowHoverAction, rowHoverActionColumnProps } from '../../../utills/formatters';
import RenderTicketName from '../../ServiceTickets/utils/TableFormatters/RenderTicketName';
import { SERVICE_TICKET_TASK_STATUS_MAP } from '../../ServiceTickets/utils/helpers';
import RenderIssueAssignee from '../../shared/TableFormatters/RenderIssueAssignee';
import RenderIssueAssigneeEdit from '../../shared/TableFormatters/RenderIssueAssigneeEdit';
import TicketTasksActions from '../components/TicketTasksActions/TicketTasksActions';
import TicketTasksName from '../components/TicketTasksName/TicketTasksName';

export const formatDescriptionLineBreak = (text = '') => text?.replaceAll('\\n', '\n');

const renderDateTime = (time, table) => {
  const { timezone } = table.options.meta;

  const dateTimeFormat = (isTime) => {
    const format = isTime ? BASE_TIME_FORMAT : BASE_DATE_FORMAT;

    return getInFormattedUserTimezone(time, timezone, format);
  };

  return (
    <StyledFlex>
      {time ? (
        <>
          <StyledText size={15} lh={23}>
            {dateTimeFormat(false)}
          </StyledText>
          <StyledText size={15} lh={23}>
            {dateTimeFormat(true)}
          </StyledText>
        </>
      ) : (
        <StyledEmptyValue />
      )}
    </StyledFlex>
  );
};

const renderCellSkeleton = (cell) => {
  const { isDeleting, isUpdating } = cell.getValue() || {};

  if (isDeleting || isUpdating) return <Skeleton />;

  return null;
};

const TICKET_TASKS_FIRST_SECTION_COLUMNS = [
  {
    header: 'Ticket Task',
    accessorFn: (row) => ({
      displayName: row.displayName,
      id: row.id,
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
    }),
    id: 'displayName',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, row, table }) => renderCellSkeleton(cell) || <TicketTasksName cell={cell} row={row} table={table} />,
    enableGlobalFilter: false,
    size: 400,
    align: 'left',
    enableEditing: false,
  },
  {
    header: 'Status',
    id: 'status',
    accessorFn: (row) => ({
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
      status: row.status,
    }),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => {
      const { status } = cell.getValue() || {};
      const color = SERVICE_TICKET_TASK_STATUS_MAP[status]?.color;

      return (
        renderCellSkeleton(cell) || (
          <StyledStatus height="34px" color={color} width="fit-content" minWidth="0px">
            {status}
          </StyledStatus>
        )
      );
    },
    size: 191,
    align: 'left',
    enableGlobalFilter: false,
    enableEditing: false,
  },
  {
    header: 'Action',
    accessorFn: (row) => ({
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
      issueType: row.actionPerformed,
    }),
    id: 'actionPerformed',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, row, table }) => {
      const { serviceTaskTypes, handleCompleteTask, handleRevertTaskAction } = table.options.meta;

      return (
        renderCellSkeleton(cell) || (
          <TicketTasksActions
            table={table}
            serviceTaskTypes={serviceTaskTypes}
            onCompleteTask={handleCompleteTask}
            onRevertTaskAction={handleRevertTaskAction}
            task={row.original}
          />
        )
      );
    },
    size: 301,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Type',
    accessorFn: (row) => ({
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
      issueType: row.issueType,
    }),
    id: 'issueType',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => {
      const { issueType } = cell.getValue() || {};

      return (
        renderCellSkeleton(cell) || (
          <StyledText size={15} lh={23}>
            {issueType}
          </StyledText>
        )
      );
    },
    size: 158,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
];

const TICKET_TASKS_SECOND_SECTION_COLUMNS = [
  {
    header: 'Assignee',
    accessorFn: (row) => ({
      assignedTo: row.assignedTo?.name,
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
    }),
    id: 'assignedTo',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, table }) => <RenderIssueAssignee cell={cell} table={table} />,
    Edit: ({ row, table }) => <RenderIssueAssigneeEdit row={row} table={table} />,
    minSize: 250,
    align: 'left',
    enableGlobalFilter: false,
    enableEditing: true,
  },
  {
    header: 'Created On',
    accessorFn: (row) => ({
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
      time: row.createdAt,
    }),
    id: 'createdAt',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, table }) => renderCellSkeleton(cell) || renderDateTime(cell.getValue()?.time, table),
    size: 151,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
  },
  {
    header: 'Resolved On',
    accessorFn: (row) => ({
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
      time: row?.resolvedAt,
    }),
    id: 'resolvedAt',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, table }) => renderCellSkeleton(cell) || renderDateTime(cell.getValue()?.time, table),
    size: 158,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
  },
  {
    header: 'Resolved By',
    accessorFn: (row) => ({
      isDeleting: row?.isDeleting,
      isUpdating: row?.isUpdating,
      resolvedBy: row?.resolvedBy,
    }),
    id: 'resolvedBy',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => {
      const { resolvedBy } = cell.getValue() || {};

      return renderCellSkeleton(cell) || resolvedBy || <StyledEmptyValue />;
    },
    size: 250,
    align: 'left',
    enableGlobalFilter: false,
    enableEditing: false,
  },
  {
    header: '',
    accessorKey: 'deleteById',
    id: 'deleteById',
    accessorFn: (row) => ({
      isDeleting: row?.isDeleting,
      id: row.id,
      name: row.displayName,
    }),
    Cell: ({ cell, row, table }) => {
      const { id, name } = cell.getValue() || {};
      const { handleSingleDelete } = table.options.meta;

      return (
        renderCellSkeleton(cell) ||
        renderRowHoverAction({
          icon: <CustomTableIcons width={32} icon="REMOVE" />,
          onClick: () => handleSingleDelete({ id, name, task: row.original, action: 'Delete' }),
          toolTipTitle: 'Delete',
        })
      );
    },
    ...rowHoverActionColumnProps(),
    size: 70,
    align: 'right',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
];

export const TICKET_TASKS_COLUMNS = [...TICKET_TASKS_FIRST_SECTION_COLUMNS, ...TICKET_TASKS_SECOND_SECTION_COLUMNS];

export const SERVICE_TICKET_TASKS_COLUMNS = [
  ...TICKET_TASKS_FIRST_SECTION_COLUMNS,
  {
    header: 'Associated Service Ticket',
    accessorFn: (row) => {
      const findParentInRelatedEntities = row?.relatedEntities.find(
        (entity) => entity.relation === ISSUE_ENTITY_RELATIONS.PARENT
      );
      const parentName = findParentInRelatedEntities?.relatedEntity?.displayName || '';
      const parentId = findParentInRelatedEntities?.id || row.parent;

      return {
        isDeleting: row?.isDeleting,
        isUpdating: row?.isUpdating,
        name: parentName,
        id: parentId,
      };
    },
    id: 'parent',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, row, table }) => <RenderTicketName cell={cell} row={row} table={table} isTask />,
    size: 400,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  ...TICKET_TASKS_SECOND_SECTION_COLUMNS,
];
