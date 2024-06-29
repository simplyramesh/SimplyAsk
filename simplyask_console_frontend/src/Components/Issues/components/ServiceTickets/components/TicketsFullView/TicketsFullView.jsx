import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { useTheme } from '@emotion/react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { deleteIssues } from '../../../../../../Services/axios/issuesAxios';
import routes from '../../../../../../config/routes';
import { useCreateActivity } from '../../../../../../hooks/activities/useCreateActivitiy';
import { useGetIssueById } from '../../../../../../hooks/issue/useGetIssueById';
import useDeleteTicket from '../../../../../../hooks/useDeleteTicket';
import { modifiedCurrentPageDetails } from '../../../../../../store';
import { getServiceTicketsCategory } from '../../../../../../store/selectors';
import NavTabs from '../../../../../shared/NavTabs/NavTabs';
import TabPanel from '../../../../../shared/NavTabs/TabPanel';
import ContentLayout from '../../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../../shared/styles/styled';
import StatusDeleteBtn from '../../../../../shared/ticketStatusHeader/StatusDeleteBtn';
import { ISSUES_QUERY_KEYS } from '../../../../constants/core';
import useIssueGetAllAttachedFiles from '../../../../hooks/useIssueGetAllAttachedFiles';
import TicketTasks from '../../../TicketTasks/TicketTasks';
import { SERVICE_TICKET_TABS } from '../../constants/core';

import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StatusOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/StatusOption';
import { StatusValue } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/StatusValue';

import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import useTabs from '../../../../../../hooks/useTabs';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  onTicketDetailsCustomUpdate,
  SERVICE_TICKET_FIELDS_TYPE,
  useOptimisticIssuesUpdate,
} from '../../../../hooks/useOptimisticIssuesUpdate';
import { SERVICE_TICKETS_STATUSES } from '../../constants/initialValues';
import TicketDetailsTab from './TicketDetailsTab/TicketDetailsTab';

const NAVIGATION_LABELS = [
  { title: 'Ticket Details', value: SERVICE_TICKET_TABS.OVERVIEW },
  { title: 'Ticket Tasks', value: SERVICE_TICKET_TABS.TICKET_TASKS },
];

export const mapStatuses = (statuses) => {
  return statuses.map((status) => ({
    label: status.name,
    value: status.id,
    ...status,
  }));
};

