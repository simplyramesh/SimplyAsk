import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useUser } from '../../../contexts/UserContext';
import { useFilter } from '../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../hooks/useTableSortAndFilter';
import { getTestHistory } from '../../../Services/axios/test';
import {
  ACTIVE_STATUSES,
  DONE_STATUSES,
  TEST_ENTITY_TYPE,
  TEST_MANAGER_LABELS,
  TEST_MANAGER_MODAL_TYPE,
} from '../../Managers/TestManager/constants/constants';
import { usePerformTestAction } from '../../Managers/TestManager/hooks/usePerformTestAction';
import TestCancelModal from '../../Managers/TestManager/modals/TestCancelModal';
import TestDeleteModal from '../../Managers/TestManager/modals/TestDeleteModal';
import TestExecuteModal from '../../Managers/TestManager/modals/TestExecuteModal';
import {
  TEST_HISTORY_FILTERS,
  TEST_HISTORY_FILTERS_INITIAL_VALUES,
  TEST_HISTORY_FILTERS_KEY,
  TEST_HISTORY_SIDE_FILTER_INITIAL_VALUES,
} from '../../Managers/TestManager/utils/constants';
import { getPayloadPropKeyByTestExecutionType } from '../../Managers/TestManager/utils/helpers';
import ContentLayout from '../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { useModalToggle } from '../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import TableV2 from '../../shared/REDISIGNED/table-v2/Table-v2';
import { selectedTestHistoryFiltersMeta, TEST_HISTORY_COLUMNS_SCHEMA, testHistoryFormatter } from '../utils/formatters';

import { useUpdateTableFilterSearchParams } from '../../../hooks/useTableFilterSearchParams';
import TestCaseSideBar from './SideBars/TestCaseSideBar';
import TestGroupSideBar from './SideBars/TestGroupSideBar';
import TestSuiteSideBar from './SideBars/TestSuiteSideBar';
import TestHistoryFilters from './SideModalFilters/TestHistoryFilter';

export const TEST_HISTORY_QUERY_KEY = 'GET_TEST_HISTORY_QUERY';

