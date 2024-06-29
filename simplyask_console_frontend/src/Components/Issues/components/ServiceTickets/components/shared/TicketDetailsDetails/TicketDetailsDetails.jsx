import { useTheme } from '@emotion/react';
import { endOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import routes from '../../../../../../../config/routes';
import { useCreateActivity } from '../../../../../../../hooks/activities/useCreateActivitiy';
import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';
import { getServiceTicketsCategory } from '../../../../../../../store/selectors';
import {
  BASE_DATE_TIME_FORMAT,
  formatLocalTime,
  getInFormattedUserTimezone,
  ISO_UTC_DATE_AND_TIME_FORMAT,
  setTimezone,
} from '../../../../../../../utils/timeUtil';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InfoListGroup from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import { StatusOption } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/StatusOption';
import { StatusValue } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/StatusValue';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteWithAvatar } from '../../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import { StyledEmptyValue, StyledFlex } from '../../../../../../shared/styles/styled';
import { ISSUE_PRIORITIES } from '../../../../../constants/core';
import { PRIORITY_OPTIONS } from '../../../../../constants/options';
import {
  onTicketDetailsCustomUpdate,
  SERVICE_TICKET_FIELDS_TYPE,
  useOptimisticIssuesUpdate,
} from '../../../../../hooks/useOptimisticIssuesUpdate';
import { getDefaultUserOption } from '../../../../FalloutTickets/utils/helpers';
import EditValueTrigger from '../../../../shared/EditValueTrigger/EditValueTrigger';
import PriorityWithIcon from '../../../../shared/PriorityWithIcon/PriorityWithIcon';
import { SERVICE_TICKETS_STATUSES } from '../../../constants/initialValues';
import { mapStatuses } from '../../TicketsFullView/TicketsFullView';
import ServiceTicketDueDate from '../ServiceTicketCalendar/ServiceTicketDueDate';
import ServiceTicketsEmptySectionDetail from '../ServiceTicketsEmptySectionDetail/ServiceTicketsEmptySectionDetail';
import TicketTasksCreatedBy from '../TicketTasksCreatedBy/TicketTasksCreatedBy';
import TicketTasksDueDate from '../TicketTasksDueDate/TicketTasksDueDate';
import TicketTasksStat from '../TicketTasksStat/TicketTasksStat';

const TicketDetailsDetails = ({ ticketDetails, showStatus, queryKey, ticketByIdQueryKey }) => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { currentUser } = useGetCurrentUser();
  const [{ types: serviceTicketTypes }] = useRecoilState(getServiceTicketsCategory);
  const [statuses, setStatuses] = useState([]);

  const {
    createStatusChangedActivity,
    createAssignedActivity,
    createUnassignedActivity,
    createActionPerformedActivity,
  } = useCreateActivity({ ignoreToasts: true });

  const [oldStatusValue, setOldStatusValue] = useState();
  const [oldPriority, setOldPriority] = useState();
  const [oldDueDate, setOldDueDate] = useState();

  const [assigneeUser, setAssigneeUser] = useState();
  const [isAssignToMe, setIsAssignToMe] = useState(false);

  const { mutate: handleStatusUpdate, isLoading: isStatusUpdating } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.STATUS,
    ...onTicketDetailsCustomUpdate(ticketByIdQueryKey),
    customOnSuccess: (data) => {
      createStatusChangedActivity({
        issueId: ticketDetails?.id,
        oldStatus: oldStatusValue.label,
        newStatus: data[0].status,
        userId: currentUser?.id,
      });
    },
    ignoreToasts: true,
  });

  const { mutate: handlePriorityUpdate, isLoading: isPriorityUpdating } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.PRIORITY,
    ...onTicketDetailsCustomUpdate(ticketByIdQueryKey),
    customOnSuccess: (data) => {
      createActionPerformedActivity({
        issueId: ticketDetails?.id,
        oldValue: oldPriority,
        newValue: `Priority updated to ${data[0].priority}`,
        userId: currentUser?.id,
      });
    },
    ignoreToasts: true,
  });

  const { mutate: handleAssigneeUpdate, isLoading: isAsiggneeUpdating } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.ASSIGNEE,
    ...onTicketDetailsCustomUpdate(ticketByIdQueryKey),
    customOnSuccess: () => {
      if (isAssignToMe) {
        createAssignedActivity({
          assignedToId: currentUser?.id,
          assignedToName: currentUser?.fullname,
          issueId: ticketDetails?.id,
          userId: currentUser.id,
        });
        setIsAssignToMe(false);
      } else {
        assigneeUser
          ? createAssignedActivity({
              assignedFromId: ticketDetails?.assignedTo?.id,
              assignedToId: assigneeUser.value.id,
              assignedToName: assigneeUser.label,
              issueId: ticketDetails?.id,
              userId: currentUser.id,
            })
          : createUnassignedActivity({
              issueId: ticketDetails?.id,
              assignedFromId: ticketDetails?.assignedTo?.id,
              userId: currentUser.id,
            });
      }
    },
    dismissOtherToasts: true,
    ignoreToasts: true,
  });

  const { mutate: handleDueDateUpdate, isLoading: isDueDateUpdating } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.DUE_DATE,
    ...onTicketDetailsCustomUpdate(ticketByIdQueryKey),
    customOnSuccess: () => {
      createActionPerformedActivity({
        issueId: ticketDetails?.id,
        oldValue: getInFormattedUserTimezone(oldDueDate, currentUser?.timezone, BASE_DATE_TIME_FORMAT),
        newValue: `Due date updated to ${getInFormattedUserTimezone(ticketDetails?.dueDate, currentUser?.timezone, BASE_DATE_TIME_FORMAT)}`,
        userId: currentUser?.id,
      });
    },
    ignoreToasts: true,
  });

  const defaultOptions = getDefaultUserOption(ticketDetails);

  useEffect(() => {
    if (ticketDetails) {
      const serviceTicketType = serviceTicketTypes.find((type) => type.name === ticketDetails.issueType);
      setStatuses(serviceTicketType?.statuses || []);
    }
  }, [ticketDetails]);

  const convertTimeStampToIso = (timestamp) => formatLocalTime(timestamp, ISO_UTC_DATE_AND_TIME_FORMAT);

  const priorityValue = PRIORITY_OPTIONS.find(
    (priority) => priority.value === (ticketDetails?.priority || ISSUE_PRIORITIES.NONE)
  );

  const handleMarkAsResolved = () => {
    const mappedStatuses = mapStatuses(statuses);

    const resolvedValue = mappedStatuses.find((status) =>
      [SERVICE_TICKETS_STATUSES.RESOLVED, SERVICE_TICKETS_STATUSES.DONE].includes(status.label)
    );
    const statusValue = mappedStatuses.filter((status) => status.label === ticketDetails?.status);

    setOldStatusValue(statusValue);
    handleStatusUpdate({
      dueDate: ticketDetails.dueDate,
      issueId: ticketDetails.id,
      assignedToUserId: ticketDetails.assignedTo?.id || null,
      issueStatusId: resolvedValue.value,
      newStatus: resolvedValue.label,
      displayName: ticketDetails.displayName,
      description: ticketDetails.description,
    });
  };

  const renderStatus = () => {
    const mappedStatuses = mapStatuses(statuses);

    const statusValue = mappedStatuses.filter((status) => status.label === ticketDetails?.status);

    return (
      <StyledFlex display="flex" flexDirection="column" justifyContent="end" alignItems="end">
        <CustomSelect
          menuPlacement="auto"
          alignMenu="right"
          closeMenuOnSelect
          options={mappedStatuses}
          placeholder={null}
          onChange={(status) => {
            setOldStatusValue(statusValue);
            handleStatusUpdate({
              dueDate: ticketDetails.dueDate,
              issueId: ticketDetails.id,
              assignedToUserId: ticketDetails.assignedTo?.id || null,
              issueStatusId: status.value,
              newStatus: status.label,
              displayName: ticketDetails.displayName,
              description: ticketDetails.description,
            });
          }}
          value={statusValue}
          components={{
            DropdownIndicator: null,
            Option: StatusOption,
            SingleValue: StatusValue,
          }}
          menuPortalTarget={document.body}
          isSearchable={false}
          status
          cell
          isCustomSingleValueUpdating={isStatusUpdating}
        />
        {ticketDetails?.status !== SERVICE_TICKETS_STATUSES.RESOLVED &&
          ticketDetails?.status !== SERVICE_TICKETS_STATUSES.DONE && (
            <StyledButton variant="text" cursor="pointer" onClick={handleMarkAsResolved}>
              Mark as Resolved
            </StyledButton>
          )}
      </StyledFlex>
    );
  };

  const renderPriority = () => (
    <EditValueTrigger
      editableComponent={(setEditable) => (
        <CustomSelect
          autoFocus
          menuIsOpen
          hideSelectedOptions
          menuPlacement="auto"
          options={PRIORITY_OPTIONS}
          placeholder={null}
          value={priorityValue}
          getOptionLabel={({ labelWithIcon }) => labelWithIcon}
          getOptionValue={({ value }) => value}
          closeMenuOnSelect
          isClearable={false}
          isSearchable={false}
          onBlur={() => setEditable(false)}
          onChange={(priority) => {
            setOldPriority(priorityValue.value);
            handlePriorityUpdate({
              dueDate: ticketDetails.dueDate,
              issueId: ticketDetails.id,
              assignedToUserId: ticketDetails.assignedTo?.id || null,
              priority: priority.value,
              displayName: ticketDetails.displayName,
              description: ticketDetails.description,
            });
            setEditable(false);
          }}
          components={{
            DropdownIndicator: null,
          }}
          maxHeight={30}
          menuPadding={0}
          menuPortalTarget={document.body}
          form
          borderColor={colors.linkColor}
        />
      )}
    >
      {!!ticketDetails?.priority && <PriorityWithIcon value={ticketDetails?.priority} />}
    </EditValueTrigger>
  );

  const renderTicketTasks = () => (
    <StyledFlex>
      <TicketTasksStat relatedEntities={ticketDetails?.relatedEntities} textAlign="right">
        {({ ticketTasksCount, ticketTasksCompleted }) => `${ticketTasksCompleted} of ${ticketTasksCount} Complete`}
      </TicketTasksStat>
      {ticketDetails?.length > 0 ? (
        <StyledButton
          variant="text"
          alignSelf="flex-end"
          onClick={() => navigate(`${routes.TICKETS}/${ticketDetails?.id}?tab=ticketTasks`)}
        >
          View ticket tasks
        </StyledButton>
      ) : null}
    </StyledFlex>
  );

  const renderAssignee = () => (
    <StyledFlex width="165px">
      <UserAutocompleteWithAvatar
        placeholder="Unassigned"
        defaultOptions={defaultOptions}
        value={defaultOptions?.[0]}
        onChange={(user) => {
          handleAssigneeUpdate({
            dueDate: ticketDetails.dueDate,
            issueId: ticketDetails.id,
            assignedToUserId: user?.value.id || null,
            ...(user?.value.id && { name: `${user?.value?.firstName} ${user?.value?.lastName}` }),
            displayName: ticketDetails.displayName,
            description: ticketDetails.description,
          });
          setAssigneeUser(user);
        }}
        borderRadius="10px"
      />
      <StyledButton
        variant="text"
        alignSelf="flex-end"
        onClick={() => {
          handleAssigneeUpdate({
            issueId: ticketDetails.id,
            assignedToUserId: currentUser?.id,
            name: currentUser.fullname,
          });
          setIsAssignToMe(true);
        }}
      >
        Assign to me
      </StyledButton>
    </StyledFlex>
  );

  const renderDueDate = () => {
    const localUserTime = ticketDetails?.dueDate
      ? getInFormattedUserTimezone(ticketDetails?.dueDate, currentUser?.timezone, ISO_UTC_DATE_AND_TIME_FORMAT)
      : null;
    const val = localUserTime ? new Date(localUserTime) : '';

    return (
      <EditValueTrigger
        editableComponent={(setEditable, key) => (
          <ServiceTicketDueDate
            placeholder=""
            isMenuPortal
            isMenuOpen={!!key}
            onChange={(dueDate) => {
              setOldDueDate(localUserTime);
              handleDueDateUpdate({
                issueId: ticketDetails.id,
                assignedToUserId: ticketDetails.assignedTo?.id || null,
                dueDate: setTimezone(dueDate, currentUser.timezone),
              });
              setEditable(false);
            }}
            onInputFocus={(v) => setEditable(v)}
            onBlur={() => setEditable(false)}
            value={val}
            minDate={endOfDay(new Date())}
          />
        )}
      >
        <TicketTasksDueDate val={ticketDetails?.dueDate}>
          {ticketDetails?.dueDate ? (
            getInFormattedUserTimezone(
              convertTimeStampToIso(ticketDetails?.dueDate),
              currentUser?.timezone,
              BASE_DATE_TIME_FORMAT
            )
          ) : (
            <StyledEmptyValue />
          )}
        </TicketTasksDueDate>
      </EditValueTrigger>
    );
  };

  const renderCreatedOn = () =>
    getInFormattedUserTimezone(
      convertTimeStampToIso(ticketDetails?.createdAt),
      currentUser?.timezone,
      BASE_DATE_TIME_FORMAT
    );

  const renderCreatedBy = () =>
    ticketDetails?.createdBy ? (
      <TicketTasksCreatedBy value={ticketDetails?.createdBy} relatedEntities={ticketDetails?.relatedEntities} />
    ) : (
      <StyledEmptyValue />
    );

  const renderResolvedOn = () =>
    ticketDetails?.resolvedAt ? (
      getInFormattedUserTimezone(
        convertTimeStampToIso(ticketDetails.resolvedAt),
        currentUser?.timezone,
        BASE_DATE_TIME_FORMAT
      )
    ) : (
      <StyledEmptyValue />
    );

  return (
    <InfoListGroup title="Details" noPaddings>
      {ticketDetails ? (
        <>
          {showStatus ? (
            <InfoListItem name="Status" alignItems="center">
              {renderStatus()}
            </InfoListItem>
          ) : null}
          <InfoListItem name="Priority" alignItems="center" isLoading={isPriorityUpdating}>
            {renderPriority()}
          </InfoListItem>
          <InfoListItem name="Ticket Tasks" alignItems="center">
            {renderTicketTasks()}
          </InfoListItem>
          <InfoListItem name="Assignee" alignItems="center" isLoading={isAsiggneeUpdating}>
            {renderAssignee()}
          </InfoListItem>
          <InfoListItem name="Due Date" alignItems="center" isLoading={isDueDateUpdating}>
            {renderDueDate()}
          </InfoListItem>
          <InfoListItem name="Resolved On" alignItems="center">
            {renderResolvedOn()}
          </InfoListItem>
          <InfoListItem name="Created On">{renderCreatedOn()}</InfoListItem>
          <InfoListItem name="Created By">{renderCreatedBy()}</InfoListItem>
          <InfoListItem name="Assigned By">{ticketDetails?.assignedBy?.name ?? <StyledEmptyValue />}</InfoListItem>
        </>
      ) : (
        <ServiceTicketsEmptySectionDetail title="There Are No Details" />
      )}
    </InfoListGroup>
  );
};

export default TicketDetailsDetails;
