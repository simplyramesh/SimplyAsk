import { useTheme } from '@emotion/react';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Popover } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import CopyIcon from '../../../../../../../Assets/icons/copy.svg?component';
import routes from '../../../../../../../config/routes';
import { useCreateActivity } from '../../../../../../../hooks/activities/useCreateActivitiy';
import useCopyToClipboard from '../../../../../../../hooks/useCopyToClipboard';
import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';
import { usePopoverToggle } from '../../../../../../../hooks/usePopoverToggle';
import { StyledButton, StyledExpandButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { RichTextEditor } from '../../../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import CustomTableIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSidebar from '../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  StyledDivider,
  StyledFlex,
  StyledLink,
  StyledResizeHandle,
  StyledText,
} from '../../../../../../shared/styles/styled';
import { ISSUES_QUERY_KEYS } from '../../../../../constants/core';
import {
  onTicketDetailsCustomUpdate,
  SERVICE_TICKET_FIELDS_TYPE,
  useOptimisticIssuesUpdate,
} from '../../../../../hooks/useOptimisticIssuesUpdate';
import { useRemoveLinkedServiceTicket } from '../../../../../hooks/useRemoveLinkedServiceTicket';
import { useUpdateRelatedEntities } from '../../../../../hooks/useUpdateRelatedEntities';
import TicketTasksDetailsSidebar from '../../../../TicketTasks/components/TicketTasksDetailsSidebar/TicketTasksDetailsSidebar';
import EditValueTrigger from '../../../../shared/EditValueTrigger/EditValueTrigger';
import EditableRichDescription from '../../../../shared/EditableRichDescription/EditableRichDescription';
import { useOptimisticDeleteServiceTicket } from '../../../hooks/useOptimisticDeleteServiceTicket';
import { linkedItemMapper, mapRelatedEntitiesToDto } from '../../../utils/helpers';
import TicketTaskSummary from '../../TicketTaskSummary/TicketTaskSummary';
import LinkedItems from '../../shared/LinkedItems/LinkedItems';
import ServiceTicketTypeIcon from '../../shared/ServiceTicketTypeIcon/ServiceTicketTypeIcon';
import ServiceTicketActivities from '../../shared/TicketActivities/TicketActivities';
import TicketAutoFocusInput from '../../shared/TicketAutoFocusInput';
import TicketDetailsAdditionalFields from '../../shared/TicketDetailsAdditionalFields/TicketDetailsAdditionalFields';
import TicketDetailsAttachments from '../../shared/TicketDetailsAttachments/TicketDetailsAttachments';
import TicketDetailsDetails from '../../shared/TicketDetailsDetails/TicketDetailsDetails';

