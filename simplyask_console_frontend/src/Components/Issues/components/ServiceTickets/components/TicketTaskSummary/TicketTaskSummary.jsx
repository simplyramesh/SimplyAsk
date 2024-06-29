import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import routes from '../../../../../../config/routes';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledLink, StyledText } from '../../../../../shared/styles/styled';
import { ISSUE_ENTITY_RELATIONS, ISSUE_SERVICE_TICKET_TASKS_STATUSES } from '../../../../constants/core';
import ServiceTicketsEmptySectionDetail from '../shared/ServiceTicketsEmptySectionDetail/ServiceTicketsEmptySectionDetail';

const TicketTaskSummary = ({ ticket, isLoading }) => {
  const [tasksCount, setTasksCount] = useState();
  const [completedTasksCount, setCompletedTasksCount] = useState();
  const [completePercentage, setCompletePercentage] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const getCompletePercentage = (complete, total) => {
    if (total === 0) {
      return 100;
    }

    return Math.round(complete / (total / 100));
  };

  useEffect(() => {
    if (ticket?.relatedEntities) {
      const ticketTasksEntities = ticket?.relatedEntities.filter((entity) => entity.relation === ISSUE_ENTITY_RELATIONS.CHILD);
      const total = ticketTasksEntities.length;

      const completed = ticketTasksEntities?.filter((entity) => entity.relatedEntity
        ?.status?.toUpperCase() === ISSUE_SERVICE_TICKET_TASKS_STATUSES.COMPLETE).length;

      const completePercentage = getCompletePercentage(completed, total);

      setTasksCount(total);
      setCompletedTasksCount(completed);
      setCompletePercentage(completePercentage);
    }
  }, [ticket]);

  if (isLoading) {
    return <StyledFlex position="relative" minHeight="140px"><Spinner medium inline /></StyledFlex>;
  }

  return (
    <StyledFlex p="30px 20px">
      <StyledFlex direction="row" justifyContent="space-between" mb={1.5}>
        <StyledText weight={600} size={16} lh={24}>Ticket Task Summary</StyledText>
        {ticket && (
          <StyledButton
            variant="text"
            onClick={() => navigate({
              pathname: `${routes.TICKETS}/${ticket.id}`,
              search: 'tab=ticketTasks',
            })}
          >
            <StyledLink
              to={{ pathname: location.pathname, search: 'tab=ticketTasks' }}
              onClick={(e) => e.preventDefault()}
            >
              View All Tasks
            </StyledLink>
          </StyledButton>
        )}
      </StyledFlex>
      {ticket ? (
        <>
          <StyledFlex direction="row" justifyContent="space-between" mb="10px">
            <StyledText>Ticket Tasks</StyledText>
            <StyledText>
              {completedTasksCount}
              /
              {tasksCount}
              {' '}
              Completed (
              {completePercentage}
              %)
            </StyledText>
          </StyledFlex>
          <StyledFlex height="12px" borderRadius="25px" backgroundColor="#ECEFF2">
            <StyledFlex width={`${completePercentage}%`} height="100%" backgroundColor={completePercentage === 100 ? '#5F9936' : '#3865A3'} borderRadius="25px" />
          </StyledFlex>
        </>
      )
        : (
          <ServiceTicketsEmptySectionDetail title="There Are No Ticket Tasks" />
        )}
    </StyledFlex>
  );
};

export default TicketTaskSummary;
