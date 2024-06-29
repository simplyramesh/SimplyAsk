import { useTheme } from '@mui/system';
import { useState } from 'react';

import { useUser } from '../../../../../contexts/UserContext';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import {
  getTestCaseExecutions,
  getTestGroupExecutions,
  getTestSuiteExecutions,
} from '../../../../../Services/axios/test';
import EmptyTable from '../../../../shared/REDISIGNED/table-v2/EmptyTable/EmptyTable';
import TableV2 from '../../../../shared/REDISIGNED/table-v2/Table-v2';
import TestCaseSideBar from '../../../../TestComponents/TestHistory/SideBars/TestCaseSideBar';
import TestGroupSideBar from '../../../../TestComponents/TestHistory/SideBars/TestGroupSideBar';
import TestSuiteSideBar from '../../../../TestComponents/TestHistory/SideBars/TestSuiteSideBar';
import { TEST_HISTORY_QUERY_KEY } from '../../../../TestComponents/TestHistory/TestHistory';
import { TEST_ENTITY_TYPE, TEST_MANAGER_MODAL_TYPE } from '../../constants/constants';
import { RECENT_EXECUTIONS_COLUMNS } from '../../constants/formatters';
import { GET_TEST_CASE_EXECUTIONS_QUERY_KEY } from '../../hooks/useGetTestCaseExecutions';
import { GET_TEST_GROUP_EXECUTIONS_QUERY_KEY } from '../../hooks/useGetTestGroupExecutions';
import { GET_TEST_SUITE_EXECUTIONS_QUERY_KEY } from '../../hooks/useGetTestSuiteExecutions';
import { usePerformTestAction } from '../../hooks/usePerformTestAction';
import TestCancelModal from '../../modals/TestCancelModal';
import TestDeleteModal from '../../modals/TestDeleteModal';
import TestExecuteModal from '../../modals/TestExecuteModal';
import { TEST_TYPE } from '../../utils/constants';
import { getPayloadPropKeyByTestExecutionType } from '../../utils/helpers';

