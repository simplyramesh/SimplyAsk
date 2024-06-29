import { InfoOutlined } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilState, useSetRecoilState } from 'recoil';

import ExpandMoreIcon from '../../../../../../Assets/icons/expandMore.svg?component';
import routes from '../../../../../../config/routes';
import { useCreateActivity } from '../../../../../../hooks/activities/useCreateActivitiy';
import {
  GET_FALLOUT_TICKET_BY_INCIDENT_ID,
  useFalloutDetails
} from '../../../../../../hooks/fallout/useFalloutDetails';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { usePopoverToggle } from '../../../../../../hooks/usePopoverToggle';
import { modifiedCurrentPageDetails } from '../../../../../../store';
import { getFalloutTicketsCategory } from '../../../../../../store/selectors';
import useTabNavigation from '../../../../../Settings/AccessManagement/hooks/useTabNavigation';
import NavTabs from '../../../../../shared/NavTabs/NavTabs';
import TabPanel from '../../../../../shared/NavTabs/TabPanel';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ContentLayout from '../../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { ISSUE_CATEGORIES } from '../../../../constants/core';
import {
  onTicketDetailsCustomUpdate,
  SERVICE_TICKET_FIELDS_TYPE,
  useOptimisticIssuesUpdate
} from '../../../../hooks/useOptimisticIssuesUpdate';
import ServiceTicketStatus from '../../../ServiceTickets/components/shared/ServiceTicketStatus/ServiceTicketStatus';
import {
  FALLOUT_TICKETS_FULL_VIEW_TABS,
  FALLOUT_TICKET_STATUS_TOOLTIPS,
  STATUS_CONSTANTS
} from '../../constants/constants';
import FalloutTicketActionsView from '../FalloutTicketActionsView/FalloutTicketActionsView';
import FalloutTicketDetailsTab from './FalloutTicketDetailsTab/FalloutTicketDetailsTab';
import FalloutTicketStatusMenu from './FalloutTicketStatusMenu/FalloutTicketStatusMenu';

const NAVIGATION_LABELS = [
  { title: 'Ticket Details', value: FALLOUT_TICKETS_FULL_VIEW_TABS.TICKET_DETAILS },
  { title: 'Action', value: FALLOUT_TICKETS_FULL_VIEW_TABS.ACTION },
];

