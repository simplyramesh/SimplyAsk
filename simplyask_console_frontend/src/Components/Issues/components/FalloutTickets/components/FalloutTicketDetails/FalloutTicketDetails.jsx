import { useTheme } from '@emotion/react';
import Scrollbars from 'react-custom-scrollbars-2';
import { generatePath } from 'react-router-dom';
import routes from '../../../../../../config/routes';
import {
  GET_FALLOUT_TICKET_BY_INCIDENT_ID,
  useFalloutDetails
} from '../../../../../../hooks/fallout/useFalloutDetails';
import OpenIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import { useRemoveLinkedServiceTicket } from '../../../../hooks/useRemoveLinkedServiceTicket';
import { useUpdateRelatedEntities } from '../../../../hooks/useUpdateRelatedEntities';

import LinkedItems from '../../../ServiceTickets/components/shared/LinkedItems/LinkedItems';
import ServiceTicketActivities from '../../../ServiceTickets/components/shared/TicketActivities/TicketActivities';

import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import ExecutionParameters from '../../../../../shared/ExecutionParameters/ExecutionParameters';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledDivider, StyledEmptyValue, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { ISSUE_FALLOUT_PARAMETER_TYPES } from '../../../../constants/core';
import { linkedItemMapper, mapRelatedEntitiesToDto } from '../../../ServiceTickets/utils/helpers';
import { getIssueParameterGroup } from '../../utils/helpers';
import FalloutTicketDetailsPanel from '../FalloutTicketsFullView/FalloutTicketDetailsTab/FalloutTicketDetailsPanel/FalloutTicketDetailsPanel';

const FalloutTicketDetails = ({ queryKey, falloutTicketId = {}, onUpdate }) => {
  const { colors, boxShadows } = useTheme();
  const { currentUser } = useGetCurrentUser();

  const { falloutTicketDetails: ticket, isLoading: isTicketLoading } = useFalloutDetails({
    incidentId: falloutTicketId,
    timezone: currentUser?.timezone,
  });

  const { updateRelatedEntities } = useUpdateRelatedEntities({
    onSuccess: () => toast.success(`${ticket.displayName} has been updated successfully`),
    onError: () => toast.error(`Error updating ${ticket.displayName}`),
  });

  const { removeLinkedServiceTicket } = useRemoveLinkedServiceTicket({
    queryKey: [queryKey, ticket?.id],
    onSuccess: () => toast.success(`${ticket.displayName} has been updated successfully`),
    onError: () => {
      toast.error(`Error updating ${ticket.displayName}`);
    },
  });

  const onRelatedEntitySave = ({ relation, relatedEntity }) => {
    const currentEntities = mapRelatedEntitiesToDto(ticket.relatedEntities);

    const issueId = ticket.id;
    const payload = [
      ...currentEntities,
      {
        type: relatedEntity.type,
        entityId: relatedEntity.id,
        relation,
      },
    ];

    updateRelatedEntities({ params: { issueId }, body: payload });
  };

  const onRelatedEntityUnlink = (entity) => {
    const currentEntities = mapRelatedEntitiesToDto(ticket.relatedEntities);

    const issueId = ticket.id;
    const payload = currentEntities.filter((currEntity) => currEntity.id !== entity.id);

    removeLinkedServiceTicket({ params: { issueId, deletedTicket: entity.id }, body: payload });
  };

  const handleOpenProcessClick = () => {
    const url = generatePath(routes.PROCESS_MANAGER_INFO, {
      processId: ticket?.workflowId,
    });

    window.open(url, '_blank');
  };

  // Todo Remove "|| ticket?.displayName;" when all fallouts have processDisplayName in BE
  const ticketName = ticket?.processDisplayName || ticket?.displayName;

  return (
    <StyledFlex boxShadow={boxShadows.box} height="100%" position="relative" backgroundColor={colors.white}>
      {isTicketLoading && <Spinner fadeBgParent />}

      <Scrollbars id="fallout-ticket-view-panel">
        <StyledFlex padding="35px 35px 0 35px" flexDirection="column">
          <StyledText size={24} weight={600}>
            {ticketName || <StyledEmptyValue />}
          </StyledText>

          <StyledFlex width="255px" marginTop="15px">
            <StyledButton
              variant="contained"
              tertiary
              startIcon={<OpenIcon width={18} />}
              onClick={handleOpenProcessClick}
            >
              Open in Process Editor
            </StyledButton>
          </StyledFlex>

          <StyledFlex direction="column" marginTop="45px">
            <StyledText mb={16} weight="600" size={19}>
              Fallout Message
            </StyledText>

            <StyledText wordBreak="break-all">
              {ticket?.additionalFields?.incidentMessage || <StyledEmptyValue />}
            </StyledText>
          </StyledFlex>
        </StyledFlex>

        <StyledFlex padding="50px 20px 20px 20px">
          <StyledDivider orientation="horizontal" borderWidth={3} />
        </StyledFlex>

        <StyledFlex padding="30px 20px">
          <FalloutTicketDetailsPanel
            ticketDetails={ticket}
            queryKey={queryKey}
            ticketByIdQueryKey={[GET_FALLOUT_TICKET_BY_INCIDENT_ID, ticket?.id]}
          />

          <StyledFlex padding="55px 0 0 0">
            <ExecutionParameters
              data={{
                requestData: getIssueParameterGroup(ticket, ISSUE_FALLOUT_PARAMETER_TYPES.REQUEST_DATA),
                executionData: getIssueParameterGroup(ticket, ISSUE_FALLOUT_PARAMETER_TYPES.EXECUTION_DATA),
              }}
              isDataStringified={false}
              showRootDivider={false}
              noPaddings
              showInputParamEmptyCard
              showExecutionParamEmptyCard
            />
          </StyledFlex>

          <StyledDivider orientation="horizontal" borderWidth={3} m="50px 0" />

          <StyledFlex padding="0 15px" gap="65px">
            <StyledFlex>
              <LinkedItems
                relatedEntities={ticket?.relatedEntities}
                entityMapper={linkedItemMapper}
                onSave={(e) => onRelatedEntitySave(e)}
                onUnlink={(e) => onRelatedEntityUnlink(e)}
                ticketId={ticket?.id}
                titleSize={19}
              />
            </StyledFlex>

            <StyledFlex>
              <ServiceTicketActivities ticketId={ticket?.id} titleSize={19} isFalloutTicketMode />
            </StyledFlex>
          </StyledFlex>
        </StyledFlex>
      </Scrollbars>
    </StyledFlex>
  );
};

export default FalloutTicketDetails;