const TicketDetailsTab = ({ ticket, dataUpdatedAt, ticketType, getAllAttachedFiles, queryKey }) => {
  const { colors, boxShadows } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { currentUser: user } = useGetCurrentUser();

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [ticketName, setTicketName] = useState(ticket?.displayName || '');
  const [ticketDesc, setTicketDesc] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const serviceTicketQueryKeyRef = useRef(null);
  const [ticketToSingleDelete, setTicketToSingleDelete] = useState(null);
  const richTextEditorRef = useRef(null);
  const [showMoreText, setShowMoreText] = useState({
    textHeight: 6,
    shouldShow: true,
  });

  const [showTicketTaskSidebar, setShowTicketTaskSidebar] = useState(null);

  const { copyToClipboard } = useCopyToClipboard('Copy URL of Service Ticket');

  const {
    id: idDeletePopover,
    open: openDeletePopover,
    anchorEl: anchorElDeletePopover,
    handleClick: handleClickDeletePopover,
    handleClose: handleCloseDeletePopover,
  } = usePopoverToggle('delete-popover');

  const { createActionPerformedActivity } = useCreateActivity();

  const { mutate: handleDisplayNameUpdate } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.DISPLAY_NAME,
    ...onTicketDetailsCustomUpdate(queryKey),
    customOnSuccess: (data, variables, { customMutationPrevData, customMutationNewData }) => {
      createActionPerformedActivity({
        issueId: customMutationNewData.id,
        oldValue: customMutationPrevData.displayName,
        newValue: `Name updated to ${customMutationNewData.displayName}`,
        userId: user.id,
      });
    },
    ignoreToasts: true,
  });

  const { mutate: handleDescriptionUpdate, isLoading: isDescriptionUpdating } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.DESCRIPTION,
    ...onTicketDetailsCustomUpdate(queryKey),
    customOnSuccess: (data, variables, { customMutationPrevData }) => {
      createActionPerformedActivity({
        issueId: ticket.id,
        oldValue: customMutationPrevData.description,
        newValue: 'Edit Description',
        userId: user.id,
      });
      setTicketDesc(null);
    },
    ignoreToasts: true,
  });

  const { updateRelatedEntities } = useUpdateRelatedEntities({
    onError: () => toast.error(`Error updating ${ticket.displayName}`),
  });

  const { removeLinkedServiceTicket } = useRemoveLinkedServiceTicket({
    queryKey,
    onError: () => {
      toast.error(`Error updating ${ticket.displayName}`);
    },
  });

  const { mutate: removeSingleIssue } = useOptimisticDeleteServiceTicket({
    queryKey: serviceTicketQueryKeyRef.current,
    onSuccess: () => {
      toast.success(`[${ticketToSingleDelete?.displayName}] has been deleted successfully!`);
      queryClient.invalidateQueries(ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS);
    },
    isTicketDetailsFullView: true,
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

  const handleLinkedChildEntity = (ticketTask) => setShowTicketTaskSidebar(ticketTask);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (richTextEditorRef.current) {
        const scrollHeight = richTextEditorRef.current.children[0].scrollHeight;
        const shouldShow = scrollHeight > 195;
        const textHeight = shouldShow ? 6 : null;

        setShowMoreText({
          textHeight,
          shouldShow,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isDescriptionUpdating]);

  return (
    <PanelGroup autoSaveId="service-ticket-view" direction="horizontal">
      <Panel defaultSize={75}>
        <StyledFlex backgroundColor={colors.white} height="100%" boxShadow={boxShadows.box}>
          <Scrollbars id="service-ticket-view-main">
            <StyledFlex p="30px" gap="16px">
              <StyledFlex direction="row" alignItems="center" gap={1.5}>
                <ServiceTicketTypeIcon type={ticketType} wrapperWidth={35} wrapperHeight={35} />
                <StyledText>
                  <StyledLink to={location.pathname} themeColor="primary" onClick={(e) => e.preventDefault()}>
                    #{ticket.id}
                  </StyledLink>
                </StyledText>
              </StyledFlex>
              <EditValueTrigger
                minHeight={45}
                margin="0 10px 45px 10px"
                editableComponent={(setEditing) => (
                  <StyledFlex flex="1" mx="-11px">
                    <TicketAutoFocusInput
                      placeholder={ticket.displayName}
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      onBlur={() => {
                        setTicketName(ticket.displayName);
                        setEditing(false);
                      }}
                      onConfirm={() => {
                        handleDisplayNameUpdate({
                          dueDate: ticket.dueDate,
                          issueId: ticket.id,
                          assignedToUserId: ticket.assignedTo?.id || null,
                          displayName: ticketName,
                          description: ticket.description,
                        });
                        setEditing(false);
                      }}
                    />
                  </StyledFlex>
                )}
              >
                <StyledFlex flex="1">
                  <StyledText size={24} weight={600} lh={36} mb="10px">
                    {ticket.displayName}
                  </StyledText>
                </StyledFlex>
              </EditValueTrigger>
            </StyledFlex>
            <StyledDivider orientation="horizontal" height="2px" />
            <StyledFlex p="30px">
              <StyledFlex mb={7}>
                <StyledText mb={16} weight="600">
                  Description
                </StyledText>
                <EditValueTrigger
                  minHeight={0}
                  bgTopBotOffset={14}
                  onEdit={() =>
                    setShowMoreText((prevState) => ({
                      ...prevState,
                      shouldShow: false,
                    }))
                  }
                  editableComponent={(setEditing, key) => (
                    <EditableRichDescription
                      placeholder="Add description..."
                      description={ticket.description}
                      key={`${key}-${dataUpdatedAt}`}
                      onCancel={() => {
                        setEditing(false);
                      }}
                      onSave={(description) => {
                        handleDescriptionUpdate({
                          dueDate: ticket.dueDate,
                          issueId: ticket.id,
                          assignedToUserId: ticket.assignedTo?.id || null,
                          displayName: ticket.displayName,
                          description,
                        });
                        setTicketDesc(description);
                        setEditing(false);
                      }}
                    />
                  )}
                >
                  <RichTextEditor
                    key="ticket-details-tab-description" // Using dateUpdated as key causes 'blinking' whenever the ticket is updated
                    readOnly
                    minHeight={0}
                    editorState={ticketDesc || ticket.description}
                    placeholder="No Description..."
                    maxLines={showMoreText.textHeight}
                    richTextEditorRef={richTextEditorRef}
                  />
                </EditValueTrigger>
                {showMoreText.shouldShow && (
                  <StyledFlex alignItems="start" mt="14px" mb="4px">
                    <StyledButton
                      variant="text"
                      onClick={() =>
                        setShowMoreText((prevState) => ({
                          ...prevState,
                          textHeight: prevState.textHeight ? null : 6,
                        }))
                      }
                    >
                      {showMoreText.textHeight ? 'Show More' : 'Show Less'}
                    </StyledButton>
                  </StyledFlex>
                )}
              </StyledFlex>

              <StyledFlex mb={7}>
                <TicketDetailsAttachments
                  ticketDetails={ticket}
                  getAllAttachedFiles={getAllAttachedFiles}
                  showSuccesToast={false}
                  isTicketDetailFullView
                />
              </StyledFlex>

              <StyledFlex mb={7}>
                <LinkedItems
                  relatedEntities={ticket.relatedEntities}
                  entityMapper={linkedItemMapper}
                  onSave={(e) => onRelatedEntitySave(e)}
                  onUnlink={(e) => onRelatedEntityUnlink(e)}
                  ticketId={ticket.id}
                  onLinkedChildEntity={handleLinkedChildEntity}
                />
              </StyledFlex>
              <StyledFlex>
                <ServiceTicketActivities ticketId={ticket.id} />
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
            <Scrollbars id="service-ticket-view-panel">
              <StyledFlex direction="row" alignItems="center" justifyContent="end" gap="15px" m="32px 20px 0px 0px">
                <StyledTooltip title={copyMessage} arrow placement="top" p="10px 15px" maxWidth="auto">
                  <StyledFlex
                    as="span"
                    maxWidth="38px"
                    maxHeight="38px"
                    padding="8px 8px 8px 10px"
                    cursor="pointer"
                    borderRadius="7px"
                    backgroundColor={colors.darkGrayHoverFilterIcon}
                    onClick={() => {
                      copyToClipboard(`${window.location.href}`);
                      setCopyMessage('Copied!');
                    }}
                    onMouseLeave={() => setCopyMessage('Copy URL of Service Ticket')}
                  >
                    <CopyIcon />
                  </StyledFlex>
                </StyledTooltip>
                <StyledTooltip title="Actions" arrow placement="bottom" p="10px 15px" maxWidth="auto">
                  <StyledFlex
                    as="span"
                    maxWidth="38px"
                    maxHeight="38px"
                    padding="1px 1px 1px 2px"
                    cursor="pointer"
                    borderRadius="7px"
                    backgroundColor={colors.darkGrayHoverFilterIcon}
                    onClick={handleClickDeletePopover}
                  >
                    <MoreHorizIcon fontSize="large" />
                  </StyledFlex>
                </StyledTooltip>

                <Popover
                  id={idDeletePopover}
                  open={openDeletePopover}
                  anchorEl={anchorElDeletePopover}
                  onClose={handleCloseDeletePopover}
                  sx={{
                    top: 20,
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <StyledFlex
                    cursor="pointer"
                    p="5px 10px"
                    direction="row"
                    gap="10px"
                    alignItems="center"
                    onClick={() => {
                      setTicketToSingleDelete(ticket);
                      handleCloseDeletePopover();
                    }}
                  >
                    <CustomTableIcons icon="REMOVE" width={24} />
                    Delete Ticket
                  </StyledFlex>
                </Popover>
              </StyledFlex>
              <StyledFlex>
                <TicketTaskSummary ticket={ticket} />
              </StyledFlex>
              <StyledDivider orientation="horizontal" height="2px" />
              <StyledFlex padding="30px 20px">
                <TicketDetailsDetails ticketDetails={ticket} queryKey={queryKey} ticketByIdQueryKey={queryKey} />
              </StyledFlex>
              <StyledDivider orientation="horizontal" height="2px" />
              <StyledFlex padding="30px 20px">
                <TicketDetailsAdditionalFields
                  ticket={ticket}
                  ticketType={ticketType}
                  additionalFields={ticket?.additionalFields}
                />
              </StyledFlex>
            </Scrollbars>
          </StyledFlex>
        </Panel>
      )}

      <CustomSidebar
        open={!!showTicketTaskSidebar}
        onClose={() => setShowTicketTaskSidebar(null)}
        headerTemplate={
          !!showTicketTaskSidebar && (
            <StyledFlex gap="10px">
              <StyledFlex direction="row" alignItems="center" gap="15px">
                <StyledFlex>
                  <StyledText size={16} weight={500} lh={20}>
                    #{showTicketTaskSidebar?.id}
                  </StyledText>
                </StyledFlex>
                <StyledFlex alignItems="center">
                  <StyledDivider borderWidth={2} color={colors.jetStreamGray} orientation="vertical" height="17px" />
                </StyledFlex>
                <StyledText weight={500} lh={20}>
                  {showTicketTaskSidebar?.displayName}
                </StyledText>
              </StyledFlex>
            </StyledFlex>
          )
        }
        ModalProps={{
          keepMounted: false,
        }}
      >
        {() => (
          <TicketTasksDetailsSidebar
            open={!!showTicketTaskSidebar}
            onClose={() => setShowTicketTaskSidebar(null)}
            taskId={showTicketTaskSidebar?.id}
            ticketId={ticket?.id}
          />
        )}
      </CustomSidebar>

      <ConfirmationModal
        isOpen={!!ticketToSingleDelete}
        successBtnText="Delete"
        alertType="WARNING"
        title="Are You Sure?"
        text={`You are about to delete a <strong>${ticketToSingleDelete?.displayName}</strong>`}
        onCloseModal={() => setTicketToSingleDelete(null)}
        onSuccessClick={() => {
          removeSingleIssue([ticketToSingleDelete?.id], true);
          navigate(routes.TICKETS);
          setTicketToSingleDelete(null);
        }}
      />
    </PanelGroup>
  );
};

export default TicketDetailsTab;