const FalloutTicketsFullView = () => {
  const { falloutTicketId } = useParams();
  const navigate = useNavigate();
  const initialRenderRef = useRef(0);

  const [ticketType, setTicketType] = useState();
  const [ticketTabs, setTicketTabs] = useState([
    FALLOUT_TICKETS_FULL_VIEW_TABS.TICKET_DETAILS,
    FALLOUT_TICKETS_FULL_VIEW_TABS.ACTION,
  ]);
  const { tabIndex, onTabChange } = useTabNavigation(NAVIGATION_LABELS);
  const [navigationTabs, setNavigationTabs] = useState(NAVIGATION_LABELS);

  const [oldStatusValue, setOldStatusValue] = useState();
  const { currentUser } = useGetCurrentUser();

  const {
    anchorEl: statusActionsBtnAnchorEl,
    handleClick: onStatusActionsBtnOpen,
    handleClose: onStatusActionsBtnClose,
  } = usePopoverToggle('status-actions-popover', false);

  const {
    falloutTicketDetails: ticket,
    error,
    isLoading: isTicketLoading,
  } = useFalloutDetails({ incidentId: falloutTicketId, timezone: currentUser?.timezone });

  const { createStatusChangedActivity } = useCreateActivity({ ignoreToasts: true });

  const { mutate: handleStatusUpdate } = useOptimisticIssuesUpdate({
    queryKey: [GET_FALLOUT_TICKET_BY_INCIDENT_ID, falloutTicketId],
    type: SERVICE_TICKET_FIELDS_TYPE.STATUS,
    ...onTicketDetailsCustomUpdate([GET_FALLOUT_TICKET_BY_INCIDENT_ID, falloutTicketId]),
    customOnSuccess: (data) => {
      createStatusChangedActivity({
        issueId: falloutTicketId,
        oldStatus: oldStatusValue,
        newStatus: data[0].status,
        userId: currentUser?.id,
      });

      setOldStatusValue(data[0].status);
    },
  });

  const [category] = useRecoilState(getFalloutTicketsCategory);
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const isTicketResolved = STATUS_CONSTANTS.RESOLVED === ticket?.status;
  const statusRequests = ticketType?.statuses;

  useEffect(() => {
    if (ticket && category?.types.length) {
      if (initialRenderRef.current === 0) {
        setOldStatusValue(ticket.status);
      }

      const issueType = {
        ...category.types.find((type) => type.name === ISSUE_CATEGORIES.FALLOUT_TICKET),
      };

      const tabs = navigationTabs.filter((tab) => issueType.tabs.includes(tab.value));

      setTicketType(issueType);
      setTicketTabs(issueType.tabs);
      setNavigationTabs(tabs);

      setCurrentPageDetailsState({
        pageUrlPath: routes.FALLOUT_TICKETS_FULL_VIEW,
        pageName: ticket.displayName,
      });

      initialRenderRef.current++;
    }
  }, [ticket, category]);

  if (error) return navigate(routes.FALLOUT_TICKETS);

  const handleChangingStatus = async (value) => {
    if (!value) return toast.error('Something went wrong');

    onStatusActionsBtnClose();

    handleStatusUpdate({
      dueDate: ticket?.dueDate,
      issueId: falloutTicketId,
      assignedToUserId: ticket?.assignedTo?.id || null,
      issueStatusId: value.id,
      newStatus: value.name,
    });
  };

  const renderStatus = () => {
    const handleClick = (e) => {
      if (isTicketResolved) return;

      onStatusActionsBtnOpen(e);
    };

    return (
      <StyledFlex display="flex">
        <StyledTooltip
          title={isTicketResolved && FALLOUT_TICKET_STATUS_TOOLTIPS[STATUS_CONSTANTS.RESOLVED]}
          arrow
          placement="bottom"
          p="10px 15px"
          maxWidth="450px"
        >
          <StyledButton onClick={handleClick} variant="text" cursor={isTicketResolved ? 'default' : 'pointer'}>
            <ServiceTicketStatus
              minWidth="max-content"
              color={statusRequests?.find((status) => status.name === ticket.status)?.colour}
            >
              {ticket.status}
              <StyledFlex>
                {isTicketResolved ? <InfoOutlined sx={{ marginLeft: '5px', fontSize: '21px' }} /> : <ExpandMoreIcon />}
              </StyledFlex>
            </ServiceTicketStatus>
          </StyledButton>
        </StyledTooltip>
      </StyledFlex>
    );
  };

  if (!ticket) return <Spinner parent />;

  return (
    <PageLayout
      top={<NavTabs labels={navigationTabs} value={tabIndex} onChange={onTabChange} action={renderStatus()} />}
    >
      <ContentLayout fullHeight noPadding>
        {isTicketLoading && <Spinner fadeBgParentFixedPosition />}
        {ticketTabs.includes(FALLOUT_TICKETS_FULL_VIEW_TABS.TICKET_DETAILS) && (
          <TabPanel index={0} value={tabIndex}>
            <FalloutTicketDetailsTab
              ticket={ticket}
              ticketType={ticketType}
              queryKey={GET_FALLOUT_TICKET_BY_INCIDENT_ID}
            />
          </TabPanel>
        )}

        {ticketTabs.includes(FALLOUT_TICKETS_FULL_VIEW_TABS.ACTION) && (
          <TabPanel index={1} value={tabIndex}>
            <StyledFlex height="100%">
              <FalloutTicketActionsView ticket={ticket} />
            </StyledFlex>
          </TabPanel>
        )}

        <FalloutTicketStatusMenu
          open={statusActionsBtnAnchorEl}
          onClose={onStatusActionsBtnClose}
          anchorEl={statusActionsBtnAnchorEl}
          ticket={ticket}
          statusRequests={statusRequests}
          onStatusClick={handleChangingStatus}
        />
      </ContentLayout>
    </PageLayout>
  );
};
export default FalloutTicketsFullView;
