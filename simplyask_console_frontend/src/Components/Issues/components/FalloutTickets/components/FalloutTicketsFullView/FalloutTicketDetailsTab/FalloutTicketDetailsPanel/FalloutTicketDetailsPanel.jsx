import { useTheme } from '@emotion/react';
import { InfoOutlined } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { endOfDay } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import CopyIcon from '../../../../../../../../Assets/icons/copy.svg?component';
import routes from '../../../../../../../../config/routes';
import { useCreateActivity } from '../../../../../../../../hooks/activities/useCreateActivitiy';
import useCopyToClipboard from '../../../../../../../../hooks/useCopyToClipboard';
import { useGetCurrentUser } from '../../../../../../../../hooks/useGetCurrentUser';
import {
  BASE_DATE_TIME_FORMAT,
  formatLocalTime,
  getInFormattedUserTimezone,
  ISO_UTC_DATE_AND_TIME_FORMAT,
} from '../../../../../../../../utils/timeUtil';
import FalloutProcessEditor from '../../../../../../../WorkflowEditor/FalloutProcessEditor';
import { ISSUE_ENTITY_TYPE } from '../../../../../../constants/core';
import { FALLOUT_TICKET_STATUS_TOOLTIPS } from '../../../../constants/constants';
import { StyledActionsDiagram } from '../../../FalloutTicketActionsView/StyledFalloutTicketActionsView';

import { useRecoilValue } from 'recoil';
import { getFalloutTicketsCategory } from '../../../../../../../../store/selectors';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import InfoListGroup from '../../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteWithAvatar } from '../../../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledDivider, StyledEmptyValue, StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import UserAvatar from '../../../../../../../UserAvatar';
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES } from '../../../../../../constants/core';
import { PRIORITY_OPTIONS } from '../../../../../../constants/options';
import {
  onTicketDetailsCustomUpdate,
  SERVICE_TICKET_FIELDS_TYPE,
  useOptimisticIssuesUpdate,
} from '../../../../../../hooks/useOptimisticIssuesUpdate';
import ServiceTicketDueDate from '../../../../../ServiceTickets/components/shared/ServiceTicketCalendar/ServiceTicketDueDate';
import ServiceTicketStatus from '../../../../../ServiceTickets/components/shared/ServiceTicketStatus/ServiceTicketStatus';
import TicketTasksDueDate from '../../../../../ServiceTickets/components/shared/TicketTasksDueDate/TicketTasksDueDate';

import EditValueTrigger from '../../../../../shared/EditValueTrigger/EditValueTrigger';
import PriorityWithIcon from '../../../../../shared/PriorityWithIcon/PriorityWithIcon';
import { STATUS_CONSTANTS } from '../../../../constants/constants';
import { getDefaultUserOption } from '../../../../utils/helpers';