const RecentExecutions = ({ id, type }) => {
  const { user } = useUser();
  const theme = useTheme();

  const [testCaseSideBar, setTestCaseSideBar] = useState(null);
  const [testSuiteSideBar, setTestSuiteSideBar] = useState(null);
  const [testGroupSideBar, setTestGroupSideBar] = useState(null);
  const [openModal, setOpenModal] = useState();

  const [recentExecutionsClickedTableRow, setRecentExecutionsClickedTableRow] = useState({
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

  const getQueryFn = (filter) => {
    if (type === TEST_ENTITY_TYPE.CASE) {
      return getTestCaseExecutions(filter);
    }
    if (type === TEST_ENTITY_TYPE.SUITE) {
      return getTestSuiteExecutions(filter);
    }
    if (type === TEST_ENTITY_TYPE.GROUP) {
      return getTestGroupExecutions(id, filter);
    }
  };

  const getQueryKey = () => {
    if (type === TEST_ENTITY_TYPE.CASE) {
      return GET_TEST_CASE_EXECUTIONS_QUERY_KEY;
    }
    if (type === TEST_ENTITY_TYPE.SUITE) {
      return GET_TEST_SUITE_EXECUTIONS_QUERY_KEY;
    }
    if (type === TEST_ENTITY_TYPE.GROUP) {
      return GET_TEST_GROUP_EXECUTIONS_QUERY_KEY;
    }
  };

  const getInitialFilter = () => {
    if (type === TEST_ENTITY_TYPE.CASE) {
      return {
        testCaseId: id,
      };
    }
    if (type === TEST_ENTITY_TYPE.SUITE) {
      return {
        testSuiteIds: [id],
      };
    }
    if (type === TEST_ENTITY_TYPE.GROUP) {
      return null;
    }
  };

  const { data, sorting, setSorting, pagination, setPagination, isFetching } = useTableSortAndFilter({
    queryFn: (filter) => getQueryFn(filter),
    queryKey: getQueryKey(),
    initialFilters: getInitialFilter(),
    initialSorting: [],
    pageSize: 10,
    options: {
      enabled: !!id,
    },
  });

  const handleTableRowClick = (row) => {
    if (row.testCaseExecutionId) {
      toggleSidebar('testCase', true);
      setRecentExecutionsClickedTableRow({ testCase: row, testSuite: null, testGroup: null });
    } else if (row.testSuiteExecutionId) {
      toggleSidebar('testSuite', true);
      setRecentExecutionsClickedTableRow({ testCase: null, testSuite: row, testGroup: null });
    } else if (row.testGroupExecutionId) {
      toggleSidebar('testGroup', true);
      setRecentExecutionsClickedTableRow({ testCase: null, testSuite: null, testGroup: row });
    }
  };

  const { performDelete, performStop, performReexecute, isActionPeforming } = usePerformTestAction({
    invalidateQueries: [TEST_HISTORY_QUERY_KEY],
  });

  const getActionPayloadFromRows = (rows) =>
    rows?.reduce(
      (acc, row) => {
        const typeParam = type;
        let idParam;
        if (typeParam === TEST_TYPE.CASE) {
          idParam = row.testCaseExecutionId;
        } else if (typeParam === TEST_TYPE.SUITE) {
          idParam = row.testSuiteExecutionId;
        } else if (typeParam === TEST_TYPE.GROUP) {
          idParam = row.testGroupExecutionId;
        }
        const propKey = getPayloadPropKeyByTestExecutionType(typeParam);

        return { ...acc, [propKey]: [...acc[propKey], idParam] };
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
      item = recentExecutionsClickedTableRow.testCase;
    } else if (testSuiteSideBar) {
      item = recentExecutionsClickedTableRow.testSuite;
    } else if (testGroupSideBar) {
      item = recentExecutionsClickedTableRow.testGroup;
    }

    const additionalParams = envName ? { envName: item.executedOnEnvironment } : undefined;
    actionFunction([item], additionalParams);
  };

  const handleRowSelection = () => {
    if (testCaseSideBar) {
      return [recentExecutionsClickedTableRow.testCase];
    }
    if (testSuiteSideBar) {
      return [recentExecutionsClickedTableRow.testSuite];
    }
    if (testGroupSideBar) {
      return [recentExecutionsClickedTableRow.testGroup];
    }
  };

  return data?.content?.length > 0 || isFetching ? (
    <>
      <TableV2
        columns={RECENT_EXECUTIONS_COLUMNS}
        data={data}
        enableHeader={false}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        entityName="Executions"
        meta={{
          timezone: user?.timezone,
          type,
          theme,
          onTableRowClick: (row) => handleTableRowClick(row),
        }}
        enableRowSelection={false}
        isLoading={isFetching}
      />

      <TestCaseSideBar
        openTestCaseSidebar={testCaseSideBar}
        closeTestCaseSideBar={() => {
          toggleSidebar('testCase', null);
          setRecentExecutionsClickedTableRow({ testCase: null, testSuite: null, testGroup: null });
        }}
        clickedTableRow={recentExecutionsClickedTableRow.testCase}
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
        testManagerDetailsView
      />

      <TestSuiteSideBar
        openTestSuiteSidebar={testSuiteSideBar}
        closeTestSuiteSideBar={() => {
          toggleSidebar('testSuite', null);
          setRecentExecutionsClickedTableRow({ testCase: null, testSuite: null, testGroup: null });
        }}
        testHistoryClickedTableRow={recentExecutionsClickedTableRow.testSuite}
        testManagerDetailsView
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

      <TestGroupSideBar
        openTestGroupSideBar={testGroupSideBar}
        closeTestGroupSideBar={() => {
          toggleSidebar('testGroup', null);
          setRecentExecutionsClickedTableRow({ testCase: null, testSuite: null, testGroup: null });
        }}
        testHistoryClickedTableRow={recentExecutionsClickedTableRow.testGroup}
        testManagerDetailsView
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
        fromTestManagerDetailsView
        typeParam={type}
      />

      <TestCancelModal
        open={openModal === TEST_MANAGER_MODAL_TYPE.CANCEL}
        onClose={() => setOpenModal(null)}
        onCancel={(envName) => handleModalAction(TEST_MANAGER_MODAL_TYPE.CANCEL, envName)}
        rows={handleRowSelection()}
        fromTestCaseBody
      />
    </>
  ) : (
    <EmptyTable hideTitle message="There are no Executions" />
  );
};

export default RecentExecutions;