const TicketsFullView = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const { ticketId } = useParams();
  const {
    handleOpenDeleteTicketModal,
    handleCloseDeleteTicketModal,
    handleDeleteTicket,
    showDeleteBtn,
    toggleShowDeleteBtn,
    showDeleteTicketModal,
    ticketToDelete,
    setTicketToDelete,
  } = useDeleteTicket();

  const { currentUser: user } = useGetCurrentUser();
  const { tabValue, onTabChange } = useTabs(0);

  const [ticketData, setTicketData] = useState();
  const [statusRequests, setStatusRequests] = useState([]);
  const [ticketType, setTicketType] = useState();
  const [ticketTabs, setTicketTabs] = useState();
  const [navigationTabs, setNavigationTabs] = useState(NAVIGATION_LABELS);

  const queryKey = useMemo(() => [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID, ticketId], [ticketId]);

  const { createStatusChangedActivity } = useCreateActivity();

  const { issue: ticket, error, isFetching, dataUpdatedAt } = useGetIssueById({ key: queryKey[0], issueId: ticketId });

  const { getAllAttachedFiles, isGetAllAttachedFilesLoading } = useIssueGetAllAttachedFiles({
    issueId: ticket?.id,
    sortOrder: 'timeStamp',
    isAscending: false,
  });

  const category = useRecoilValue(getServiceTicketsCategory);

  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  useEffect(() => {
    if (ticket && category?.types.length) {
      const issueType = category.types.find((type) => type.name === ticket.issueType);

      const tabs = navigationTabs.filter((tab) => issueType.tabs.includes(tab.value));

      setTicketType(issueType);
      setTicketTabs(issueType.tabs);
      setStatusRequests(issueType.statuses);
      setNavigationTabs(tabs);

      setCurrentPageDetailsState({
        pageUrlPath: routes.TICKETS_FULLVIEW,
        pageName: ticket.displayName,
      });
    }
  }, [ticket, category]);

  const onDeleteService = (ticketId) => {
    if (!ticketId) return;

    deleteIssues([ticketId])
      .then(() => {
        setTicketToDelete('');
        navigate(`${routes.TICKETS}`);

        toast.success('Ticket has been deleted successfully!');
      })
      .catch(() => toast.error('Something went wrong'));
  };
  const { onDelete } = handleDeleteTicket(onDeleteService);

  useEffect(() => {
    if (!isFetching && ticket && category) {
      setTicketData(ticket);
    }
  }, [ticket, isFetching, category]);

  const { mutate: handleStatusUpdate, isLoading: isStatusUpdating } = useOptimisticIssuesUpdate({
    queryKey,
    type: SERVICE_TICKET_FIELDS_TYPE.STATUS,
    ...onTicketDetailsCustomUpdate(queryKey),
    customOnSuccess: (data, variables, { customMutationPrevData, customMutationNewData }) => {
      createStatusChangedActivity({
        issueId: ticketId,
        oldStatus: customMutationPrevData.status?.toUpperCase(),
        newStatus: customMutationNewData.status?.toUpperCase(),
        userId: user?.id,
      });
    },
    ignoreToasts: true,
  });

  if (error) return <Navigate to={routes.TICKETS} replace />;

  const handleChangingStatus = async (value) => {
    if (!value) return toast.error('Something went wrong');

    handleStatusUpdate({
      dueDate: ticketData.dueDate,
      issueId: ticketId,
      assignedToUserId: ticketData.assignedTo?.id || null,
      issueStatusId: value.id,
      newStatus: value.label,
      displayName: ticketData.displayName,
      description: ticketData.description,
    });
  };

  const handleMarkAsResolved = () => {
    const mappedStatuses = mapStatuses(statusRequests);

    const resolvedValue = mappedStatuses.find((status) =>
      [SERVICE_TICKETS_STATUSES.RESOLVED, SERVICE_TICKETS_STATUSES.DONE].includes(status.label)
    );

    handleChangingStatus(resolvedValue);
  };

  const renderStatus = () => {
    const mappedStatuses = mapStatuses(statusRequests);

    const statusOptions = mappedStatuses.filter((status) => status.label !== ticket?.status);
    const statusValue = mappedStatuses.find((status) => status.label === ticket?.status);

    return (
      <CustomSelect
        menuPlacement="auto"
        alignMenu="right"
        closeMenuOnSelect
        options={statusOptions}
        placeholder={null}
        onChange={handleChangingStatus}
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
    );
  };

  // if (!ticketTabs) return <Spinner parent />;

  return (
    <PageLayout
      top={
        <NavTabs
          labels={navigationTabs}
          value={tabValue}
          onChange={onTabChange}
          action={
            <StyledFlex display="flex">
              <StatusDeleteBtn
                showDeleteBtn={showDeleteBtn}
                incidentId={ticketData?.id}
                toggleShowDeleteBtn={toggleShowDeleteBtn}
                handleOpenDeleteTicketModal={handleOpenDeleteTicketModal}
                iconSize="large"
                fullview
              >
                {ticket?.status !== SERVICE_TICKETS_STATUSES.RESOLVED &&
                  ticket?.status !== SERVICE_TICKETS_STATUSES.DONE && (
                    <StyledTooltip arrow placement="top" title="Mark Ticket as Resolved" p="10px 15px">
                      <StyledFlex
                        justifyContent="center"
                        backgroundColor={colors.graySilver}
                        px="8px"
                        margin="2px 10px 2px 0px"
                        borderRadius="10px"
                        cursor="pointer"
                        onClick={handleMarkAsResolved}
                      >
                        <CheckCircleOutlineIcon size={28} />
                      </StyledFlex>
                    </StyledTooltip>
                  )}
                {renderStatus()}
              </StatusDeleteBtn>
            </StyledFlex>
          }
        />
        // )
      }
    >
      <ContentLayout fullHeight noPadding>
        {ticketTabs?.includes(SERVICE_TICKET_TABS.OVERVIEW) && (
          <TabPanel index={0} value={tabValue}>
            {!ticketData ? (
              <Spinner parent />
            ) : (
              <TicketDetailsTab
                ticket={ticketData}
                dataUpdatedAt={dataUpdatedAt}
                ticketType={ticketType}
                getAllAttachedFiles={getAllAttachedFiles}
                queryKey={queryKey}
              />
            )}
          </TabPanel>
        )}
        {ticketTabs?.includes(SERVICE_TICKET_TABS.TICKET_TASKS) && (
          <TabPanel index={1} value={tabValue}>
            {ticketData ? (
              <TicketTasks ticket={ticketData} onResolveParent={handleMarkAsResolved} />
            ) : (
              <Spinner parent />
            )}
          </TabPanel>
        )}
        {ticketToDelete && showDeleteTicketModal && (
          <ConfirmationModal
            isOpen={showDeleteTicketModal}
            successBtnText="Delete"
            alertType="WARNING"
            title="Are You Sure?"
            text={`You are about to delete a <strong>${ticket.displayName}</strong>`}
            onCloseModal={handleCloseDeleteTicketModal}
            onSuccessClick={() => onDelete([ticketToDelete.id])}
          />
        )}
      </ContentLayout>
    </PageLayout>
  );
};
export default TicketsFullView;