const TestHistory = () => {
  const { user } = useUser();
  const theme = useTheme();
  const location = useLocation();

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionRefreshCount, setSelectionRefreshCount] = useState(0);
  const [openModal, setOpenModal] = useState();
  const [actionRows, setActionRows] = useState();
  const [testEntityIdState, setTestEntityIdState] = useState();

  const { open: isTestHistoryFiltersOpen, setOpen: setIsTestHistoryFilterOpen } = useModalToggle();

  const { performDelete, performStop, performReexecute, isActionPeforming } = usePerformTestAction({
    onSuccess: () => setSelectionRefreshCount((count) => count + 1),
    invalidateQueries: [TEST_HISTORY_QUERY_KEY],
  });

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: { ...TEST_HISTORY_FILTERS_INITIAL_VALUES },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      if (testEntityIdState) {
        setSelectedFiltersBar({
          ...selectedFilters,
          testEntityId: { label: 'ID', value: testEntityIdState, k: 'testEntityId' },
        });
        handleUrlFiltersMeta(filterValue, {
          ...selectedFilters,
          testEntityId: { label: 'ID', value: testEntityIdState, k: 'testEntityId' },
        });
      } else {
        const { testEntityId, ...remainingFilters } = selectedFilters;
        setSelectedFiltersBar(remainingFilters);
        handleUrlFiltersMeta(filterValue, remainingFilters);
      }
      setColumnFilters(filterValue);
    },
    formatter: testHistoryFormatter,
    selectedFiltersMeta: selectedTestHistoryFiltersMeta,
  });

  const [testCaseSideBar, setTestCaseSideBar] = useState(null);
  const [testSuiteSideBar, setTestSuiteSideBar] = useState(null);
  const [testGroupSideBar, setTestGroupSideBar] = useState(null);

  const [testHistoryClickedTableRow, setTestHistoryClickedTableRow] = useState({
    testCase: null,
    testSuite: null,
    testGroup: null,
  });

  const toggleSidebar = (sidebar = 'filters', value = false) => {
    const stateSelector = {
      testCase: setTestCaseSideBar,
      testSuite: setTestSuiteSideBar,
      testGroup: setTestGroupSideBar,
    };

    stateSelector[sidebar](value);
  };

  const handleClearAllFilters = () => {
    if (testEntityIdState) {
      setSearchText('');
      setTestEntityIdState(null);
    }
    setFilterFieldValue(TEST_HISTORY_FILTERS_KEY, TEST_HISTORY_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    if (testEntityIdState && key === 'testEntityId') {
      setSearchText('');
      setTestEntityIdState(null);
    }
    setFilterFieldValue(TEST_HISTORY_FILTERS_KEY, {
      ...sourceFilterValue[TEST_HISTORY_FILTERS_KEY],
      [key]: TEST_HISTORY_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const onRowSelectionChange = (rows) => {
    const selectedRows = data?.content?.filter((row) => rows.includes(row.id)) || [];

    setSelectedRows(selectedRows);
  };

  const isAllSelectedDone = selectedRows?.every((row) => DONE_STATUSES.includes(row.status));
  const isAllSelectedExecuting = selectedRows?.every((row) => ACTIVE_STATUSES.includes(row.status));

  const tableBulkActions = [
    {
      text: 'Delete',
      icon: <DeleteOutlineOutlinedIcon />,
      callback: () => {
        setActionRows(selectedRows);
        setOpenModal(TEST_MANAGER_MODAL_TYPE.DELETE);
      },
    },
    ...(isAllSelectedExecuting
      ? [
          {
            text: 'Cancel Execution',
            icon: <CloseIcon />,
            callback: () => {
              setActionRows(selectedRows);
              setOpenModal(TEST_MANAGER_MODAL_TYPE.CANCEL);
            },
          },
        ]
      : []),
    ...(isAllSelectedDone
      ? [
          {
            text: 'Re-Execute',
            icon: <CachedIcon />,
            callback: () => {
              setActionRows(selectedRows);
              setOpenModal(TEST_MANAGER_MODAL_TYPE.EXECUTE);
            },
          },
        ]
      : []),
  ];

  const getActionPayloadFromRows = (rows) =>
    rows?.reduce(
      (acc, row) => {
        const { type, id } = row;
        const propKey = getPayloadPropKeyByTestExecutionType(type);

        return { ...acc, [propKey]: [...acc[propKey], id] };
      },
      {
        testCaseExecutionId: [],
        testSuiteExecutionId: [],
        testGroupExecutionId: [],
      }
    );

  const performAction = (rows, callback, queryParams) => {
    const payload = getActionPayloadFromRows(rows);

    callback(payload, queryParams);
  };

  const onTestDelete = (rows) => performAction(rows, performDelete);
  const onTestCancel = (rows, queryParams) => performAction(rows, performStop, queryParams);
  const onTestReExecute = (rows, queryParams) => performAction(rows, performReexecute, queryParams);

  const onRowDelete = (row) => {
    setActionRows([row]);
    setOpenModal(TEST_MANAGER_MODAL_TYPE.DELETE);
  };

  const onRowCancel = (row) => {
    setActionRows([row]);
    setOpenModal(TEST_MANAGER_MODAL_TYPE.CANCEL);
  };

  const onRowReexecute = (row) => {
    setActionRows([row]);
    setOpenModal(TEST_MANAGER_MODAL_TYPE.EXECUTE);
  };

  const { updateSearchParams, handleUrlFiltersMeta, searchParams } = useUpdateTableFilterSearchParams({
    enableURLSearchParams: true,
  });

  const {
    setColumnFilters,
    searchText,
    setSearchText,
    data,
    pagination,
    setPagination,
    sorting,
    setSorting,
    isFetching,
    selectedFiltersBar,
    setSelectedFiltersBar,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getTestHistory,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        desc: true,
        id: TEST_HISTORY_FILTERS.START_TIME,
      },
    ],
    queryKey: TEST_HISTORY_QUERY_KEY,
    enableURLSearchParams: true,
    updateSearchParams,
  });

  useEffect(() => {
    const { state } = location;
    const testEntityId = state && state.testEntityId;

    if (testEntityId) {
      setTestEntityIdState(testEntityId);
      setSearchText(testEntityId || '');
      setSelectedFiltersBar({ testEntityId: { label: 'ID', value: testEntityId, k: 'testEntityId' } });
    }
    const hasTestGroup = searchParams.has(TEST_MANAGER_LABELS.TEST_GROUP_QUERY_KEY);
    const hasTestCase = searchParams.has(TEST_MANAGER_LABELS.TEST_CASE_QUERY_KEY);
    const hasTestSuite = searchParams.has(TEST_MANAGER_LABELS.TEST_SUITE_QUERY_KEY);

    if (hasTestGroup) {
      setTestGroupSideBar(true);
    } else if (hasTestCase) {
      setTestCaseSideBar(true);
    } else if (hasTestSuite) {
      setTestSuiteSideBar(true);
    }
  }, [location]);

  const handleTableRowClick = (row) => {
    if (isFetching) return;
    const baseUrl = `${window.location.origin}${location.pathname}${location.search}`;
    const newUrl = new URL(baseUrl);

    if (row.type === TEST_ENTITY_TYPE.CASE) {
      toggleSidebar(TEST_MANAGER_LABELS.TEST_CASE_QUERY_KEY, true);
      setTestHistoryClickedTableRow({ testCase: row, testSuite: null, testGroup: null });
      newUrl.searchParams.set(TEST_MANAGER_LABELS.TEST_CASE_QUERY_KEY, row.id);
    } else if (row.type === TEST_ENTITY_TYPE.SUITE) {
      toggleSidebar(TEST_MANAGER_LABELS.TEST_SUITE_QUERY_KEY, true);
      setTestHistoryClickedTableRow({ testCase: null, testSuite: row, testGroup: null });
      newUrl.searchParams.set(TEST_MANAGER_LABELS.TEST_SUITE_QUERY_KEY, row.id);
    } else if (row.type === TEST_ENTITY_TYPE.GROUP) {
      toggleSidebar(TEST_MANAGER_LABELS.TEST_GROUP_QUERY_KEY, true);
      setTestHistoryClickedTableRow({ testCase: null, testSuite: null, testGroup: row });
      newUrl.searchParams.set(TEST_MANAGER_LABELS.TEST_GROUP_QUERY_KEY, row.id);
      newUrl.searchParams.set('testId', row.testId);
    }

    window.history.pushState({}, '', newUrl);
  };

  const handleRowSelection = () => {
    if (testCaseSideBar) {
      return [testHistoryClickedTableRow.testCase];
    }
    if (testSuiteSideBar) {
      return [testHistoryClickedTableRow.testSuite];
    }
    if (testGroupSideBar) {
      return [testHistoryClickedTableRow.testGroup];
    }
    return actionRows;
  };

  const handleModalAction = (actionType, envName = null) => {
    setOpenModal(null);

    const actionMap = {
      [TEST_MANAGER_MODAL_TYPE.EXECUTE]: onTestReExecute,
      [TEST_MANAGER_MODAL_TYPE.DELETE]: onTestDelete,
      [TEST_MANAGER_MODAL_TYPE.CANCEL]: onTestCancel,
    };

    const actionFunction = actionMap[actionType];
    if (!actionFunction) return;

    let item;
    if (testCaseSideBar) {
      item = testHistoryClickedTableRow.testCase;
    } else if (testSuiteSideBar) {
      item = testHistoryClickedTableRow.testSuite;
    } else if (testGroupSideBar) {
      item = testHistoryClickedTableRow.testGroup;
    } else {
      actionFunction(actionRows, envName ? { envName } : undefined);
      return;
    }

    const additionalParams = envName ? { envName: item.executedOnEnvironment } : undefined;
    actionFunction([item], additionalParams);
  };

  const closeSidebar = (paramsToDelete, sidebarType) => {
    const currentUrl = new URL(window.location.href);
    paramsToDelete.forEach((param) => currentUrl.searchParams.delete(param));
    window.history.pushState({}, '', currentUrl);

    toggleSidebar(sidebarType, null);
    setTestHistoryClickedTableRow({ testCase: null, testSuite: null, testGroup: null });
  };

  return (
    <PageLayout>
      <ContentLayout noPadding fullHeight>
        <TableV2
          data={data}
          columns={TEST_HISTORY_COLUMNS_SCHEMA}
          searchPlaceholder="Search Execution Names and IDs..."
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          onClearAllFilters={handleClearAllFilters}
          onClearFilter={handleClearFilterField}
          selectBarActions={tableBulkActions}
          onSelectionChange={onRowSelectionChange}
          selectionRefreshTrigger={selectionRefreshCount}
          entityName="Test Executions"
          emptyTableDescription="There are currently no execution to display."
          enablePageSizeChange
          meta={{
            timezone: user?.timezone,
            user,
            theme,
            onTableRowClick: (row) => handleTableRowClick(row),
            onRowDelete,
            onRowCancel,
            onRowReexecute,
          }}
          initialSearchText={searchText}
          onSearch={(e) => setSearchText(e.target.value)}
          onShowFilters={() => setIsTestHistoryFilterOpen(true)}
          selectedFilters={selectedFiltersBar}
          isLoading={isFetching}
          pinSelectColumn
          pinColumns={[TEST_HISTORY_FILTERS.EXECUTION_NAME]}
          pinRowHoverActionColumns={[TEST_HISTORY_FILTERS.ACTIONS]}
          onTableRefresh={refetch}
        />
      </ContentLayout>
      <TestHistoryFilters
        isOpen={isTestHistoryFiltersOpen}
        onClose={() => setIsTestHistoryFilterOpen(false)}
        initialValues={sourceFilterValue.sideFilter}
        onApplyFilters={(sideFilter) => {
          setIsTestHistoryFilterOpen(false);
          setFilterFieldValue(TEST_HISTORY_FILTERS_KEY, sideFilter);
          submitFilterValue();
        }}
      />

      <TestGroupSideBar
        openTestGroupSideBar={testGroupSideBar}
        isActionPeforming={isActionPeforming}
        closeTestGroupSideBar={() =>
          closeSidebar([TEST_MANAGER_LABELS.TEST_GROUP_QUERY_KEY, 'testId'], TEST_MANAGER_LABELS.TEST_GROUP_QUERY_KEY)
        }
        testHistoryClickedTableRow={
          testHistoryClickedTableRow.testGroup || {
            id: new URLSearchParams(location.search).get(TEST_MANAGER_LABELS.TEST_GROUP_QUERY_KEY),
            testId: new URLSearchParams(location.search).get('testId'),
          }
        }
        onCancelTestGroup={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.CANCEL);
        }}
        onReexecuteTestGroup={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.EXECUTE);
        }}
        onDeleteTestGroup={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.DELETE);
        }}
      />

      <TestSuiteSideBar
        openTestSuiteSidebar={testSuiteSideBar}
        isActionPeforming={isActionPeforming}
        closeTestSuiteSideBar={() =>
          closeSidebar([TEST_MANAGER_LABELS.TEST_SUITE_QUERY_KEY], TEST_MANAGER_LABELS.TEST_SUITE_QUERY_KEY)
        }
        testHistoryClickedTableRow={
          testHistoryClickedTableRow.testSuite || {
            id: new URLSearchParams(location.search).get(TEST_MANAGER_LABELS.TEST_SUITE_QUERY_KEY),
          }
        }
        onCancelTestSuite={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.CANCEL);
        }}
        onReexecuteTestSuite={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.EXECUTE);
        }}
        onDeleteTestSuite={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.DELETE);
        }}
      />

      <TestCaseSideBar
        openTestCaseSidebar={testCaseSideBar}
        closeTestCaseSideBar={() =>
          closeSidebar([TEST_MANAGER_LABELS.TEST_CASE_QUERY_KEY], TEST_MANAGER_LABELS.TEST_CASE_QUERY_KEY)
        }
        clickedTableRow={
          testHistoryClickedTableRow.testCase || {
            id: new URLSearchParams(location.search).get(TEST_MANAGER_LABELS.TEST_CASE_QUERY_KEY),
          }
        }
        isActionPeforming={isActionPeforming}
        onCancelTestCase={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.CANCEL);
        }}
        onReexecuteTestCase={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.EXECUTE);
        }}
        onDeleteTestCase={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.DELETE);
        }}
      />

      <TestExecuteModal
        open={openModal === TEST_MANAGER_MODAL_TYPE.EXECUTE}
        onClose={() => setOpenModal(null)}
        onExecute={(envName) => handleModalAction(TEST_MANAGER_MODAL_TYPE.EXECUTE, envName)}
        rows={handleRowSelection()}
        isReexcution
      />

      <TestDeleteModal
        open={openModal === TEST_MANAGER_MODAL_TYPE.DELETE}
        onClose={() => setOpenModal(null)}
        onDelete={() => handleModalAction(TEST_MANAGER_MODAL_TYPE.DELETE)}
        rows={handleRowSelection()}
      />

      <TestCancelModal
        open={openModal === TEST_MANAGER_MODAL_TYPE.CANCEL}
        onClose={() => setOpenModal(null)}
        onCancel={(envName) => handleModalAction(TEST_MANAGER_MODAL_TYPE.CANCEL, envName)}
        rows={handleRowSelection()}
      />
    </PageLayout>
  );
};

export default TestHistory;
