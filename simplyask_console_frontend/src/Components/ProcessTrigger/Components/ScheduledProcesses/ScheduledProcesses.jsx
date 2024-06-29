import { useTheme } from '@emotion/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import BulkDeleteIcon from '../../../../Assets/icons/issues/bulkOperations/delete.svg?component';
import { useFilter } from '../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { getProcessExecutions } from '../../../../Services/axios/processHistory';
import BulkDeleteModal from '../../../Issues/components/ServiceTickets/components/BulkDeleteModal/BulkDeleteModal';
import { BULK_OPERATION_TYPES } from '../../../Issues/constants/bulkOperations';
import { PROCESS_EXECUTION_QUERY_KEYS } from '../../../Issues/constants/core';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex } from '../../../shared/styles/styled';
import { useUpdateProcesses } from '../../hooks/useDeleteProcessIds';
import { useGetAllProcessExecutions } from '../../hooks/useGetAllProcessExectutions';
import { SCHEDULED_TABLE_FILTER_KEY } from '../../utils/constants';
import {
  SCHEDULED_PROCESSES_COLUMNS,
  scheduledProcessesFiltersMeta,
  scheduledProcessesSearchFormatter,
} from '../../utils/formatters';
import { SCHEDULED_PROCESSES_SIDE_FILTER_INITIAL_VALUES } from '../../utils/initialValueHelpers';

import { useUpdateTableFilterSearchParams } from '../../../../hooks/useTableFilterSearchParams';
import ScheduledProcessEditorModal from './ScheduledProcessEditorModal/ScheduledProcessEditorModal';
import ScheduledProcessesFilters from './ScheduledProcessesFilters/ScheduledProcessesFilters';

