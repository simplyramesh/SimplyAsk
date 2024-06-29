import { useTheme } from '@mui/material/styles';
import React from 'react';

import { StyledEmptyValue, StyledText } from '../../../../../../shared/styles/styled';
import { ISSUE_ENTITY_RELATIONS, ISSUE_SERVICE_TICKET_TASKS_STATUSES } from '../../../../../constants/core';

const TicketTasksStat = ({ children, textAlign = 'center', relatedEntities = [] }) => {
  const theme = useTheme();
  const ticketTasks = relatedEntities.filter((entity) => entity.relation === ISSUE_ENTITY_RELATIONS.CHILD);
  const ticketTasksCount = ticketTasks?.length;
  const ticketTasksCompleted = ticketTasks?.filter((entity) => entity.relatedEntity
    ?.status?.toUpperCase() === ISSUE_SERVICE_TICKET_TASKS_STATUSES.COMPLETE).length;

  const allCompleted = ticketTasksCount === ticketTasksCompleted;

  const color = allCompleted ? theme.colors.statusResolved : theme.colors.statusOverdue;

  return (
    <StyledText
      as="span"
      weight={600}
      size={15}
      lh={20}
      color={color}
      textAlign={textAlign}
    >
      {ticketTasksCount ? (
        children({ ticketTasksCount, ticketTasksCompleted })
      ) : (<StyledEmptyValue />)}
    </StyledText>
  );
};

export default TicketTasksStat;