const FalloutTicketDetailsPanel = ({ ticketDetails, queryKey, ticketByIdQueryKey, isFullViewMode }) => {
  const initialRenderRef = useRef(0);
  const { colors } = useTheme();
  const { currentUser } = useGetCurrentUser();
  const { copyToClipboard } = useCopyToClipboard();

  const category = useRecoilValue(getFalloutTicketsCategory);

  const [oldValuesForActivity, setOldValuesForActivity] = useState();
  const isTicketResolved = STATUS_CONSTANTS.RESOLVED === ticketDetails?.status;

  const [copyMessage, setCopyMessage] = useState(`Copy URL of ${ISSUE_CATEGORIES.FALLOUT_TICKET}`);

  const defaultOptions = getDefaultUserOption(ticketDetails);

  useEffect(() => {
    if (ticketDetails && initialRenderRef.current === 0) {
      setOldValuesForActivity({
        oldAssignee: ticketDetails.assignedTo,
        oldPriority: ticketDetails.priority || ISSUE_PRIORITIES.NONE,
        oldDueDate: ticketDetails.dueDate,
        oldStatus: ticketDetails.status,
      });

      initialRenderRef.current++;
    }
  }, [ticketDetails]);

  const convertTimeStampToIso = (timestamp) => formatLocalTime(timestamp, ISO_UTC_DATE_AND_TIME_FORMAT);

  const {
    createAssignedActivity,
    createUnassignedActivity,
    createActionPerformedActivity,
    createStatusChangedActivity,
  } = useCreateActivity({
    ignoreToasts: true,
  });

  const { mutate: handlePriorityUpdate } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.PRIORITY,
    ...onTicketDetailsCustomUpdate(ticketByIdQueryKey),
    customOnSuccess: (data) => {
      createActionPerformedActivity({
        issueId: ticketDetails?.id,
        oldValue: oldValuesForActivity.oldPriority,
        newValue: `Priority updated to ${data[0].priority}`,
        userId: currentUser?.id,
      });

      setOldValuesForActivity((prev) => ({
        ...prev,
        oldAssignee: data[0].priority,
      }));
    },
  });

  const { mutate: handleAssigneeUpdate } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.ASSIGNEE,
    ...onTicketDetailsCustomUpdate(ticketByIdQueryKey),
    customOnSuccess: (data) => {
      if (data[0].assignedTo) {
        createAssignedActivity({
          assignedFromId: oldValuesForActivity?.oldAssignee?.id,
          assignedToId: data[0].assignedTo.id,
          assignedToName: data[0].assignedTo.name,
          issueId: ticketDetails?.id,
          userId: currentUser.id,
        });

        setOldValuesForActivity((prev) => ({
          ...prev,
          oldAssignee: data[0].assignedTo,
        }));
      } else {
        createUnassignedActivity({
          issueId: ticketDetails?.id,
          assignedFromId: oldValuesForActivity?.oldAssignee?.id,
          userId: currentUser.id,
        });

        setOldValuesForActivity((prev) => ({
          ...prev,
          oldAssignee: null,
        }));
      }
    },
  });

  const { mutate: handleDueDateUpdate } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.DUE_DATE,
    ...onTicketDetailsCustomUpdate(ticketByIdQueryKey),
    customOnSuccess: (data) => {
      createActionPerformedActivity({
        issueId: ticketDetails?.id,
        oldValue: getInFormattedUserTimezone(
          oldValuesForActivity?.dueDate,
          currentUser?.timezone,
          BASE_DATE_TIME_FORMAT
        ),
        newValue: `Due date updated to ${getInFormattedUserTimezone(data[0].dueDate, currentUser?.timezone, BASE_DATE_TIME_FORMAT)}`,
        userId: currentUser?.id,
      });

      setOldValuesForActivity((prev) => ({
        ...prev,
        oldDueDate: data[0].dueDate,
      }));
    },
  });

  const { mutate: handleStatusUpdate } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.STATUS,
    ...onTicketDetailsCustomUpdate(ticketByIdQueryKey),
    customOnSuccess: (data) => {
      createStatusChangedActivity({
        issueId: ticketDetails?.id,
        oldStatus: oldValuesForActivity?.oldStatus,
        newStatus: data[0].status,
        userId: currentUser?.id,
      });

      setOldValuesForActivity((prev) => ({
        ...prev,
        oldStatus: data[0].priority,
      }));
    },
  });

  const priorityValue = PRIORITY_OPTIONS.find(
    (priority) => priority.value === (ticketDetails?.priority || ISSUE_PRIORITIES.NONE)
  );

  const relatedProcessEntity = ticketDetails?.relatedEntities?.find(
    (entity) => entity.type === ISSUE_ENTITY_TYPE.PROCESS
  );

  const procInstanceId = relatedProcessEntity?.relatedEntity?.procInstanceId;

  const processId = ticketDetails?.workflowId;

  const handleOpenProcessClick = () => {
    const url = generatePath(routes.PROCESS_MANAGER_INFO, {
      processId,
    });

    window.open(url, '_blank');
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
            handlePriorityUpdate({
              dueDate: ticketDetails.dueDate,
              issueId: ticketDetails.id,
              assignedToUserId: ticketDetails.assignedTo?.id || null,
              priority: priority.value,
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
      <PriorityWithIcon value={priorityValue.value} />
    </EditValueTrigger>
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
            assignedByUserId: user?.value.id ? currentUser?.id : null,
            ...(user?.value.id && { name: `${user?.value?.firstName} ${user?.value?.lastName}` }),
          });
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
            assignedByUserId: currentUser?.id,
          });
        }}
      >
        Assign to me
      </StyledButton>
    </StyledFlex>
  );

  const renderDueDate = () => {
    const val = ticketDetails?.dueDate ? new Date(ticketDetails?.dueDate) : '';

    return (
      <EditValueTrigger
        editableComponent={(setEditable, key) => (
          <ServiceTicketDueDate
            placeholder=""
            isMenuPortal
            isMenuOpen={!!key}
            closeMenuOnScroll={(e) => {
              if (e.target !== document) setEditable(false); // NOTE: Closes menu when user scrolls
            }}
            onChange={(dueDate) => {
              handleDueDateUpdate({
                issueId: ticketDetails.id,
                assignedToUserId: ticketDetails.assignedTo?.id || null,
                dueDate: getInFormattedUserTimezone(dueDate, currentUser?.timezone, "yyyy-MM-dd'T'HH:mm:00.000'Z'"),
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
            getInFormattedUserTimezone(ticketDetails?.dueDate, currentUser?.timezone, BASE_DATE_TIME_FORMAT)
          ) : (
            <StyledEmptyValue />
          )}
        </TicketTasksDueDate>
      </EditValueTrigger>
    );
  };

  const renderIncidentTime = () =>
    getInFormattedUserTimezone(
      convertTimeStampToIso(ticketDetails?.createdAt),
      currentUser?.timezone,
      BASE_DATE_TIME_FORMAT
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

  const renderIncidentStep = () => ticketDetails?.additionalFields?.failedTaskName || <StyledEmptyValue />;

  const renderAssignedBy = () => {
    const fullName = ticketDetails?.assignedBy?.name;

    if (!fullName) return <StyledEmptyValue />;

    const splitName = fullName?.split(' ');

    let customUser = { firstName: fullName };

    if (splitName?.length > 1) {
      customUser = { firstName: splitName[0], lastName: splitName[splitName.length - 1] };
    }

    return (
      <StyledFlex direction="row" gap="6px" alignItems="center" marginLeft="5px">
        <UserAvatar customUser={customUser} size={30} color={colors.primary} />
        <StyledText weight={400}>{fullName}</StyledText>
      </StyledFlex>
    );
  };

  const renderOpenInProcessEditorBtn = () => (
    <StyledTooltip title="" arrow placement="top" p="10px 15px" maxWidth="auto">
      <StyledFlex>
        <StyledButton variant="contained" tertiary startIcon={<OpenIcon width={18} />} onClick={handleOpenProcessClick}>
          Open in Process Editor
        </StyledButton>
      </StyledFlex>
    </StyledTooltip>
  );

  const renderCopyButton = () => (
    <StyledTooltip title={copyMessage} arrow placement="bottom" p="10px 15px" maxWidth="auto">
      <StyledFlex
        as="span"
        width="38px"
        height="38px"
        padding="8px 8px 8px 10px"
        cursor="pointer"
        borderRadius="7px"
        backgroundColor={colors.graySilver}
        onClick={() => {
          copyToClipboard(`${window.location.href}`);
          setCopyMessage('Copied!');
        }}
        onMouseLeave={() => setCopyMessage(`Copy URL of ${ISSUE_CATEGORIES.FALLOUT_TICKET}`)}
      >
        <CopyIcon />
      </StyledFlex>
    </StyledTooltip>
  );

  const renderStatus = () => {
    const issueType = category.types.find((type) => type.name === ISSUE_CATEGORIES.FALLOUT_TICKET);

    const statuses = issueType?.statuses;

    const availableStatusOption = () => {
      if (isTicketResolved)
        return {
          toolTip: FALLOUT_TICKET_STATUS_TOOLTIPS[STATUS_CONSTANTS.RESOLVED],
          label: 'Action Performed (Retired Execution)',
        };

      return ticketDetails?.status === STATUS_CONSTANTS.UNRESOLVED
        ? {
            toolTip: FALLOUT_TICKET_STATUS_TOOLTIPS[STATUS_CONSTANTS.UNRESOLVED],
            label: 'Change Status to Forced Resolved',
            status: statuses?.find((status) => status.name === STATUS_CONSTANTS.FORCE_RESOLVED),
          }
        : {
            toolTip: FALLOUT_TICKET_STATUS_TOOLTIPS[STATUS_CONSTANTS.FORCE_RESOLVED],
            label: 'Change Status to “Unresolved”',
            status: statuses?.find((status) => status.name === STATUS_CONSTANTS.UNRESOLVED),
          };
    };

    const handleNewStatusClick = () => {
      if (isTicketResolved) return;

      const value = availableStatusOption().status;

      if (!value) return toast.error('Something went wrong');

      const statusId = value.id;

      handleStatusUpdate({
        issueId: ticketDetails?.id,
        issueStatusId: statusId,
      });
    };

    return (
      <StyledFlex flexDirection="column" gap="15px" alignItems="end">
        {ticketDetails?.status ? (
          <StyledButton variant="text" cursor={isTicketResolved ? 'default' : 'pointer'}>
            <ServiceTicketStatus
              minWidth="max-content"
              color={statuses?.find((status) => status.name === ticketDetails?.status)?.colour}
            >
              {ticketDetails?.status}
            </ServiceTicketStatus>
          </StyledButton>
        ) : (
          <Skeleton width={153} height={44} />
        )}

        <StyledButton
          onClick={handleNewStatusClick}
          variant="text"
          cursor={isTicketResolved ? 'default' : 'pointer'}
          endIcon={
            <StyledTooltip
              title={availableStatusOption().toolTip}
              arrow
              p="10px 15px"
              maxWidth="350px"
              placement="bottom"
            >
              <InfoOutlined sx={{ marginLeft: '5px', fontSize: '21px' }} />
            </StyledTooltip>
          }
        >
          {availableStatusOption().label}
        </StyledButton>
      </StyledFlex>
    );
  };

  const sharedInfoListItemProps = {
    weight: isFullViewMode ? 500 : 600,
  };

  return (
    <>
      {isFullViewMode && (
        <StyledFlex direction="row" justifyContent="flex-end" alignItems="flex-start" gap="8px" mb="24px">
          {renderOpenInProcessEditorBtn()}

          <StyledFlex direction="row" justifyContent="flex-end" gap="8px" mb={2}>
            {renderCopyButton()}
          </StyledFlex>
        </StyledFlex>
      )}
      <InfoListGroup title="Details" noPaddings>
        <StyledDivider orientation="horizontal" height="2px" />

        {!isFullViewMode && (
          <InfoListItem name="Status" alignItems="center" nameStyles={sharedInfoListItemProps}>
            {renderStatus()}
          </InfoListItem>
        )}

        <InfoListItem name="Priority" alignItems="center" nameStyles={sharedInfoListItemProps}>
          {renderPriority()}
        </InfoListItem>

        <InfoListItem name="Incident Time" alignItems="center" nameStyles={sharedInfoListItemProps}>
          {renderIncidentTime()}
        </InfoListItem>

        <InfoListItem name="Incident Step" alignItems="center" nameStyles={sharedInfoListItemProps}>
          {renderIncidentStep()}
        </InfoListItem>

        <InfoListItem name="Assignee" alignItems="center" nameStyles={sharedInfoListItemProps}>
          {renderAssignee()}
        </InfoListItem>

        <InfoListItem name="Due Date" alignItems="center" nameStyles={sharedInfoListItemProps}>
          {renderDueDate()}
        </InfoListItem>

        <InfoListItem name="Resolved On" alignItems="center" nameStyles={sharedInfoListItemProps}>
          {renderResolvedOn()}
        </InfoListItem>

        <InfoListItem name="Assigned By" nameStyles={sharedInfoListItemProps}>
          {renderAssignedBy()}
        </InfoListItem>
      </InfoListGroup>

      {!isFullViewMode && processId && procInstanceId && (
        <>
          <StyledDivider orientation="horizontal" borderWidth={3} m="25px 0 50px" />

          <StyledFlex>
            <StyledText mb={18} weight="600" size={19} p="0 14px">
              Execution Path
            </StyledText>

            <StyledFlex margin="0 -20px">
              <StyledActionsDiagram>
                <FalloutProcessEditor processId={processId} processInstanceId={procInstanceId} />
              </StyledActionsDiagram>
            </StyledFlex>
          </StyledFlex>
        </>
      )}
    </>
  );
};

export default FalloutTicketDetailsPanel;
