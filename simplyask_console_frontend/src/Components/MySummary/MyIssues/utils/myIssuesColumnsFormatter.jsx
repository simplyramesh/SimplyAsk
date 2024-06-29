import React from 'react';

import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import { StyledEmptyValue, StyledFlex, StyledStatus, StyledText } from '../../../shared/styles/styled';
import TicketTasksDueDate from '../../../Issues/components/ServiceTickets/components/shared/TicketTasksDueDate/TicketTasksDueDate';
import ServiceTicketStatus from '../../../Issues/components/ServiceTickets/components/shared/ServiceTicketStatus/ServiceTicketStatus';

export const STATUS_MAP = {
  ASSIGNED: { label: 'Assigned', color: 'yellow' },
  OVERDUE: { label: 'Overdue', color: 'red' },
  RESOLVED: { label: 'Resolved', color: 'green' },
  UNASSIGNED: { label: 'Unassigned', color: 'grey' },
  CREATED: { label: 'Created', color: 'grey' },
};

export const selectedFiltersMeta = {
  key: 'sideFilter',
  formatter: {
    createdDate: ({ v, k }) => ({
      label: 'Created date',
      value: v?.label,
      k,
    }),
    dueDate: ({ v, k }) => ({
      label: 'Due Date',
      value: v?.label,
      k,
    }),
    issueCategoryId: ({ v, k }) => ({
      label: 'Issue Type',
      value: v?.map((item) => item.label) || '',
      k,
    }),
  },
};

const renderName = ({ cell, table, row }) => {
  const { displayName, id } = cell.getValue();
  return (
    <StyledFlex onClick={() => table.options.meta.onNameClick(row.original)}>
      <StyledText size={15} weight={600} lh={28} color="inherit">
        {displayName}
      </StyledText>
      <StyledText size={12} weight={400} lh={18} color="inherit">
        #{id}
      </StyledText>
    </StyledFlex>
  );
};

const renderTime = ({ cell, table }) => {
  const time = cell.getValue();
  const timezone = table.options.meta.user?.timezone;

  return (
    <StyledText size={15} weight={400} lh={22}>
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_DATE_FORMAT)}</StyledFlex>
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_TIME_FORMAT)}</StyledFlex>
    </StyledText>
  );
};

const renderDueDate = ({ cell, table }) => {
  return !cell.getValue()?.length ? (
    <StyledEmptyValue />
  ) : (
    <TicketTasksDueDate val={cell.getValue()}>
      {renderTime({
        cell,
        table,
      })}
    </TicketTasksDueDate>
  );
};
const renderStatus = ({ row, table }) => {
  const { issueCategories } = table.options.meta;
  const issue = row.original;

  const ticketCategory = issueCategories?.find((category) => category.name === issue.category);
  const ticketType = ticketCategory?.types?.find((type) => type.name === issue.issueType);
  const status = ticketType?.statuses.find((status) => status.name === issue.status);

  return (
    <ServiceTicketStatus color={status?.colour} minWidth="auto">
      {status?.name}
    </ServiceTicketStatus>
  );
};

export const MY_ISSUES_COLUMNS = [
  {
    header: 'Issue name',
    accessorFn: ({ id, displayName }) => ({ id, displayName }),
    Cell: (props) => renderName(props),
    id: 'displayName',
    size: 300,
  },
  {
    header: 'Date Created',
    accessorFn: (row) => row.createdAt,
    Cell: ({ cell, table }) => renderTime({ cell, table }),
    id: 'createdAt',
    size: 200,
  },
  {
    header: 'Due Date',
    accessorFn: (row) => row.dueDate,
    Cell: (props) => renderDueDate(props),
    id: 'dueDate',
    size: 200,
  },
  {
    header: 'Issue Type',
    accessorFn: (row) => row.category,
    Cell: ({ cell }) => <StyledText size={14}>{cell.getValue()}</StyledText>,
    id: 'category',
    size: 200,
  },
  {
    header: 'Status',
    accessorFn: (row) => (
      <StyledStatus color={STATUS_MAP[row.status]?.color}>{STATUS_MAP[row.status]?.label}</StyledStatus>
    ),
    Cell: (props) => renderStatus(props),
    id: 'status',
    size: 180,
  },
];

export const formatter = (values) => ({
  createdAfter: values.sideFilter.createdDate?.filterValue?.createdAfter || '',
  createdBefore: values.sideFilter.createdDate?.filterValue?.createdBefore || '',
  dueBefore: values.sideFilter.dueDate?.filterValue?.dueBefore || '',
  dueAfter: values.sideFilter.dueDate?.filterValue?.dueAfter || '',
  issueCategoryId: values.sideFilter.issueCategoryId?.map(({ value }) => value) || '',
  timezone: values.timezone || '',
  returnParameters: true,
  returnAdditionalField: true,
  returnRelatedEntities: true,
  assignedTo: values.assignedTo,
});
