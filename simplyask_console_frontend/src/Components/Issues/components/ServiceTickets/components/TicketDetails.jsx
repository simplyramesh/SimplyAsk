import {default as React, useEffect, useMemo, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import {useRecoilState} from 'recoil';

import {useCreateActivity} from '../../../../../hooks/activities/useCreateActivitiy';
import {useGetIssueById} from '../../../../../hooks/issue/useGetIssueById';
import {useGetCurrentUser} from '../../../../../hooks/useGetCurrentUser';
import {getServiceTicketsCategory} from '../../../../../store/selectors';
import {RichTextEditor} from '../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import InfoList from '../../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import Spinner from '../../../../shared/Spinner/Spinner';
import {StyledDivider, StyledFlex, StyledText} from '../../../../shared/styles/styled';
import {ISSUES_QUERY_KEYS} from '../../../constants/core';
import useIssueGetAllAttachedFiles from '../../../hooks/useIssueGetAllAttachedFiles';
import {useRemoveLinkedServiceTicket} from '../../../hooks/useRemoveLinkedServiceTicket';
import {useUpdateRelatedEntities} from '../../../hooks/useUpdateRelatedEntities';
import EditableRichDescription from '../../shared/EditableRichDescription/EditableRichDescription';
import EditValueTrigger from '../../shared/EditValueTrigger/EditValueTrigger';
import {linkedItemMapper, mapRelatedEntitiesToDto} from '../utils/helpers';

import {useTheme} from '@emotion/react';
import {StyledButton} from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import {
  onTicketDetailsCustomUpdate,
  SERVICE_TICKET_FIELDS_TYPE,
  useOptimisticIssuesUpdate,
} from '../../../hooks/useOptimisticIssuesUpdate';
import LinkedItems from './shared/LinkedItems/LinkedItems';
import ServiceTicketActivities from './shared/TicketActivities/TicketActivities';
import TicketAutoFocusInput from './shared/TicketAutoFocusInput';
import TicketDetailsAdditionalFields from './shared/TicketDetailsAdditionalFields/TicketDetailsAdditionalFields';
import TicketDetailsAttachments from './shared/TicketDetailsAttachments/TicketDetailsAttachments';
import TicketDetailsDetails from './shared/TicketDetailsDetails/TicketDetailsDetails';

const TicketDetails = ({ ticketId, onDisplayNameChange, queryKey }) => {
  const [issueType, setIssueType] = useState();
  const richTextEditorRef = useRef(null);
  const [showMoreText, setShowMoreText] = useState({
    textHeight: 6,
    shouldShow: true,
  });
  const [isEditorChanged, setIsEditorChanged] = useState(false);
  const { colors } = useTheme();

  const {
    issue: ticketDetails,
    dataUpdatedAt,
    isFetching: isIssueFetching,
  } = useGetIssueById({ key: ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, issueId: ticketId });

  const { currentUser: user } = useGetCurrentUser();
  const { createActionPerformedActivity } = useCreateActivity();

  const [ticketName, setTicketName] = useState(ticketDetails?.displayName || '');

  const { mutate: handleDisplayNameUpdate, isLoading: isNameUpdating } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.DISPLAY_NAME,
    ...onTicketDetailsCustomUpdate([ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, ticketId]),
    customOnSuccess: () => {
      createActionPerformedActivity({
        issueId: ticketDetails?.id,
        oldValue: ticketDetails?.displayName,
        newValue: ticketName,
        userId: user.id,
      });
    },
    ignoreToasts: true,
  });

  const { mutate: handleDescriptionUpdate, isLoading: isDescriptionUpdating } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.DESCRIPTION,
    ...onTicketDetailsCustomUpdate([ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, ticketId]),
    customOnSuccess: () => {
      createActionPerformedActivity({
        issueId: ticketDetails?.id,
        oldValue: ticketDetails?.description,
        newValue: 'Edit Description',
        userId: user.id,
      });
    },
    ignoreToasts: true,
  });

  const [{ types: serviceTicketTypes }] = useRecoilState(getServiceTicketsCategory);

  const { updateRelatedEntities } = useUpdateRelatedEntities({
    onError: () => toast.error(`Error updating ${ticketDetails.displayName}`),
  });

  const { removeLinkedServiceTicket } = useRemoveLinkedServiceTicket({
    queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, ticketId],
    onError: () => toast.error(`Error updating ${ticketDetails.displayName}`),
  });

  const { getAllAttachedFiles, isGetAllAttachedFilesLoading } = useIssueGetAllAttachedFiles({
    issueId: ticketDetails?.id,
    sortOrder: 'timeStamp',
    isAscending: false,
  });

  const onRelatedEntitySave = ({ relation, relatedEntity }) => {
    const currentEntities = mapRelatedEntitiesToDto(ticketDetails.relatedEntities);

    const issueId = ticketDetails.id;
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
    const currentEntities = mapRelatedEntitiesToDto(ticketDetails.relatedEntities);

    const issueId = ticketDetails.id;
    const payload = currentEntities.filter((currEntity) => currEntity.id !== entity.id);

    removeLinkedServiceTicket({ params: { issueId, deletedTicket: entity.id }, body: payload });
  };

  useEffect(() => {
    if (ticketDetails && serviceTicketTypes) {
      setIssueType(serviceTicketTypes.find((type) => type.name === ticketDetails.issueType));
    }
    setTicketName(ticketDetails?.displayName || '');
  }, [ticketDetails, serviceTicketTypes]);

  const isLoading = useMemo(
    () => isIssueFetching || isNameUpdating || isDescriptionUpdating || isGetAllAttachedFilesLoading,
    [isIssueFetching, isNameUpdating, isDescriptionUpdating, isGetAllAttachedFilesLoading]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (richTextEditorRef.current) {
        const offsetHeight = richTextEditorRef.current.childNodes[0].offsetHeight;
        const scrollHeight = richTextEditorRef.current.childNodes[0].scrollHeight;

        const shouldShow = offsetHeight === scrollHeight && scrollHeight < 160 && offsetHeight < 160;
        const textHeight = shouldShow ? null : 6;

        setShowMoreText({
          textHeight,
          shouldShow: !shouldShow,
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isLoading, isEditorChanged]);

  if (isLoading || !ticketDetails || !ticketId || isGetAllAttachedFilesLoading) return <Spinner parent />;
  return (
    <InfoList p="30px">
      {isLoading && <Spinner parent fadeBgParent />}

      <InfoListGroup noPaddings>
        <StyledFlex p="0 10px 0 4px">
          <EditValueTrigger
            minHeight={45}
            margin="0 10px 45px 10px"
            editableComponent={(setEditing) => (
              <StyledFlex flex="1" mx="-11px">
                <TicketAutoFocusInput
                  placeholder={ticketDetails?.displayName}
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  onBlur={() => {
                    setTicketName(ticketDetails?.displayName);
                    setEditing(false);
                  }}
                  onConfirm={() => {
                    handleDisplayNameUpdate({
                      dueDate: ticketDetails.dueDate,
                      issueId: ticketDetails.id,
                      assignedToUserId: ticketDetails.assignedTo?.id || null,
                      displayName: ticketName,
                      description: ticketDetails.description,
                    });
                    onDisplayNameChange?.(ticketName);
                    setEditing(false);
                  }}
                />
              </StyledFlex>
            )}
          >
            <StyledFlex flex="1">
              <StyledText size={24} weight={600} lh={36} m="0px 15px 10px 15px">
                {ticketDetails?.displayName}
              </StyledText>
            </StyledFlex>
          </EditValueTrigger>
        </StyledFlex>
      </InfoListGroup>
      <InfoListGroup title="Description" noPaddings>
        <StyledFlex p="0 10px 0 6px">
          <EditValueTrigger
            margin="0 10px 25px 10px"
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
                description={ticketDetails?.description}
                key={`${key}-${dataUpdatedAt}`}
                onCancel={() => {
                  setIsEditorChanged((prev) => !prev);
                  setEditing(false);
                }}
                onSave={(description) => {
                  handleDescriptionUpdate({
                    dueDate: ticketDetails.dueDate,
                    issueId: ticketDetails.id,
                    assignedToUserId: ticketDetails.assignedTo?.id || null,
                    displayName: ticketName,
                    description,
                  });
                  setEditing(false);
                }}
              />
            )}
          >
            <RichTextEditor
              key={dataUpdatedAt}
              readOnly
              minHeight={0}
              editorState={ticketDetails?.description}
              placeholder="Add Description..."
              maxLines={showMoreText.textHeight}
              richTextEditorRef={richTextEditorRef}
            />
          </EditValueTrigger>
          {showMoreText.shouldShow && (
            <StyledFlex alignItems="start" mt="4px" mb="48px">
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
      </InfoListGroup>

      {ticketDetails && (
        <>
          <StyledFlex margin="-25px 14px 0 14px">
            <TicketDetailsAttachments
              ticketDetails={ticketDetails}
              getAllAttachedFiles={getAllAttachedFiles}
              showSuccesToast={false}
            />
          </StyledFlex>
          <StyledDivider m="30px 0" />
          <TicketDetailsDetails
            ticketDetails={ticketDetails}
            showStatus
            queryKey={queryKey}
            ticketByIdQueryKey={[ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, ticketId]}
          />
          <StyledDivider m="30px 0" />
          <TicketDetailsAdditionalFields
            ticket={ticketDetails}
            additionalFields={ticketDetails?.additionalFields}
            ticketType={issueType}
          />
          <StyledDivider m="30px 0" />
          <InfoListGroup noPaddings>
            <LinkedItems
              titleSize={19}
              relatedEntities={ticketDetails?.relatedEntities}
              entityMapper={linkedItemMapper}
              onSave={(e) => onRelatedEntitySave(e)}
              onUnlink={(e) => onRelatedEntityUnlink(e)}
              ticketId={ticketId}
            />
          </InfoListGroup>
          <StyledDivider m="30px 0" />
          <InfoListGroup noPaddings>
            <ServiceTicketActivities titleSize={19} ticketId={ticketId} />
          </InfoListGroup>
        </>
      )}
    </InfoList>
  );
};

export default TicketDetails;
