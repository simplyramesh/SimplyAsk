import { endOfDay } from 'date-fns';
import React from 'react';
import { useCreateActivity } from '../../../../../hooks/activities/useCreateActivitiy';
import {
  BASE_DATE_TIME_FORMAT,
  getInFormattedUserTimezone,
  ISO_UTC_DATE_AND_TIME_FORMAT,
  setTimezone,
} from '../../../../../utils/timeUtil';
import { SERVICE_TICKET_FIELDS_TYPE, useOptimisticIssuesUpdate } from '../../../hooks/useOptimisticIssuesUpdate';
import ServiceTicketDueDate from '../../ServiceTickets/components/shared/ServiceTicketCalendar/ServiceTicketDueDate';

const RenderIssueTimePicker = ({ row, table, cell }) => {
  const { user, key } = table.options.meta;
  const { createActionPerformedActivity } = useCreateActivity();
  const { dueDate } = cell.getValue() || {};

  const issue = row.original;
  const timezone = user?.timezone;

  const localUserTime = dueDate ? getInFormattedUserTimezone(dueDate, timezone, ISO_UTC_DATE_AND_TIME_FORMAT) : null;
  const val = localUserTime ? new Date(localUserTime) : '';

  const { mutate } = useOptimisticIssuesUpdate({
    queryKey: key,
    type: SERVICE_TICKET_FIELDS_TYPE.DUE_DATE,
    customOnSuccess: (res) => {
      const date = res?.[0]?.dueDate;
      const newDate = date ? new Date(date) : '';

      createActionPerformedActivity({
        issueId: issue?.id,
        oldValue: getInFormattedUserTimezone(issue?.dueDate, timezone, BASE_DATE_TIME_FORMAT),
        newValue: `Due date updated to ${getInFormattedUserTimezone(newDate, timezone, BASE_DATE_TIME_FORMAT)}`,
        userId: user?.id,
      });
    },
  });

  const handleDueDateChange = (dueDate) => {
    mutate({
      issueId: issue.id,
      assignedToUserId: issue.assignedTo?.id || null,
      dueDate: setTimezone(dueDate, timezone),
    });

    table.setEditingCell(null);
  };

  return (
    <ServiceTicketDueDate
      placeholder=""
      isMenuOpen
      onChange={handleDueDateChange}
      onBlur={() => table.setEditingCell(null)}
      value={val}
      onInputFocus={() => table.setEditingCell(cell)}
      minDate={endOfDay(new Date())}
      isMenuPortal
    />
  );
};

export default RenderIssueTimePicker;
