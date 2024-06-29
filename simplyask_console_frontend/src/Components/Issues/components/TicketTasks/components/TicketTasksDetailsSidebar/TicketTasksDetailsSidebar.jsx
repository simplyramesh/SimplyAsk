import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import routes from '../../../../../../config/routes';
import { useUser } from '../../../../../../contexts/UserContext';
import { useCreateActivity } from '../../../../../../hooks/activities/useCreateActivitiy';
import useGetIssues from '../../../../../../hooks/issue/useGetIssues';
import { useIssuesCUD } from '../../../../../../hooks/issue/useIssuesCUD';
import { updateIssuesAdditionalFields } from '../../../../../../Services/axios/issuesAxios';
import {
  getServiceTaskStatusesByType,
  getServiceTaskTypes,
  getServiceTicketTasksCategory,
} from '../../../../../../store/selectors';
import { getInFormattedUserTimezone } from '../../../../../../utils/timeUtil';
import { StyledButton, StyledLoadingButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InfoList from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { UserAutocompleteWithAvatar } from '../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import Spinner from '../../../../../shared/Spinner/Spinner';
import {
  StyledDivider,
  StyledEmptyValue,
  StyledFlex,
  StyledStatus,
  StyledText,
} from '../../../../../shared/styles/styled';
import { ISSUE_ENTITY_TYPE, ISSUE_SERVICE_TICKET_TASKS_STATUSES, ISSUES_QUERY_KEYS } from '../../../../constants/core';
import { getDefaultUserOption } from '../../utills/helpers';

import useOptimisticServiceTicketTaskUpdate from '../../../../../../hooks/service-tickets/tasks/useOptimisticServiceTicketTaskUpdate';
import { RichTextEditor } from '../../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import LinkedItems from '../../../ServiceTickets/components/shared/LinkedItems/LinkedItems';
import TicketAutoFocusInput from '../../../ServiceTickets/components/shared/TicketAutoFocusInput';
import { linkedItemMapper, SERVICE_TICKET_TASK_STATUS_MAP } from '../../../ServiceTickets/utils/helpers';
import EditableRichDescription from '../../../shared/EditableRichDescription/EditableRichDescription';
import EditValueTrigger from '../../../shared/EditValueTrigger/EditValueTrigger';
import ServiceTaskDetailsActivity from './ServiceTaskDetailsActivity';
import TaskTypeDropdown from './TaskTypeDropdown';

const getIssueEntityTypeLink = (entity, id) => {
  switch (entity) {
    case 'USER':
      return `${routes.SETTINGS_ACCESS_MANAGER_USERS}/${id}?${new URLSearchParams({ tab: 'profile' })}`;
    case 'ISSUE':
      return `${routes.TICKETS}/${id}`;
    case 'PROCESS':
      return `${routes.PROCESS_MANAGER}`;
    case 'AGENT':
      return `${routes.AGENT_MANAGER}/${id}`;
    case 'CONVERSATION':
      return `${routes.CONVERSATION_HISTORY}`;
    default:
      return '';
  }
};

const TicketTasksDetailsSidebar = ({ taskId, ticketDetails, queryKey, onDisplayNameChange, onDescriptionChange }) => {
  const { user } = useUser();

  const [ticketName, setTicketName] = useState('');
  const [actionInfo, setActionInfo] = useState(null);
  const [actions, setActions] = useState([]);

  const serviceTicketTaskCategories = useRecoilValue(getServiceTicketTasksCategory);
  const serviceTicketTypes = useRecoilValue(getServiceTaskTypes);

  // issue endpoints

  const {
    issues: issueTask,
    isFetching: isIssueTaskFetching,
    refetch,
  } = useGetIssues({
    queryKey: ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASK_BY_ID,
    filterParams: {
      issueId: taskId,
      returnRelatedEntities: true,
    },
    options: {
      enabled: !!taskId,
      select: (data) => {
        const sourceCreatedBy = data?.content?.[0]?.relatedEntities?.find(
          (entity) => entity?.relation === 'CREATED_BY'
        );

        return {
          ...data?.content?.[0],
          type: ISSUE_ENTITY_TYPE.ISSUE,
          source: {
            name: sourceCreatedBy?.type || data?.content?.[0]?.createdBy,
            id: sourceCreatedBy?.typeEntityId,
            link: getIssueEntityTypeLink(sourceCreatedBy?.type, sourceCreatedBy?.typeEntityId),
          },
          isEditable: sourceCreatedBy?.type === 'USER' || data?.content?.[0]?.createdBy === 'USER',
          isRevertible: !data?.content?.[0]?.relatedEntities?.some((entity) => entity?.relation === 'RELATED'),
        };
      },
    },
  });

  useEffect(() => {
    if (ticketDetails && !isIssueTaskFetching) {
      setTicketName(ticketDetails.displayName);
    }
  }, [ticketDetails, isIssueTaskFetching]);

  const serviceTicketTaskStatuses = useRecoilValue(
    getServiceTaskStatusesByType({ relatedTypeName: issueTask?.issueType })
  );

  const { createActionPerformedActivity, createAssignedActivity, createUnassignedActivity } = useCreateActivity();

  const { updateServiceTicketTask: handleDisplayNameUpdate } = useOptimisticServiceTicketTaskUpdate({
    queryKey,
    onSuccess: () => {
      createActionPerformedActivity({
        issueId: issueTask?.id,
        oldValue: issueTask?.displayName,
        newValue: ticketName,
        userId: user.id,
      });
    },
    ignoreToasts: true,
  });

  const { updateServiceTicketTask: handleDescriptionUpdate } = useOptimisticServiceTicketTaskUpdate({
    queryKey,
    onSuccess: () => {
      createActionPerformedActivity({
        issueId: issueTask?.id,
        oldValue: issueTask?.description,
        newValue: 'Edit Description',
        userId: user.id,
      });
    },
    ignoreToasts: true,
  });

  const { updateIssue: updateServiceTask, isUpdateIssueLoading: isUpdateServiceTaskLoading } = useIssuesCUD({
    successUpdateIssueMessage: () => 'Service Task updated successfully',
    invalidateQueryKeys: [
      ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASK_BY_ID,
      'issuesServiceTicketParent',
      'getServiceTaskTypes',
      ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASKS,
    ],
  });

  useEffect(() => {
    if (issueTask && serviceTicketTypes) {
      const serviceTicketType = serviceTicketTypes.find((type) => type.name === issueTask.issueType);
      setActions(serviceTicketType?.actions);
    }
  }, [serviceTicketTypes, issueTask]);

  const renderWithSpinner = (condition, renderFn) => (condition ? <Spinner small /> : renderFn());

  const renderTaskTypeDropdown = () => (
    <TaskTypeDropdown
      defaultValue={{
        name: issueTask?.issueType,
        id: serviceTicketTaskCategories?.types?.find((type) => type?.name === issueTask?.issueType)?.id,
      }}
      options={serviceTicketTaskCategories?.types}
      getOptionLabel={(option) => option?.name}
      getOptionValue={(option) => option?.id}
      onChange={(value) => {
        updateServiceTask({
          issueId: issueTask?.id,
          issueTypeId: value?.id,
          issueStatusId: serviceTicketTaskStatuses?.find(
            (status) => status?.name === ISSUE_SERVICE_TICKET_TASKS_STATUSES.INCOMPLETE
          )?.id,
        });

        createActionPerformedActivity({
          issueId: issueTask?.id,
          oldValue: issueTask?.issueType,
          newValue: 'Changed Task Type',
          userId: user.id,
        });
      }}
      isDisabled={!issueTask?.isEditable}
    />
  );

  const renderActions = () =>
    issueTask?.resolvedBy ? (
      <StyledFlex>
        <StyledText textAlign="right" size={16}>
          Action Was Performed
        </StyledText>
        {issueTask?.isRevertible && (
          <StyledFlex flexDirection="row" justifyContent="flex-end">
            <StyledButton
              variant="text"
              onClick={async () => {
                await updateIssuesAdditionalFields(
                  { issueId: issueTask?.id },
                  {
                    actionPerformed: null,
                  }
                );

                updateServiceTask({
                  issueId: issueTask?.id,
                  issueStatusId: serviceTicketTaskStatuses?.find(
                    (status) => status?.name === ISSUE_SERVICE_TICKET_TASKS_STATUSES.INCOMPLETE
                  )?.id,
                  resolvedBy: null,
                });

                createActionPerformedActivity({
                  issueId: issueTask?.id,
                  oldValue: issueTask?.resolvedBy,
                  newValue: null,
                  userId: user.id,
                });
              }}
            >
              Revert Action
            </StyledButton>
          </StyledFlex>
        )}
      </StyledFlex>
    ) : (
      <StyledFlex flexDirection="row" flexWrap="wrap" display="inline-flex" gap="16px">
        {actions.length > 2 ? (
          <TaskTypeDropdown
            isActions
            isSearchable={false}
            placeholder="Select Action"
            options={actions}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            onChange={(value) => {
              setActionInfo({ actionName: value, actionId: value, taskName: issueTask?.displayName });
            }}
          />
        ) : (
          actions.map((action) => (
            <StyledLoadingButton
              primary
              variant="outlined"
              key={action.id}
              onClick={() =>
                setActionInfo({ actionName: action.name, actionId: action.id, taskName: issueTask?.displayName })
              }
              loading={isUpdateServiceTaskLoading && actionInfo?.actionName === action.name}
            >
              {action.name}
            </StyledLoadingButton>
          ))
        )}
      </StyledFlex>
    );

  const renderAssignedTo = () => (
    <StyledFlex flexDirection="column" display="inline-flex" gap="4px" alignItems="flex-end">
      <StyledFlex display="inline-flex" width="152px" marginRight="-12px">
        <UserAutocompleteWithAvatar
          placeholder="Unassigned"
          defaultOptions={defaultOptions}
          value={defaultOptions?.[0]}
          onChange={(option) => {
            updateServiceTask({
              issueId: issueTask?.id,
              assignedToUserId: option?.value?.id,
              assignedByUserId: user?.id,
              ...(option
                ? {
                    issueStatusId: serviceTicketTaskStatuses?.find(
                      (status) => status?.name === ISSUE_SERVICE_TICKET_TASKS_STATUSES.INCOMPLETE
                    )?.id,
                  }
                : {
                    issueStatusId: serviceTicketTaskStatuses?.find(
                      (status) => status?.name === ISSUE_SERVICE_TICKET_TASKS_STATUSES.COMPLETE
                    )?.id,
                  }),
            });

            option
              ? createAssignedActivity({
                  assignedFromId: issueTask?.assignedTo?.id,
                  assignedToId: option.value.id,
                  assignedToName: option.label,
                  issueId: issueTask?.id,
                  userId: user.id,
                })
              : createUnassignedActivity({
                  issueId: issueTask?.id,
                  assignedFromId: issueTask?.assignedTo?.id,
                  userId: user.id,
                });
          }}
          borderRadius="10px"
        />
      </StyledFlex>
      {!issueTask?.assignedTo?.id && (
        <StyledButton
          variant="text"
          onClick={() => {
            updateServiceTask({
              issueId: issueTask?.id,
              assignedToUserId: user?.id,
              assignedByUserId: user?.id,
            });

            createAssignedActivity({
              assignedToId: user?.id,
              assignedToName: user?.fullname,
              issueId: issueTask?.id,
              userId: user.id,
            });
          }}
        >
          Assign to me
        </StyledButton>
      )}
    </StyledFlex>
  );

  const renderStatus = () => {
    const isResolved = issueTask?.resolvedBy;
    const color = isResolved
      ? SERVICE_TICKET_TASK_STATUS_MAP[issueTask?.status]?.color
      : SERVICE_TICKET_TASK_STATUS_MAP[ISSUE_SERVICE_TICKET_TASKS_STATUSES.PENDING_ACTION]?.color;
    const statusValue = isResolved
      ? SERVICE_TICKET_TASK_STATUS_MAP[issueTask?.status]?.status || issueTask?.status
      : ISSUE_SERVICE_TICKET_TASKS_STATUSES.PENDING_ACTION;

    return (
      <StyledStatus height="34px" color={color} width="fit-content" minWidth="0px">
        {statusValue}
      </StyledStatus>
    );
  };

  const defaultOptions = getDefaultUserOption(issueTask, user?.pfp);

  return (
    <>
      <InfoList padding="22px 32px">
        <InfoListGroup noPaddings>
          <StyledFlex p="0 10px 0 4px">
            <EditValueTrigger
              minHeight={45}
              margin="0 10px 45px 10px"
              editableComponent={(setEditing) => (
                <StyledFlex flex="1" mx="-11px">
                  <TicketAutoFocusInput
                    placeholder={issueTask?.displayName}
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    onBlur={() => {
                      setTicketName(issueTask?.displayName);
                      setEditing(false);
                    }}
                    onConfirm={() => {
                      handleDisplayNameUpdate({
                        task: issueTask,
                        assignedToUserId: issueTask?.assignedTo?.id || null,
                        displayName: ticketName,
                        description: issueTask.description,
                      });
                      onDisplayNameChange?.(ticketName);
                      refetch();
                      setEditing(false);
                    }}
                  />
                </StyledFlex>
              )}
            >
              <StyledFlex flex="1">
                <StyledText size={24} weight={600} lh={36} m="0px 15px 10px 15px">
                  {ticketName || issueTask?.displayName}
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
              editableComponent={(setEditing, key) => (
                <EditableRichDescription
                  placeholder="Add description..."
                  description={issueTask?.description}
                  key={`${key}-${issueTask?.id}`}
                  onCancel={() => setEditing(false)}
                  onSave={(description) => {
                    handleDescriptionUpdate({
                      task: ticketDetails,
                      assignedToUserId: ticketDetails.assignedTo?.id || null,
                      displayName: ticketDetails.displayName,
                      description,
                    });
                    onDescriptionChange?.(description);
                    setEditing(false);
                  }}
                />
              )}
            >
              <RichTextEditor
                key={issueTask?.id}
                readOnly
                minHeight={0}
                editorState={ticketDetails?.description}
                placeholder="Add Description..."
              />
            </EditValueTrigger>
          </StyledFlex>
        </InfoListGroup>

        <StyledDivider m="30px 0" />
        <InfoListGroup title="Task Status">
          <InfoListItem name="Status">{renderWithSpinner(isIssueTaskFetching, renderStatus)}</InfoListItem>
          <InfoListItem name="Action">{renderWithSpinner(isIssueTaskFetching, renderActions)}</InfoListItem>
          <InfoListItem name="Type">{renderWithSpinner(isIssueTaskFetching, renderTaskTypeDropdown)}</InfoListItem>
          <InfoListItem name="Assignee">{renderWithSpinner(isIssueTaskFetching, renderAssignedTo)}</InfoListItem>
        </InfoListGroup>
        <StyledDivider m="0 0 30px 0" />
        <InfoListGroup title="Details">
          <StyledFlex p="14px" gap="20px 0">
            <StyledText lh={20} weight={500}>
              Associated Service Ticket
            </StyledText>
            {taskId &&
              renderWithSpinner(isIssueTaskFetching, () => (
                <LinkedItems
                  hideLinking
                  titleSize={19}
                  relatedEntities={issueTask?.relatedEntities}
                  entityMapper={linkedItemMapper}
                  ticketId={issueTask?.id}
                />
              ))}
          </StyledFlex>
          <StyledDivider />
          <InfoListItem name="Source">
            <StyledFlex alignItems="flex-end" maxWidth="300px">
              <StyledText textAlign="inherit">{`${issueTask?.source?.name}`}</StyledText>
              {issueTask?.source?.id ? (
                <StyledButton
                  variant="text"
                  onClick={() => {
                    window.open(`${issueTask?.source?.link}`, '_blank');
                  }}
                >
                  {`#${issueTask?.source?.id}`}
                </StyledButton>
              ) : null}
            </StyledFlex>
          </InfoListItem>
          <InfoListItem name="Created On">
            {getInFormattedUserTimezone(issueTask?.createdAt, user.timezone, 'LLL d, yyyy - h:mm a')}
          </InfoListItem>
          <InfoListItem name="Resolved On">
            {issueTask?.resolvedAt ? (
              getInFormattedUserTimezone(issueTask?.resolvedAt, user.timezone, 'LLL d, yyyy - h:mm a')
            ) : (
              <StyledEmptyValue />
            )}
          </InfoListItem>
          <InfoListItem name="Resolved By">{issueTask?.resolvedBy || <StyledEmptyValue />}</InfoListItem>
        </InfoListGroup>
        <StyledDivider m="0 0 30px 0" />
        <InfoListGroup>
          <ServiceTaskDetailsActivity issueTask={issueTask} />
        </InfoListGroup>
      </InfoList>

      <ConfirmationModal
        isOpen={!!actionInfo}
        onCloseModal={() => setActionInfo(null)}
        onSuccessClick={async () => {
          await updateIssuesAdditionalFields(
            { issueId: issueTask?.id },
            {
              actionPerformed: actionInfo.actionId,
            }
          );

          updateServiceTask({
            issueId: issueTask?.id,
            issueStatusId: serviceTicketTaskStatuses?.find(
              (status) => status?.name === ISSUE_SERVICE_TICKET_TASKS_STATUSES.COMPLETE
            )?.id,
            resolvedBy: 'USER',
            resolvedAt: new Date().toISOString(),
          });

          createActionPerformedActivity({
            issueId: issueTask?.id,
            oldValue: '',
            newValue: actionInfo?.actionName,
            userId: user.id,
          });

          setActionInfo(null);
        }}
        successBtnText={`${actionInfo?.actionName}`}
        alertType="WARNING"
        title={`${actionInfo?.actionName} Ticket Task?`}
        text={`You are about to ${actionInfo?.actionName} ${actionInfo?.taskName}. This action cannot be reversed.`}
      />
    </>
  );
};

export default TicketTasksDetailsSidebar;
