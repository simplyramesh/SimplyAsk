import { useTheme } from '@emotion/react';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getFilteredProcesses } from '../../../../Services/axios/processManager';
import { useFilter } from '../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { usePopoverToggle } from '../../../../hooks/usePopoverToggle';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { useGetAllProcessTriggers } from '../../../ProcessTrigger/hooks/useGetAllProcessTriggers';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import { useModalToggle } from '../../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex, StyledPopover } from '../../../shared/styles/styled';
import ProcessHistoryModalView from '../../ProcessHistoryModalView/ProcessHistoryModalView';
import {
  PROCESS_EXECUTIONS_INITIAL_VALUES,
  PROCESS_EXECUTIONS_SIDE_FILTER_INITIAL_VALUES,
  PROCESS_EXECUTION_FILTERS,
  PROCESS_HISTORY_FILTER_KEY,
  PROCESS_STATUSES,
} from '../../constants/core';
import { useCancelExecutions } from '../../hooks/useCancelExecutions';
import { PROCESS_HISTORY_INDIVIDUAL_COLUMNS } from '../../utils/formatters';
import {
  individualProcessExecutionsFormatter,
  selectedIndividualProcessExecutionFiltersMeta,
} from '../../utils/helpers';
import ConfirmCancelExecutionsModal from '../ConfirmCancelExecutionsModal/ConfirmCancelExecutionsModal';

import { useUpdateTableFilterSearchParams } from '../../../../hooks/useTableFilterSearchParams';
import ExportProcessHistoryReport from './ExportProcessHistoryReport/ExportProcessHistoryReport';
import IndividualExecutionsFilters from './IndividualExecutionsFilters/IndividualExecutionsFilters';

const INDIVIDUAL_EXECUTIONS_QUERY_KEY = 'INDIVIDUAL_EXECUTIONS_QUERY_KEY';

