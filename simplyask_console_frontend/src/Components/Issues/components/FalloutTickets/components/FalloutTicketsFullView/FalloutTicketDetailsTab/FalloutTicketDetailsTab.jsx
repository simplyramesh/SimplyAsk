import { useTheme } from '@emotion/react';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { toast } from 'react-toastify';

import { GET_FALLOUT_TICKET_BY_INCIDENT_ID } from '../../../../../../../hooks/fallout/useFalloutDetails';
import ExecutionParameters from '../../../../../../shared/ExecutionParameters/ExecutionParameters';
import { StyledExpandButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledDivider, StyledFlex, StyledResizeHandle, StyledText } from '../../../../../../shared/styles/styled';
import FalloutProcessEditor from '../../../../../../WorkflowEditor/FalloutProcessEditor';
import { ISSUE_ENTITY_TYPE, ISSUE_FALLOUT_PARAMETER_TYPES } from '../../../../../constants/core';
import { useRemoveLinkedServiceTicket } from '../../../../../hooks/useRemoveLinkedServiceTicket';
import { useUpdateRelatedEntities } from '../../../../../hooks/useUpdateRelatedEntities';
import LinkedItems from '../../../../ServiceTickets/components/shared/LinkedItems/LinkedItems';
import ServiceTicketTypeIcon from '../../../../ServiceTickets/components/shared/ServiceTicketTypeIcon/ServiceTicketTypeIcon';
import ServiceTicketActivities from '../../../../ServiceTickets/components/shared/TicketActivities/TicketActivities';
import { linkedItemMapper, mapRelatedEntitiesToDto } from '../../../../ServiceTickets/utils/helpers';
import { getIssueParameterGroup } from '../../../utils/helpers';
import { StyledActionsDiagram } from '../../FalloutTicketActionsView/StyledFalloutTicketActionsView';

import FalloutTicketDetailsPanel from './FalloutTicketDetailsPanel/FalloutTicketDetailsPanel';

const FalloutTicketDetailsTab = ({ ticket, ticketType, queryKey }) => {
  const { colors, boxShadows } = useTheme();
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const { updateRelatedEntities } = useUpdateRelatedEntities({
    onSuccess: () => toast.success(`${ticket.displayName} has been updated successfully`),
    onError: () => toast.error(`Error updating ${ticket.displayName}`),
  });

  const { removeLinkedServiceTicket } = useRemoveLinkedServiceTicket({
    queryKey: [queryKey, ticket.id],
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

  const relatedProcessEntity = ticket?.relatedEntities?.find((entity) => entity.type === ISSUE_ENTITY_TYPE.PROCESS);

  const procInstanceId = relatedProcessEntity?.relatedEntity?.procInstanceId;

  const processId = ticket?.workflowId;

  return (
    <PanelGroup autoSaveId="fallout-ticket-view" direction="horizontal">
      <Panel defaultSize={75}>
        <StyledFlex backgroundColor={colors.white} height="100%" boxShadow={boxShadows.box}>
          <Scrollbars id="fallout-ticket-view-main">
            <StyledFlex p="30px" gap="16px">
              <StyledFlex direction="row" alignItems="center" gap={1.5}>
                <ServiceTicketTypeIcon type={ticketType} wrapperWidth={35} wrapperHeight={35} />
                <StyledText>#{ticket.id}</StyledText>
              </StyledFlex>

              <StyledFlex flex="1">
                <StyledText size={24} weight={600} lh={36} mb="10px">
                  {ticket.displayName}
                </StyledText>
              </StyledFlex>
            </StyledFlex>

            <StyledDivider orientation="horizontal" height="2px" />

            <StyledFlex p="30px">
              <StyledFlex mb={7}>
                <StyledText mb={16} weight="600">
                  Fallout Message
                </StyledText>
                <StyledText wordBreak="break-all">{ticket?.additionalFields?.incidentMessage}</StyledText>
              </StyledFlex>

              {processId && procInstanceId && (
                <StyledFlex mb={7}>
                  <StyledText mb={18} weight="600">
                    Execution Path
                  </StyledText>

                  <StyledActionsDiagram>
                    <FalloutProcessEditor processId={processId} processInstanceId={procInstanceId} />
                  </StyledActionsDiagram>
                </StyledFlex>
              )}

              <StyledFlex mb={7}>
                <LinkedItems
                  relatedEntities={ticket.relatedEntities}
                  entityMapper={linkedItemMapper}
                  onSave={(e) => onRelatedEntitySave(e)}
                  onUnlink={(e) => onRelatedEntityUnlink(e)}
                  ticketId={ticket.id}
                />
              </StyledFlex>
              <StyledFlex>
                <ServiceTicketActivities ticketId={ticket.id} isFalloutTicketMode />
              </StyledFlex>
            </StyledFlex>
          </Scrollbars>
        </StyledFlex>
      </Panel>

      <StyledResizeHandle>
        <StyledExpandButton onClick={() => setIsPanelOpen((prev) => !prev)}>
          {isPanelOpen ? <KeyboardArrowRightRoundedIcon /> : <KeyboardArrowLeftRoundedIcon />}
        </StyledExpandButton>
      </StyledResizeHandle>

      {isPanelOpen && (
        <Panel defaultSize={25} minSize={25} maxSize={40}>
          <StyledFlex boxShadow={boxShadows.box} height="100%" position="relative" backgroundColor={colors.white}>
            <Scrollbars id="fallout-ticket-view-panel">
              <StyledDivider orientation="horizontal" height="2px" />

              <StyledFlex padding="30px 20px">
                <FalloutTicketDetailsPanel
                  ticketDetails={ticket}
                  ticketByIdQueryKey={[GET_FALLOUT_TICKET_BY_INCIDENT_ID, ticket.id]}
                  queryKey={[GET_FALLOUT_TICKET_BY_INCIDENT_ID, ticket.id]}
                  isFullViewMode={true}
                />
              </StyledFlex>

              <StyledDivider orientation="horizontal" height="2px" color={colors.dividerDarkColor} />

              <StyledFlex padding="30px 20px">
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
            </Scrollbars>
          </StyledFlex>
        </Panel>
      )}
    </PanelGroup>
  );
};

export default FalloutTicketDetailsTab;