const ScheduledProcesses = ({ onScheduleClick }) => {
  const { currentUser } = useGetCurrentUser();
  const { colors } = useTheme();

  const [bulkUpdateType, setBulkUpdateType] = useState('');
  const [selectedProcessIds, setSelectedProcessIds] = useState([]);
  const [selectionRefreshCount, setSelectionRefreshCount] = useState(0);

  const { processExecutionsData: executionNameOptions, isProcessExecutionsDataLoading: isExecutionNameOptionsLoading } =
    useGetAllProcessExecutions({
      select: (res) =>
        res?.content
          ?.filter((item) => {
            const parsedData = Object.values(item.parsedData)?.map((row) => row);
            return parsedData?.length > 1 && item.executionName;
          })
          .map((item) => ({ label: item.executionName, value: item.executionName })),
    });

  const [openProcessEditorFullModal, setOpenProcessEditorFullModal] = useState({ isOpen: false, data: null });
  const [isProcessesFilterOpen, setIsProcessesFilterOpen] = useState(false);

  const handleOpenSelectedItem = useCallback((item) => setOpenProcessEditorFullModal({ isOpen: true, data: item }), []);

  const excludedSearchParams = ['isScheduled', 'pageSize'];

  const { updateSearchParams, handleModalOpenUrl, handleUrlFiltersMeta } = useUpdateTableFilterSearchParams({
    excludedSearchParams,
    enableURLSearchParams: true,
  });

  const { sourceFilterValue, initialFilterValues, setFilterFieldValue, submitFilterValue } = useFilter({
    formikProps: {
      initialValues: {
        [SCHEDULED_TABLE_FILTER_KEY]: SCHEDULED_PROCESSES_SIDE_FILTER_INITIAL_VALUES,
        timezone: currentUser?.timezone,
        isScheduled: true,
      },
    },
    onSubmit: ({ filterValue = {}, selectedFilters = {} }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
      handleUrlFiltersMeta(filterValue, selectedFilters);
    },
    formatter: scheduledProcessesSearchFormatter,
    selectedFiltersMeta: scheduledProcessesFiltersMeta,
  });

  const {
    data,
    sorting,
    selectedFiltersBar,
    pagination,
    isFetching,
    setColumnFilters,
    setSelectedFiltersBar,
    searchText,
    setSearchText,
    setSorting,
    setPagination,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getProcessExecutions,
    queryKey: PROCESS_EXECUTION_QUERY_KEYS.GET_PROCESS_EXECUTIONS_FILES_QUERY_KEY,
    initialFilters: initialFilterValues,
    pageIndex: 0,
    pageSize: 25,
    initialSearchText: '',
    initialSorting: [
      {
        id: 'nextExecutionAt',
        desc: true,
      },
    ],
    updateSearchParams,
    enableURLSearchParams: true,
    excludedSearchParams,
    onModalAction: handleOpenSelectedItem,
  });

  const handleClearAll = () => {
    setFilterFieldValue(SCHEDULED_TABLE_FILTER_KEY, SCHEDULED_PROCESSES_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(SCHEDULED_TABLE_FILTER_KEY, {
      ...sourceFilterValue[SCHEDULED_TABLE_FILTER_KEY],
      [key]: SCHEDULED_PROCESSES_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const onTableRowClick = (row) => {
    setOpenProcessEditorFullModal({ isOpen: true, data: row });
    handleModalOpenUrl(row);
  };

  const tableMeta = {
    currentUser,
    onTableRowClick,
    colors,
  };

  const onApplyFilters = (sideFilter) => {
    setIsProcessesFilterOpen(false);
    setFilterFieldValue(SCHEDULED_TABLE_FILTER_KEY, sideFilter);
    submitFilterValue();
  };

  const renderTableActions = () => (
    <StyledFlex direction="row" gap="15px">
      <StyledButton variant="contained" secondary onClick={onScheduleClick}>
        Schedule New Execution
      </StyledButton>
    </StyledFlex>
  );

  const tableBulkActions = [
    {
      text: 'Delete',
      icon: <BulkDeleteIcon />,
      callback: () => {
        setBulkUpdateType(BULK_OPERATION_TYPES.DELETE);
      },
    },
  ];

  const { removeProcesses } = useUpdateProcesses({
    onSuccess: ({ variables }) => {
      const { length } = variables;
      toast.success(`Deleted ${length} Process Execution${length > 1 ? 's' : ''}`);
    },
  });

  return (
    <StyledFlex flex={1}>
      <TableV2
        searchPlaceholder="Search Process Name..."
        data={data}
        columns={SCHEDULED_PROCESSES_COLUMNS}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        initialSearchText={searchText}
        onSearch={(e) => setSearchText(e.target.value)}
        selectedFilters={selectedFiltersBar}
        onSelectionChange={setSelectedProcessIds}
        selectBarActions={tableBulkActions}
        selectionRefreshTrigger={selectionRefreshCount}
        entityName="Scheduled Executions"
        headerActions={renderTableActions()}
        meta={tableMeta}
        isLoading={isFetching}
        onClearAllFilters={handleClearAll}
        onClearFilter={handleClearFilterField}
        onShowFilters={() => setIsProcessesFilterOpen(true)}
        onTableRefresh={refetch}
      />

      <CustomSidebar
        open={isProcessesFilterOpen}
        onClose={() => setIsProcessesFilterOpen(false)}
        headStyleType="filter"
      >
        {({ customActionsRef }) => (
          <StyledFlex>
            {isProcessesFilterOpen && (
              <ScheduledProcessesFilters
                initialValues={sourceFilterValue[SCHEDULED_TABLE_FILTER_KEY]}
                onApplyFilters={onApplyFilters}
                customActionsRef={customActionsRef}
                executionNameOptions={executionNameOptions}
                isLoading={isExecutionNameOptionsLoading}
              />
            )}
          </StyledFlex>
        )}
      </CustomSidebar>

      {openProcessEditorFullModal?.isOpen && (
        <ScheduledProcessEditorModal
          openProcessEditorFullModal={openProcessEditorFullModal}
          onClose={() => {
            setOpenProcessEditorFullModal({ isOpen: false });
            handleModalOpenUrl(null);
          }}
        />
      )}
      <BulkDeleteModal
        open={bulkUpdateType === BULK_OPERATION_TYPES.DELETE}
        selectedTickets={selectedProcessIds}
        onClose={() => setBulkUpdateType('')}
        onDelete={() => {
          removeProcesses(selectedProcessIds);
          setBulkUpdateType('');
          setSelectionRefreshCount((prev) => prev + 1);
        }}
        tableType="Process Executions"
      />
    </StyledFlex>
  );
};

export default ScheduledProcesses;