const IndividualExecutions = () => {
  const processIndividualExecutionsQueryKeyRef = useRef(null);

  const { processTriggers: processesTriggerOptions, isProcessTriggersLoading } = useGetAllProcessTriggers({
    select: (res) =>
      res?.map((item) => ({
        value: item.workflowId,
        label: item.name,
        deploymentId: item.deploymentId,
      })),
  });

  const { colors } = useTheme();
  const { currentUser } = useGetCurrentUser();

  const {
    open: isConfirmCancelOpen,
    setOpen: setIsConfirmCancelOpen,
    openId: isConfirmCancelOpenId,
  } = useModalToggle();

  const {
    id: idMoreActionsPopover,
    open: openMoreActionsPopover,
    anchorEl: anchorElMoreActionsPopover,
    handleClick: handleClickMoreActionsPopover,
    handleClose: handleCloseMoreActionsPopover,
  } = usePopoverToggle('export-actions');

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [individualDetails, setIndividualDetails] = useState(null);
  const [selectedProcessesIds, setSelectedProcessesIds] = useState([]);
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [selectionRefreshCount, setSelectionRefreshCount] = useState(0);
  const [cancellingProcess, setCancellingProcess] = useState(null);

  const handleOpenSelectedItem = useCallback((item) => setIndividualDetails(item), []);

  const selectedInProgressProcessesIds = useMemo(
    () =>
      selectedProcesses
        .filter(({ status }) => status === PROCESS_STATUSES.EXECUTING || status === PROCESS_STATUSES.PREPARING)
        .map(({ procInstanceId }) => procInstanceId),
    [selectedProcesses]
  );

  const cancelModalDataProps = useMemo(
    () =>
      cancellingProcess
        ? {
            executions: [cancellingProcess],
            isBulkCancel: false,
            inProgressCount: 1,
          }
        : {
            executions: selectedProcesses,
            isBulkCancel: true,
            inProgressCount: selectedInProgressProcessesIds.length,
          },
    [cancellingProcess, selectedInProgressProcessesIds]
  );

  const toggleSidebar = useCallback((sidebar = 'filters', value = false) => {
    const stateSelector = {
      filters: setIsViewFiltersOpen,
      details: setIndividualDetails,
      confirmCancel: setIsConfirmCancelOpen,
    };

    stateSelector[sidebar](value);
  }, []);

  const { handleCancelExecutions, handleRefresh, isCancelExecutionsFetching } = useCancelExecutions({
    processIds: cancellingProcess ? [cancellingProcess.procInstanceId] : selectedInProgressProcessesIds,
    invalidateKeys: INDIVIDUAL_EXECUTIONS_QUERY_KEY,
    onSuccess: () => {
      toggleSidebar('confirmCancel', false);
      setCancellingProcess(null);
      setSelectionRefreshCount((prev) => prev + 1);

      if (cancellingProcess) {
        toast.success(`${cancellingProcess.projectName} - ${cancellingProcess.procInstanceId} Has Been Canceled`);
      } else if (selectedInProgressProcessesIds) {
        const cancelCount = selectedInProgressProcessesIds.length;

        toast.success(`${cancelCount} ${cancelCount === 1 ? 'Process' : 'Processes'} Has Been Canceled`);
      }

      handleRefresh();
    },
  });

  const { updateSearchParams, handleModalOpenUrl, handleUrlFiltersMeta } = useUpdateTableFilterSearchParams({
    enableURLSearchParams: true,
  });

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: {
        [PROCESS_HISTORY_FILTER_KEY]: PROCESS_EXECUTIONS_SIDE_FILTER_INITIAL_VALUES,
        ...PROCESS_EXECUTIONS_INITIAL_VALUES,
        timezone: currentUser?.timezone,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
      handleUrlFiltersMeta(filterValue, selectedFilters);
    },
    formatter: individualProcessExecutionsFormatter,
    selectedFiltersMeta: selectedIndividualProcessExecutionFiltersMeta,
  });

  const {
    pagination,
    setColumnFilters,
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
    queryFn: getFilteredProcesses,
    queryKey: INDIVIDUAL_EXECUTIONS_QUERY_KEY,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'startTime',
        desc: true,
      },
    ],
    keyRef: processIndividualExecutionsQueryKeyRef,
    updateSearchParams,
    enableURLSearchParams: true,
    onModalAction: handleOpenSelectedItem,
  });

  const handleSearchBar = useCallback((e) => setSearchText(e.target.value), []);
  const handleOpenFilters = useCallback(() => toggleSidebar('filters', true), []);
  const handleOpenDetails = useCallback((row) => {
    toggleSidebar('details', row);
    handleModalOpenUrl(row);
  }, []);
  const handleRowSelectionChange = useCallback((rows) => setSelectedProcessesIds(rows), []);

  useEffect(() => {
    setSelectedProcesses(selectedProcessesIds.map((id) => data?.content?.find((item) => item.procInstanceId === id)));
  }, [selectedProcessesIds]);

  const handleClearAll = useCallback(() => {
    setFilterFieldValue(PROCESS_HISTORY_FILTER_KEY, PROCESS_EXECUTIONS_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  }, []);

  const handleClearFilterField = useCallback(
    (key, value) => {
      const defaultValue = PROCESS_EXECUTIONS_SIDE_FILTER_INITIAL_VALUES[key];
      const valueToClear = sourceFilterValue[PROCESS_HISTORY_FILTER_KEY][key];
      const isMultipleValue = valueToClear && Array.isArray(valueToClear) && valueToClear.length > 1;

      const updatedValue = {
        ...sourceFilterValue[PROCESS_HISTORY_FILTER_KEY],
        [key]: isMultipleValue ? valueToClear.filter(({ label }) => label !== value) : defaultValue,
      };

      setFilterFieldValue(PROCESS_HISTORY_FILTER_KEY, updatedValue);
      submitFilterValue();
    },
    [sourceFilterValue]
  );

  const handleApplyFilters = useCallback((sideFilter) => {
    toggleSidebar('filters', false);
    setFilterFieldValue(PROCESS_HISTORY_FILTER_KEY, sideFilter);
    submitFilterValue();
  }, []);

  const renderTableHeaderActions = () => (
    <StyledFlex direction="row" alignItems="center" justifyContent="flex-end" flex="0 1 auto">
      <StyledButton
        variant="contained"
        tertiary
        onClick={handleClickMoreActionsPopover}
        endIcon={<ArrowDropDownRoundedIcon />}
        sx={{
          maxHeight: '38px',
          '& .MuiButton-endIcon > *:nth-of-type(1)': { fontSize: '32px' },
        }}
        disableRipple
      >
        Export Report
      </StyledButton>
      <StyledPopover
        id={idMoreActionsPopover}
        open={openMoreActionsPopover}
        anchorEl={anchorElMoreActionsPopover}
        onClose={handleCloseMoreActionsPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            marginTop: '12px',
          },
        }}
        keepMounted
        disableScrollLock
      >
        <StyledFlex width="409px">
          {openMoreActionsPopover ? (
            <StyledFlex p="20px">
              <ExportProcessHistoryReport
                onClose={handleCloseMoreActionsPopover}
                processesTriggerOptions={processesTriggerOptions}
                isProcessTriggersLoading={isProcessTriggersLoading}
              />
            </StyledFlex>
          ) : null}
        </StyledFlex>
      </StyledPopover>
    </StyledFlex>
  );

  const tableBulkActions = useMemo(
    () => [
      {
        text: 'Cancel Execution',
        icon: <CloseRoundedIcon />,
        callback: () => {
          toggleSidebar('confirmCancel', true);
        },
      },
    ],
    []
  );

  const handleRowCancelExecution = useCallback((processId) => {
    setCancellingProcess(processId);
    toggleSidebar('confirmCancel', true);
  }, []);

  const tableMeta = useMemo(
    () => ({
      timezone: currentUser?.timezone,
      colors,
      onRowClick: handleOpenDetails,
      onCancelExecution: handleRowCancelExecution,
    }),
    []
  );

  const handleGetRowId = useCallback((row) => row.procInstanceId, []);

  const pinnedColumns = useMemo(() => [PROCESS_EXECUTION_FILTERS.PROCESS_NAME], []);
  const pinnedRowHoverActionColumns = useMemo(() => ['cancelExecutionById'], []);

  return (
    <>
      <StyledFlex sx={{ '& .headerActionsContainer': { flex: 'auto', marginLeft: '12px' }, height: '100%' }}>
        <TableV2
          emptyTableTitle="Individual Executions"
          emptyTableDescription="There are no Individual Executions"
          entityName="Process Executions"
          searchPlaceholder="Search Process Names and IDs..."
          columns={PROCESS_HISTORY_INDIVIDUAL_COLUMNS}
          data={data}
          onSearch={handleSearchBar}
          onShowFilters={handleOpenFilters}
          selectedFilters={selectedFiltersBar}
          sorting={sorting}
          setSorting={setSorting}
          setPagination={setPagination}
          pagination={pagination}
          isLoading={isFetching}
          headerActions={renderTableHeaderActions()}
          enableRowSelection
          enableShowFiltersButton
          meta={tableMeta}
          onClearAllFilters={handleClearAll}
          onClearFilter={handleClearFilterField}
          onSelectionChange={handleRowSelectionChange}
          selectionRefreshTrigger={selectionRefreshCount}
          selectBarActions={selectedInProgressProcessesIds.length ? tableBulkActions : []}
          pinSelectColumn
          pinColumns={pinnedColumns}
          pinRowHoverActionColumns={pinnedRowHoverActionColumns}
          enablePageSizeChange
          getRowId={handleGetRowId}
          onTableRefresh={refetch}
        />
      </StyledFlex>
      {individualDetails ? (
        <ProcessHistoryModalView
          processExecutionSideModalData={individualDetails}
          data={data}
          closeModal={() => {
            toggleSidebar('details', null);
            handleModalOpenUrl(null);
          }}
          open={!!individualDetails}
          tableQueryKey={processIndividualExecutionsQueryKeyRef.current}
        />
      ) : null}
      <CustomSidebar open={isViewFiltersOpen} onClose={() => toggleSidebar('filters', false)} headStyleType="filter">
        {({ customActionsRef }) => (
          <IndividualExecutionsFilters
            currentProcesses={data?.content || []}
            initialValues={sourceFilterValue[PROCESS_HISTORY_FILTER_KEY]}
            onApplyFilters={handleApplyFilters}
            sidebarActionsRef={customActionsRef}
          />
        )}
      </CustomSidebar>
      <ConfirmCancelExecutionsModal
        key={isConfirmCancelOpenId}
        isOpen={isConfirmCancelOpen}
        onClose={() => {
          setCancellingProcess(null);
          setIsConfirmCancelOpen(false);
        }}
        onConfirm={handleCancelExecutions}
        title="Are You Sure?"
        alertType="WARNING"
        isLoading={isCancelExecutionsFetching}
        {...cancelModalDataProps}
      />
    </>
  );
};

export default IndividualExecutions;
