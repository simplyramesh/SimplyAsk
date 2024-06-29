import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplayIcon from '@mui/icons-material/Replay';
import { Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import CopyIcon from '../../../../Assets/icons/copy.svg?component';
import BulkDeleteIcon from '../../../../Assets/icons/issues/bulkOperations/delete.svg?component';
import { getIssues, updateIssuesAdditionalFields } from '../../../../Services/axios/issuesAxios';
import { useCreateActivity } from '../../../../hooks/activities/useCreateActivitiy';
import { useDeleteIssues } from '../../../../hooks/issue/useDeleteIssues';
import { useGetIssueById } from '../../../../hooks/issue/useGetIssueById';
import useOptimisticServiceTicketTaskUpdate from '../../../../hooks/service-tickets/tasks/useOptimisticServiceTicketTaskUpdate';
import { useServiceTicketTaskCreate } from '../../../../hooks/service-tickets/tasks/useServiceTicketTaskCreate';
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
import { useFilter } from '../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { usePopoverToggle } from '../../../../hooks/usePopoverToggle';
import { useUpdateTableFilterSearchParams } from '../../../../hooks/useTableFilterSearchParams';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { issuesCategories } from '../../../../store';
import {
  getServiceTaskTypes,
  getServiceTicketTasksCategory,
  getServiceTicketsCategory,
} from '../../../../store/selectors';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import { useModalToggle } from '../../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  CustomBlackAndWhiteStyledButtonSideBar,
  StyledDivider,
  StyledFlex,
  StyledText,
} from '../../../shared/styles/styled';
import { BULK_OPERATION_TYPES } from '../../constants/bulkOperations';
import {
  ISSUES_QUERY_KEYS,
  ISSUE_CATEGORIES,
  ISSUE_ENTITY_RELATIONS,
  ISSUE_ENTITY_SEARCH_TYPE,
  ISSUE_ENTITY_TYPE,
  ISSUE_SERVICE_TICKET_TASKS_STATUSES,
} from '../../constants/core';
import { useUpdateRelatedEntities } from '../../hooks/useUpdateRelatedEntities';
import {
  SERVICE_TICKET_TASKS_INITIAL_VALUES,
  SERVICE_TICKET_TASKS_SIDE_FILTER_INITIAL_VALUES,
} from '../ServiceTickets/constants/initialValues';
import { useOptimisticDeleteServiceTicket } from '../ServiceTickets/hooks/useOptimisticDeleteServiceTicket';
import { mapRelatedEntitiesToDto } from '../ServiceTickets/utils/helpers';
import CreateTicketFormModal from './components/CreateTicketForm/CreateTicketFormModal';
import TicketTasksDetailsSidebar from './components/TicketTasksDetailsSidebar/TicketTasksDetailsSidebar';
import TicketTasksFilter from './components/TicketTasksFilter/TicketTasksFilter';
import { SERVICE_TICKET_TASKS_COLUMNS, TICKET_TASKS_COLUMNS } from './utills/formatters';
import { FILTER_KEY, formatter, selectedFiltersMeta } from './utills/helpers';

