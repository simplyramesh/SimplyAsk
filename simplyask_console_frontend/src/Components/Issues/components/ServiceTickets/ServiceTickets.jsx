import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplayIcon from '@mui/icons-material/Replay';
import { Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import CopyIcon from '../../../../Assets/icons/copy.svg?component';
import CSVIcon from '../../../../Assets/icons/csv.svg?component';
import ExportIcon from '../../../../Assets/icons/exportIconButton.svg?component';
import BulkAssignIcon from '../../../../Assets/icons/issues/bulkOperations/assign.svg?component';
import BulkDeleteIcon from '../../../../Assets/icons/issues/bulkOperations/delete.svg?component';
import BulkPriorityIcon from '../../../../Assets/icons/issues/bulkOperations/priority.svg?component';
import PDFIcon from '../../../../Assets/icons/pdf.svg?component';
import routes from '../../../../config/routes';
import { useUser } from '../../../../contexts/UserContext';
import { useCreateActivity } from '../../../../hooks/activities/useCreateActivitiy';
import { useDeleteIssues } from '../../../../hooks/issue/useDeleteIssues';
import { useGetIssueById } from '../../../../hooks/issue/useGetIssueById';
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
import { useFilter } from '../../../../hooks/useFilter';
import { usePopoverToggle } from '../../../../hooks/usePopoverToggle';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { downloadTicketDetails } from '../../../../Services/axios/filesAxios';
import { getIssues } from '../../../../Services/axios/issuesAxios';
import { issuesCategories } from '../../../../store';
import { getServiceTicketsCategory } from '../../../../store/selectors';
import NavTabs from '../../../shared/NavTabs/NavTabs';
import TabPanel from '../../../shared/NavTabs/TabPanel';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import OpenIcon from '../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import ContentLayout from '../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { useModalToggle } from '../../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  CustomBlackAndWhiteStyledButtonSideBar,
  StyledDivider,
  StyledDivOnHover,
  StyledFlex,
  StyledLink,
  StyledText,
} from '../../../shared/styles/styled';
import { BULK_OPERATION_TYPES } from '../../constants/bulkOperations';
import { ISSUE_CATEGORIES, ISSUES_QUERY_KEYS } from '../../constants/core';
import { useUpdateIssueFields } from '../../hooks/useUpdateIssueFields';

import { useUpdateTableFilterSearchParams } from '../../../../hooks/useTableFilterSearchParams';
import { useNavTabsSearchParams } from '../../../../hooks/useTabs';
import TicketTasks from '../TicketTasks/TicketTasks';
import BulkDeleteModal from './components/BulkDeleteModal/BulkDeleteModal';
import BulkUpdateModal from './components/BulkUpdateModal/BulkUpdateModal';
import CreateServiceTicketFormModal from './components/CreateServiceTicketFormModal/CreateServiceTicketFormModal';
import ServiceTicketsFilters from './components/ServiceTicketsFilters/ServiceTicketsFilters';
import ServiceTicketTypeIcon from './components/shared/ServiceTicketTypeIcon/ServiceTicketTypeIcon';
import TicketDetails from './components/TicketDetails';
import { SERVICE_TICKET_INITIAL_VALUES, SERVICE_TICKET_SIDE_FILTER_INITIAL_VALUES } from './constants/initialValues';
import { useOptimisticDeleteServiceTicket } from './hooks/useOptimisticDeleteServiceTicket';
import { SERVICE_TICKETS_COLUMNS } from './utils/formatters';
import { selectedServiceTicketsFiltersMeta, SERVICE_TICKET_FILTER_KEY, serviceTicketsFormatter } from './utils/helpers';

const NAV_TAB_LABELS = [
  { title: 'Tickets', value: 'tickets' },
  { title: 'Ticket Tasks', value: 'ticketTasks' },
];

const ServiceTickets = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    id: idExportPopover,
    open: openExportPopover,
    anchorEl: anchorElExportPopover,
    handleClick: handleClickExportPopover,
    handleClose: handleCloseExportPopover,
  } = usePopoverToggle('export-popover');
  const {
    id: idDeletePopover,
    open: openDeletePopover,
    anchorEl: anchorElDeletePopover,
    handleClick: handleClickDeletePopover,
    handleClose: handleCloseDeletePopover,
  } = usePopoverToggle('delete-popover');

  const { user } = useUser();

  const { open: isCreateModalOpen, setOpen: setIsCreateModalOpen, openId: createModalOpenId } = useModalToggle();

  const { tabValue, onTabChange, navTabLabels } = useNavTabsSearchParams(0, NAV_TAB_LABELS, true);

  const [tablePageSize] = useState(25);
  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [ticketDetailsOpen, setTicketDetailsOpen] = useState(null);
  const [ticketToSingleDelete, setTicketToSingleDelete] = useState(null);
  const [selectedTicketsIds, setSelectedTicketsIds] = useState([]);
  const [selectionRefreshCount, setSelectionRefreshCount] = useState(0);
  const serviceTicketQueryKeyRef = useRef(null);
  const [paginationCache, setPaginationCache] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState('');
  const { copyToClipboard } = useCopyToClipboard('Copy URL of Service Ticket');

  const [bulkUpdateType, setBulkUpdateType] = useState('');

  const category = useRecoilValue(getServiceTicketsCategory);

  const handleOpenSelectedItem = useCallback((item) => setTicketDetailsOpen(item), []);

  const { mutate: removeSingleIssue } = useOptimisticDeleteServiceTicket({
    queryKey: serviceTicketQueryKeyRef.current,
    onSuccess: () => {
      toast.success(
        `${ticketToSingleDelete?.displayName || ticketToSingleDelete?.name} has been deleted successfully!`
      );
      setTicketDetailsOpen(null);
      setTicketToSingleDelete(null);
    },
  });

  const { removeIssues } = useDeleteIssues({
    onSuccess: ({ variables }) => {
      toast.success(`${variables.length} Service Tickets have been deleted successfully!`);
    },
  });

  const issueCategories = useRecoilValue(issuesCategories);
  const issuesCategoryIds = issueCategories?.reduce((acc, { id, name }) => ({ ...acc, [name]: id }), {});

  const excludedSearchParams = [
    'returnParameters',
    'returnAdditionalField',
    'returnRelatedEntities',
    'issueCategoryId',
  ];

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: {
        sideFilter: SERVICE_TICKET_SIDE_FILTER_INITIAL_VALUES,
        ...SERVICE_TICKET_INITIAL_VALUES,
        timezone: user?.timezone,
        returnParameters: true,
        returnAdditionalField: true,
        returnRelatedEntities: true,
        issueCategoryId: issuesCategoryIds?.[ISSUE_CATEGORIES.SERVICE_TICKET],
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
      handleUrlFiltersMeta(filterValue, selectedFilters);
    },
    formatter: serviceTicketsFormatter,
    selectedFiltersMeta: selectedServiceTicketsFiltersMeta,
  });

  const { updateSearchParams, handleModalOpenUrl, handleUrlFiltersMeta } = useUpdateTableFilterSearchParams({
    excludedSearchParams,
    enableURLSearchParams: tabValue === 0,
  });

  const {
    pagination,
    setColumnFilters,
    searchText,
    setSearchText,
    setPagination,
    sorting,
    setSorting,
    data,
    isFetching,
    selectedFiltersBar,
    setSelectedFiltersBar,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getIssues,
    queryKey: ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'createdAt',
        desc: true,
      },
    ],
    pageSize: tablePageSize,
    keyRef: serviceTicketQueryKeyRef,
    updateSearchParams,
    enableURLSearchParams: tabValue === 0,
    excludedSearchParams,
    onModalAction: handleOpenSelectedItem,
  });

  const { fetchData: refetchSidebarData } = useGetIssueById({
    key: ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID,
    issueId: ticketDetailsOpen?.id,
  });

  const toggleSidebar = (sidebar = 'filters', value = false) => {
    const stateSelector = {
      filters: setIsViewFiltersOpen,
      details: setTicketDetailsOpen,
    };

    stateSelector[sidebar](value);
  };

  const { handleStatusUpdate, handlePriorityUpdate, handleAssigneeUpdate, handleDueDateUpdate, saveIssues } =
    useUpdateIssueFields();

  const handleSingleDelete = (ticketToDelete) => {
    setTicketToSingleDelete(ticketToDelete);
  };

  const handleClearAll = useCallback(() => {
    setFilterFieldValue(SERVICE_TICKET_FILTER_KEY, SERVICE_TICKET_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  }, []);

  const handleClearFilterField = useCallback((key) => {
    setFilterFieldValue(SERVICE_TICKET_FILTER_KEY, {
      ...sourceFilterValue[SERVICE_TICKET_FILTER_KEY],
      [key]: SERVICE_TICKET_INITIAL_VALUES[key],
    });
    submitFilterValue();
  }, []);

  const handleSorting = useCallback((old) => {
    const { id, desc } = old()[0];

    setFilterFieldValue('sideFilter', { ...sourceFilterValue.sideFilter, [`${id}Sort`]: `${!desc}` }, false);
    setSorting(old);
    submitFilterValue();
  }, []);

  const handleCreateTicket = async (values, resetForm) => {
    try {
      await saveIssues(values);

      if (resetForm) {
        resetForm();
      } else {
        setIsCreateModalOpen(false);
      }
    } catch {}
  };

  useEffect(() => {
    if (isFetching && !isEqual(pagination, paginationCache)) {
      setPaginationCache(pagination);
      setIsDataLoading(true);
    } else if (isDataLoading && !isFetching) {
      setIsDataLoading(false);
    }
  }, [isFetching, pagination, paginationCache]);

  const tableBulkActions = useMemo(
    () => [
      {
        text: 'Update priority',
        icon: <BulkPriorityIcon />,
        callback: () => {
          setBulkUpdateType(BULK_OPERATION_TYPES.PRIORITY);
        },
      },
      {
        text: 'Assign',
        icon: <BulkAssignIcon />,
        callback: () => {
          setBulkUpdateType(BULK_OPERATION_TYPES.ASSIGNEE);
        },
      },
      // Hidden until design requirements would be updated
      // {
      //   text: 'Update Status',
      //   icon: <BulkStatusIcon />,
      //   callback: () => {
      //     setBulkUpdateType(BULK_OPERATION_TYPES.STATUS);
      //   },
      // },
      {
        text: 'Delete',
        icon: <BulkDeleteIcon />,
        callback: () => {
          selectedTicketsIds.length === 1
            ? handleSingleDelete(data?.content?.find((task) => task.id === selectedTicketsIds[0]))
            : setBulkUpdateType(BULK_OPERATION_TYPES.DELETE);
        },
      },
    ],
    [selectedTicketsIds]
  );

  const getServiceTicketTypeByName = (name) => category?.types?.find((type) => type.name === name);

  const isBulkUpdateOpened = [
    BULK_OPERATION_TYPES.STATUS,
    BULK_OPERATION_TYPES.PRIORITY,
    BULK_OPERATION_TYPES.ASSIGNEE,
  ].includes(bulkUpdateType);

  const tableMeta = useMemo(
    () => ({
      handleSingleDelete,
      handleStatusUpdate,
      handlePriorityUpdate,
      handleAssigneeUpdate,
      handleDueDateUpdate,
      user,
      theme,
      serviceTicketTypes: category?.types,
      setTicketDetailsOpen: (row) => {
        setTicketDetailsOpen(row);
        handleModalOpenUrl(row);
      },
      key: serviceTicketQueryKeyRef.current,
      useCreateActivity,
    }),
    [serviceTicketQueryKeyRef.current]
  );

  const memoizedPinColumns = useMemo(() => ['ticketName'], []);
  const memoizedPinRowHoverActionColumns = useMemo(() => ['deleteById'], []);

  const onSearch = useCallback((e) => setSearchText(e.target.value), []);
  const onShowFilters = useCallback(() => toggleSidebar('filters', true), []);

  const renderTableActions = useMemo(
    () => (
      <StyledFlex direction="row" gap="15px">
        <StyledButton
          variant="contained"
          secondary
          startIcon={<CustomTableIcons icon="ADD" width={24} color="white" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create
        </StyledButton>
        <StyledTooltip title="Export Service Tickets" arrow placement="top" p="10px 15px" maxWidth="auto">
          <StyledFlex as="span">
            <ExportIcon style={{ cursor: 'pointer' }} onClick={handleClickExportPopover} />
          </StyledFlex>
        </StyledTooltip>
        <Popover
          id={idExportPopover}
          open={openExportPopover}
          anchorEl={anchorElExportPopover}
          onClose={handleCloseExportPopover}
          sx={{
            top: 10,
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
          <StyledFlex>
            <StyledDivOnHover>
              <StyledFlex
                cursor="pointer"
                p="10px 15px"
                direction="row"
                gap="10px"
                alignItems="center"
                onClick={() => {
                  downloadTicketDetails('PDF');
                  handleCloseExportPopover();
                }}
              >
                <PDFIcon />
                PDF
              </StyledFlex>
            </StyledDivOnHover>

            <StyledDivider borderWidth={2} />

            <StyledDivOnHover>
              <StyledFlex
                cursor="pointer"
                p="10px 15px"
                direction="row"
                gap="10px"
                alignItems="center"
                onClick={() => {
                  downloadTicketDetails('CSV');
                  handleCloseExportPopover();
                }}
              >
                <CSVIcon />
                CSV
              </StyledFlex>
            </StyledDivOnHover>
          </StyledFlex>
        </Popover>
      </StyledFlex>
    ),
    []
  );

  return (
    <PageLayout
      top={
        <NavTabs
          labels={navTabLabels}
          value={tabValue}
          onChange={(e, newTabValue) => {
            if (newTabValue === 0) refetch();

            onTabChange(e, newTabValue);
          }}
        />
      }
    >
      <TabPanel value={tabValue} index={0}>
        <ContentLayout noPadding fullHeight>
          <TableV2
            data={data}
            columns={SERVICE_TICKETS_COLUMNS}
            searchPlaceholder="Search"
            onSearch={onSearch}
            initialSearchText={searchText}
            onShowFilters={onShowFilters}
            selectedFilters={selectedFiltersBar}
            onClearAllFilters={handleClearAll}
            onClearFilter={handleClearFilterField}
            isLoading={isDataLoading}
            sorting={sorting}
            setSorting={handleSorting}
            onSelectionChange={setSelectedTicketsIds}
            selectBarActions={tableBulkActions}
            pagination={pagination}
            setPagination={setPagination}
            emptyTableDescription="There are currently no service tickets"
            pinSelectColumn
            meta={tableMeta}
            headerActions={renderTableActions}
            entityName="Service Tickets"
            enableEditing
            selectionRefreshTrigger={selectionRefreshCount}
            pinColumns={memoizedPinColumns}
            pinRowHoverActionColumns={memoizedPinRowHoverActionColumns}
            enablePageSizeChange
            onTableRefresh={() => {
              setIsDataLoading(true);
              refetch();
            }}
          />
        </ContentLayout>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ContentLayout noPadding fullHeight>
          <TicketTasks />
        </ContentLayout>
      </TabPanel>

      {/* Create modal */}
      <CreateServiceTicketFormModal
        key={createModalOpenId}
        open={isCreateModalOpen}
        onSubmit={handleCreateTicket}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Filters sidebar */}
      <ServiceTicketsFilters
        isOpen={isViewFiltersOpen}
        onApplyFilters={(sideFilter) => {
          toggleSidebar('filters', false);
          setFilterFieldValue(SERVICE_TICKET_FILTER_KEY, sideFilter);
          submitFilterValue();
        }}
        onClose={() => toggleSidebar('filters', false)}
        initialValues={sourceFilterValue.sideFilter}
      />

      {ticketDetailsOpen && (
        <CustomSidebar
          width={780}
          open={!!ticketDetailsOpen}
          onClose={() => {
            toggleSidebar('details', null);
            handleModalOpenUrl(null);
          }}
          headerTemplate={
            <StyledFlex gap="10px">
              <StyledFlex direction="row" alignItems="center" gap="15px">
                <ServiceTicketTypeIcon type={getServiceTicketTypeByName(ticketDetailsOpen?.issueType)} isMediumIcon />
                <StyledFlex>
                  <StyledText size={16} weight={500} lh={20}>
                    <StyledLink
                      to={`${ticketDetailsOpen?.id}`}
                      themeColor="primary"
                      onClick={(e) => e.preventDefault()}
                    >
                      #{ticketDetailsOpen?.id}
                    </StyledLink>
                  </StyledText>
                </StyledFlex>
                <StyledFlex alignItems="center">
                  <StyledDivider
                    borderWidth={2}
                    color={theme.colors.jetStreamGray}
                    orientation="vertical"
                    height="17px"
                  />
                </StyledFlex>
                <StyledText weight={500} lh={20}>
                  {ticketDetailsOpen?.displayName}
                </StyledText>
              </StyledFlex>
            </StyledFlex>
          }
          customHeaderActionTemplate={
            <StyledFlex direction="row" alignItems="center" gap="15px">
              <CustomBlackAndWhiteStyledButtonSideBar
                startIcon={<ReplayIcon sx={{ transform: 'scaleX(-1)' }} />}
                onClick={() => refetchSidebarData()}
              >
                Refresh
              </CustomBlackAndWhiteStyledButtonSideBar>
              <StyledButton
                primary
                variant="contained"
                onClick={() => navigate(`${routes.TICKETS}/${ticketDetailsOpen?.id}`)}
                startIcon={<OpenIcon fontSize="inherit" />}
              >
                View Full Ticket
              </StyledButton>
              <StyledTooltip title={copyMessage} arrow placement="top" p="10px 15px" maxWidth="auto">
                <StyledFlex
                  as="span"
                  width="38px"
                  height="38px"
                  padding="8px 8px 8px 10px"
                  cursor="pointer"
                  borderRadius="7px"
                  backgroundColor={theme.colors.darkGrayHoverFilterIcon}
                  onClick={() => {
                    copyToClipboard(`${window.location}/${ticketDetailsOpen?.id}`);
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
                  width="38px"
                  height="38px"
                  padding="1px 1px 1px 2px"
                  cursor="pointer"
                  borderRadius="7px"
                  backgroundColor={theme.colors.darkGrayHoverFilterIcon}
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
                    setTicketToSingleDelete(ticketDetailsOpen);
                    handleCloseDeletePopover();
                  }}
                >
                  <CustomTableIcons icon="REMOVE" width={24} />
                  Delete Ticket
                </StyledFlex>
              </Popover>
            </StyledFlex>
          }
        >
          {() => (
            <TicketDetails
              queryKey={serviceTicketQueryKeyRef.current}
              ticketId={ticketDetailsOpen?.id}
              onDisplayNameChange={(updatedName) =>
                setTicketDetailsOpen((prev) => ({ ...prev, displayName: updatedName }))
              }
            />
          )}
        </CustomSidebar>
      )}

      {/* BULK AND SINGLE OPERATIONS MODALS */}
      <ConfirmationModal
        isOpen={!!ticketToSingleDelete}
        successBtnText="Delete"
        alertType="WARNING"
        title="Are You Sure?"
        text={`You are about to delete a <strong>${ticketToSingleDelete?.displayName || ticketToSingleDelete?.name}</strong>`}
        onCloseModal={() => setTicketToSingleDelete(null)}
        onSuccessClick={() => {
          removeSingleIssue([ticketToSingleDelete.id]);
          if (selectedTicketsIds.length) setSelectionRefreshCount((prev) => prev + 1);
        }}
      />

      {/* Bulk operations */}
      <BulkUpdateModal
        entity={bulkUpdateType}
        open={isBulkUpdateOpened}
        onClose={() => setBulkUpdateType('')}
        selectedTickets={selectedTicketsIds}
        onUpdate={(fields) => {
          const updatedTickets = selectedTicketsIds.map((ticketId) => {
            const ticket = data?.content?.find((ticket) => ticket.id === ticketId);

            return {
              dueDate: ticket.dueDate,
              issueId: ticket.id,
              assignedToUserId: ticket.assignedTo?.id || null,
              ...fields,
            };
          });

          saveIssues(updatedTickets);

          setBulkUpdateType('');
          setSelectionRefreshCount((prev) => prev + 1);
        }}
      />

      <BulkDeleteModal
        open={bulkUpdateType === BULK_OPERATION_TYPES.DELETE}
        selectedTickets={selectedTicketsIds}
        onClose={() => setBulkUpdateType('')}
        onDelete={() => {
          removeIssues(selectedTicketsIds);

          setBulkUpdateType('');
          setSelectionRefreshCount((prev) => prev + 1);
        }}
        tableType="Service Tickets"
      />
    </PageLayout>
  );
};

export default ServiceTickets;