const TicketTasks = ({ ticket, onResolveParent }) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { ticketId: parentId } = useParams();

  const { currentUser: user } = useGetCurrentUser();

  const serviceTicketTaskQueryKeyRef = useRef(null);

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [paginationCache, setPaginationCache] = useState(null);
  const [selectionRefreshCount, setSelectionRefreshCount] = useState(0);

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [modifiedTask, setModifiedTask] = useState(null);
  const [bulkUpdateType, setBulkUpdateType] = useState('');
  const [selectedTicketsIds, setSelectedTicketsIds] = useState([]);
  const [copyMessage, setCopyMessage] = useState('');

  const { copyToClipboard } = useCopyToClipboard('Copy URL of Service Ticket Task');

  const ticketId = ticket?.id;
  
  const handleOpenSelectedItem = useCallback((item) => setTicketDetails(item), []);

  const serviceTicketTypes = useRecoilValue(getServiceTicketsCategory);
  const serviceTaskCategory = useRecoilValue(getServiceTicketTasksCategory);
  const serviceTaskTypes = useRecoilValue(getServiceTaskTypes);

  const issueCategories = useRecoilValue(issuesCategories);

  const columns = useMemo(() => (ticketId ? TICKET_TASKS_COLUMNS : SERVICE_TICKET_TASKS_COLUMNS), [ticketId]);

  const issuesCategoryIds = useMemo(
    () => issueCategories?.reduce((acc, { id, name }) => ({ ...acc, [name]: id }), {}),
    []
  );

  const pinColumns = useMemo(() => ['displayName'], []);
  const pinRowHoverActionColumns = useMemo(() => ['deleteById'], []);

  const {
    id: idDeletePopover,
    open: openDeletePopover,
    anchorEl: anchorElDeletePopover,
    handleClick: handleClickDeletePopover,
    handleClose: handleCloseDeletePopover,
  } = usePopoverToggle('delete-task-popover');

  const excludedSearchParams = useMemo(
    () => ['returnParameters', 'returnAdditionalField', 'returnRelatedEntities', 'issueCategoryId', 'parentIssueId'],
    []
  );
  const {
    open: isConfirmAllTasksCompletedOpen,
    setOpen: setIsConfirmAllTasksCompletedOpen,
    openId: isisConfirmAllTasksCompletedOpenId,
  } = useModalToggle();

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues, resetFilter } = useFilter({
    formikProps: {
      initialValues: {
        [FILTER_KEY]: SERVICE_TICKET_TASKS_SIDE_FILTER_INITIAL_VALUES,
        ...SERVICE_TICKET_TASKS_INITIAL_VALUES,
        timezone: user?.timezone,
        returnParameters: true,
        returnAdditionalField: true,
        returnRelatedEntities: true,
        issueCategoryId: issuesCategoryIds?.[ISSUE_CATEGORIES.SERVICE_TICKET_TASK],
        ...(ticketId ? { parentIssueId: ticketId } : {}),
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
      handleUrlFiltersMeta(filterValue, selectedFilters);
    },
    formatter,
    selectedFiltersMeta,
  });

  const { updateSearchParams, handleModalOpenUrl, handleUrlFiltersMeta } = useUpdateTableFilterSearchParams({
    excludedSearchParams,
    enableURLSearchParams: true,
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
    queryKey: ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASKS,
    keyRef: serviceTicketTaskQueryKeyRef,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'createdAt',
        desc: true,
      },
    ],
    pageSize: 25,
    enableURLSearchParams: true,
    excludedSearchParams,
    updateSearchParams,
    onModalAction: handleOpenSelectedItem,
  });

  const { fetchData: refetchSidebarData } = useGetIssueById({
    key: ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASK_BY_ID,
    issueId: ticketDetails?.id,
  });

  const { issue: parentIssue, isFetching: isParentIssueFetching } = useGetIssueById({
    key: `${ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASKS}-${ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID}`,
    issueId: parentId,
  });

  const completedTaskCount = parentIssue?.relatedEntities?.reduce(
    (acc, entity) => {
      const isChildIssue = entity.relation === ISSUE_ENTITY_RELATIONS.CHILD && entity.type === ISSUE_ENTITY_TYPE.ISSUE;
      const isCompleted = ![
        ISSUE_SERVICE_TICKET_TASKS_STATUSES.PENDING_ACTION,
        ISSUE_SERVICE_TICKET_TASKS_STATUSES.INCOMPLETE,
      ].includes(entity?.relatedEntity?.status);

      if (isChildIssue) {
        return {
          total: acc.total + 1,
          completed: acc.completed + (isCompleted ? 1 : 0),
        };
      }

      return acc;
    },
    { total: 0, completed: 0 }
  );

  useEffect(() => {
    if (isFetching && !isEqual(pagination, paginationCache)) {
      setPaginationCache(pagination);
      setIsDataLoading(true);
    } else if (isDataLoading && !isFetching) {
      setIsDataLoading(false);
    }
  }, [isFetching, pagination, paginationCache]);

  const handleSearchbar = useCallback((e) => setSearchText(e.target.value), []);

  const toggleModal = useCallback((modal, v) => {
    const stateSelector = {
      create: setIsCreateModalOpen,
      filter: setIsViewFiltersOpen,
      details: (v) => {
        handleModalOpenUrl(v ? { ...v, additionalFields: [], relatedEntities: [] } : null);
        setTicketDetails(v);
      },
      delete: setModifiedTask,
      action: setModifiedTask,
    };

    stateSelector[modal](v);
  }, []);

  const { updateRelatedEntities } = useUpdateRelatedEntities({
    onError: () => toast.error(`Error updating ${ticketDetails.displayName}`),
  });

  const { createServiceTicketTask: saveTask } = useServiceTicketTaskCreate({
    onSuccess: ({ data }) => {
      const payload = [
        {
          type: ISSUE_ENTITY_SEARCH_TYPE.ISSUE,
          entityId: data?.parent,
          relation: ISSUE_ENTITY_RELATIONS.PARENT,
        },
      ];

      updateRelatedEntities({ params: { issueId: data?.id }, body: payload });
      queryClient.invalidateQueries({ queryKey: serviceTicketTaskQueryKeyRef?.current });
    },
  });
  const { updateServiceTicketTask: updateTask } = useOptimisticServiceTicketTaskUpdate({
    queryKey: serviceTicketTaskQueryKeyRef?.current,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASKS}-${ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_BY_ID}`],
      });
    },
  });

  const { createActionPerformedActivity } = useCreateActivity();

  const onRelatedEntityUnlink = (entity, parent) => {
    const parentTicket = ticket || parent;
    const currentEntities = mapRelatedEntitiesToDto(parentTicket.relatedEntities);

    const issueId = parentTicket.id;
    const payload = currentEntities.filter((currEntity) => !entity?.includes(currEntity.id));

    updateRelatedEntities({ params: { issueId }, body: payload });
  };

  const { mutate: removeSingleIssue, isLoading } = useOptimisticDeleteServiceTicket({
    queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASKS],
    onSuccess: ({ variables }) => {
      const parentId = ticketId || ticketDetails?.parent;
      const findParentInRelatedEntities = modifiedTask?.task?.relatedEntities?.find(
        (entity) => entity.relation === ISSUE_ENTITY_RELATIONS.PARENT
      );
      const parent = findParentInRelatedEntities?.relatedEntity;

      onRelatedEntityUnlink(variables, parent);

      toast.success(`${modifiedTask?.task?.displayName} has been deleted successfully!`);

      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_TASKS] });
      queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS, parentId] });

      toggleModal('delete', null);
    },

    isTicketDetailsFullView: true,
  });

  const { removeIssues, isRemoveIssuesLoading } = useDeleteIssues({
    onSuccess: ({ variables }) => {
      queryClient.invalidateQueries({ queryKey: serviceTicketTaskQueryKeyRef?.current });
      toast.success(`${variables.length} Ticket Tasks have been deleted successfully!`);
    },
  });

  const handleTaskSave = useCallback(async (params) => saveTask(params), []);

  const handleRevertTaskAction = useCallback(async (issueTask, issueStatusId) => {
    toggleModal('action', {
      action: { name: 'Revert Action' },
      issueTask,
      issueStatusId,
    });
  }, []);

  const handleConfirmRevertTaskAction = useCallback(async (issueTask, issueStatusId) => {
    await updateIssuesAdditionalFields(
      { issueId: issueTask?.id },
      {
        actionPerformed: null,
      }
    );

    updateTask({
      task: issueTask,
      issueStatusId,
      resolvedBy: null,
    });

    createActionPerformedActivity({
      issueId: issueTask?.id,
      oldValue: issueTask?.resolvedBy,
      newValue: null,
      userId: user.id,
    });

    toggleModal('action', null);
  }, []);

  const handleConfirmDeleteTask = useCallback(async () => {
    removeSingleIssue([modifiedTask?.task?.id]);
    setSelectionRefreshCount((prev) => prev + 1);
    toggleModal('delete', (prev) => ({ ...prev, action: null }));
  }, [modifiedTask]);

  const handleCreateNewTask = async (params, isCreateAnother = false) => {
    try {
      const taskType = serviceTaskTypes.find((type) => type.id === params.issueTypeId);

      if (!taskType) {
        toggleModal('create', false);
        toast.success('Type not found in configuration');
      }

      const defaultStatus =
        taskType.statuses.find((status) => status.name === ISSUE_SERVICE_TICKET_TASKS_STATUSES.INCOMPLETE) ||
        taskType.statuses[0];

      await handleTaskSave({
        ...params,
        issueCategoryId: serviceTaskCategory.id,
        issueStatusId: defaultStatus.id,
        createdBy: ISSUE_ENTITY_TYPE.USER,
      });
      toast.success(`Task "${params.displayName}" has been created!`);
      if (!isCreateAnother) toggleModal('create', false);
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleClearAll = useCallback(() => {
    resetFilter();
    submitFilterValue();
  }, []);

  const handleClearFilterField = (key, value) => {
    const newFilterValue = Array.isArray(sourceFilterValue[FILTER_KEY][key])
      ? sourceFilterValue[FILTER_KEY][key].filter((item) => item.label !== value && item[key] !== value)
      : '';

    setFilterFieldValue(FILTER_KEY, {
      ...sourceFilterValue[FILTER_KEY],
      [key]: newFilterValue,
    });

    submitFilterValue();
  };

  const handleNameClick = useCallback((details) => {
    toggleModal('details', details.original);
  }, []);

  const handleConfirmCompleteTask = useCallback(
    async (row, isLastTaskComplete) => {
      await updateIssuesAdditionalFields({ issueId: row.task.id }, { actionPerformed: row.action.id });

      updateTask({
        task: row.task,
        issueStatusId: row.issueStatusId,
        resolvedBy: ISSUE_ENTITY_SEARCH_TYPE.USER,
      });

      if (isLastTaskComplete) setIsConfirmAllTasksCompletedOpen(true);
      toast.success(`Task "${row.task.displayName}" has been completed!`);
      toggleModal('delete', null);
    },
    [modifiedTask]
  );

  const handleSingleDelete = ({ action, task }) => {
    toggleModal('delete', {
      action: { name: action },
      task,
    });
  };

  const tableBulkActions = useMemo(
    () => [
      {
        text: 'Delete',
        icon: <BulkDeleteIcon />,
        callback: () => {
          selectedTicketsIds.length === 1
            ? handleSingleDelete({
                action: 'Delete',
                task: data?.content?.find((task) => task.id === selectedTicketsIds[0]),
              })
            : setBulkUpdateType(BULK_OPERATION_TYPES.DELETE);
        },
      },
    ],
    [selectedTicketsIds]
  );

  const renderTableActions = useMemo(
    () => [
      <StyledFlex key="create-modal" direction="row" gap="16px" alignItems="center" flex="0 1 auto">
        <StyledButton
          secondary
          variant="contained"
          onClick={() => toggleModal('create', true)}
          startIcon={<CustomTableIcons icon="ADD" width={24} color={colors.white} />}
        >
          Create Ticket Task
        </StyledButton>
      </StyledFlex>,
    ],
    []
  );

  const tableMeta = useMemo(
    () => ({
      updateTask,
      handleCompleteTask: (row) => {
        handleConfirmCompleteTask(row, completedTaskCount.total === completedTaskCount.completed + 1);
      },
      handleNameClick,
      handleSingleDelete,
      handleRevertTaskAction,
      user,
      serviceTaskTypes,
      serviceTicketTypes: serviceTicketTypes?.types,
      key: serviceTicketTaskQueryKeyRef?.current,
    }),
    [serviceTicketTaskQueryKeyRef?.current]
  );

  return (
    <>
      <TableV2
        data={data}
        columns={columns}
        searchPlaceholder="Search Ticket Task Name or ID..."
        onSearch={handleSearchbar}
        initialSearchText={searchText}
        onShowFilters={() => toggleModal('filter', true)}
        selectedFilters={selectedFiltersBar}
        onClearAllFilters={handleClearAll}
        onClearFilter={handleClearFilterField}
        isLoading={isDataLoading}
        sorting={sorting}
        setSorting={setSorting}
        onSelectionChange={setSelectedTicketsIds}
        selectBarActions={tableBulkActions}
        pagination={pagination}
        setPagination={setPagination}
        emptyTableDescription="There are currently no ticket tasks"
        pinSelectColumn
        meta={tableMeta}
        headerActions={renderTableActions}
        entityName="Ticket Tasks"
        enableEditing
        selectionRefreshTrigger={selectionRefreshCount}
        pinColumns={pinColumns}
        pinRowHoverActionColumns={pinRowHoverActionColumns}
        enablePageSizeChange
        onTableRefresh={() => {
          setIsDataLoading(true);
          refetch();
        }}
      />

      <CustomSidebar open={isViewFiltersOpen} onClose={() => toggleModal('filter', false)} headStyleType="filter">
        {({ customActionsRef }) => (
          <TicketTasksFilter
            sidebarActionsRef={customActionsRef}
            parentId={
              ticketId
                ? null
                : data?.content?.reduce((acc, task) => (task.parent ? [...new Set([...acc, task.parent])] : acc), [])
            }
            initialValues={sourceFilterValue[FILTER_KEY]}
            onApplyFilters={(filterValues) => {
              setFilterFieldValue(FILTER_KEY, filterValues);
              submitFilterValue();
              toggleModal('filter', false);
            }}
          />
        )}
      </CustomSidebar>

      {/* Details sidebar */}
      {!!ticketDetails && (
        <CustomSidebar
          width={780}
          open={!!ticketDetails}
          onClose={() => {
            toggleModal('details', null);
          }}
          headerTemplate={
            <StyledFlex gap="10px">
              <StyledFlex direction="row" alignItems="center" gap="15px">
                <StyledFlex>
                  <StyledText size={16} weight={500} lh={20}>
                    #{ticketDetails?.id}
                  </StyledText>
                </StyledFlex>
                <StyledFlex alignItems="center">
                  <StyledDivider borderWidth={2} color={colors.jetStreamGray} orientation="vertical" height="17px" />
                </StyledFlex>
                <StyledText weight={500} lh={20}>
                  {ticketDetails?.displayName}
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
              <StyledTooltip title={copyMessage} arrow placement="top" p="10px 15px" maxWidth="auto">
                <StyledFlex
                  as="span"
                  width="38px"
                  height="38px"
                  padding="8px 8px 8px 10px"
                  cursor="pointer"
                  borderRadius="7px"
                  backgroundColor={colors.darkGrayHoverFilterIcon}
                  onClick={() => {
                    copyToClipboard(`${window.location}/${ticketDetails?.id}`);
                    setCopyMessage('Copied!');
                  }}
                  onMouseLeave={() => setCopyMessage('Copy URL of Service Ticket Task')}
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
                  onClick={(e) => {
                    handleCloseDeletePopover(e);
                    handleSingleDelete({
                      action: 'Delete',
                      task: ticketDetails,
                    });
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
            <TicketTasksDetailsSidebar
              taskId={ticketDetails?.id}
              ticketDetails={ticketDetails}
              queryKey={serviceTicketTaskQueryKeyRef?.current}
              onDisplayNameChange={(updatedName) =>
                toggleModal('details', (prev) => ({ ...prev, displayName: updatedName }))
              }
              onDescriptionChange={(updatedDescription) =>
                toggleModal('details', (prev) => ({ ...prev, description: updatedDescription }))
              }
            />
          )}
        </CustomSidebar>
      )}

      {/* Create modal */}
      <CreateTicketFormModal
        open={isCreateModalOpen}
        onClose={() => toggleModal('create', false)}
        onSubmit={handleCreateNewTask}
      />

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={!!modifiedTask?.action && modifiedTask?.action?.name !== 'Revert Action'}
        isLoading={isLoading}
        onCloseModal={() => {
          toggleModal('delete', null);
        }}
        onSuccessClick={() => handleConfirmDeleteTask()}
        successBtnText={modifiedTask?.action?.name}
        alertType="WARNING"
        title="Are You Sure?"
        text={`You are about to delete ${modifiedTask?.task?.displayName}. By deleting this ticket task, it will permanently remove all associated data and cannot be undone`}
      />

      <ConfirmationModal
        isOpen={bulkUpdateType === BULK_OPERATION_TYPES.DELETE && selectedTicketsIds.length > 1}
        isLoading={isRemoveIssuesLoading}
        onCloseModal={() => setBulkUpdateType('')}
        onSuccessClick={() => {
          removeIssues(selectedTicketsIds);

          setBulkUpdateType('');
          setSelectionRefreshCount((prev) => prev + 1);
        }}
        successBtnText={modifiedTask?.action?.name}
        alertType="WARNING"
        title="Are You Sure?"
        text={`You are about to delete ${selectedTicketsIds.length} ticket tasks. By deleting these ticket tasks, it will permanently remove all associated data and cannot be undone`}
      />

      <ConfirmationModal
        isOpen={modifiedTask?.action?.name === 'Revert Action'}
        isLoading={isRemoveIssuesLoading}
        onCloseModal={() => toggleModal('action', null)}
        onSuccessClick={() => handleConfirmRevertTaskAction(modifiedTask?.issueTask, modifiedTask?.issueStatusId)}
        successBtnText={modifiedTask?.action?.name}
        alertType="WARNING"
        title="Are You Sure?"
        text={`You are about to revert ${modifiedTask?.issueTask?.displayName} to "${ISSUE_SERVICE_TICKET_TASKS_STATUSES.PENDING_ACTION}". `}
      />

      <ConfirmationModal
        key={isisConfirmAllTasksCompletedOpenId}
        isOpen={isConfirmAllTasksCompletedOpen}
        isLoading={isParentIssueFetching}
        onCloseModal={() => setIsConfirmAllTasksCompletedOpen(false)}
        onSuccessClick={() => {
          onResolveParent?.();
          setIsConfirmAllTasksCompletedOpen(false);
        }}
        successBtnText="Close Service Ticket"
        alertType="INFO"
        modalIcon="CHECK_CIRCLE"
        title="All Ticket Tasks Are Now Completed"
        text="Do you want to close the Service Ticket now?"
      />
    </>
  );
};

export default TicketTasks;
