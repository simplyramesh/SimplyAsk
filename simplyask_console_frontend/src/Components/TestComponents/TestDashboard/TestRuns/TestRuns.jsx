import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import AllTestRunsIcon from '../../../../Assets/icons/allTestRuns.svg?component';
import CreateTestRunIcon from '../../../../Assets/icons/createTestRun.svg?component';
import ExportTestRunIcon from '../../../../Assets/icons/export.svg?component';
import routes from '../../../../config/routes';
import { useUser } from '../../../../contexts/UserContext';
import {
  deleteTestRunById,
  getAllTestRuns,
  getTestRunById,
  patchTestRunCaseComment,
} from '../../../../Services/axios/test';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import Spinner from '../../../shared/Spinner/Spinner';
import { StyledCard, StyledFlex, StyledText } from '../../../shared/styles/styled';
import DoughnutChart from './DoughnutChart/DoughnutChart';
import TestCaseTextStats from './TestCaseTextStats/TestCaseTextStats';
import TestRunCreateModal from './TestRunCreateModal/TestRunCreateModal';
import TestRunInfo from './TestRunInfo/TestRunInfo';
import { StyledTestRunsInfo, StyledTestRunsInfoData } from './TestRuns.styled';
import TestRunsSideDrawer from './TestRunsSideDrawer/TestRunsSideDrawer';
import TestRunsTable from './TestRunsTable/TestRunsTable';
import {
  addEnvironmentStatusColumns,
  TEST_RUN,
  TEST_RUN_COLUMN_KEYS,
  TEST_SUITE_CASES,
  TEST_SUITES,
  testRunInfo,
  testRunTableData,
} from './utils/helpers';
import { generateTestRunsPDF } from './utils/pdf';

const TestRuns = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  const { colors } = useTheme();

  const [isShowSideDrawer, setIsShowSideDrawer] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false);

  const [currentTestRunsID, setCurrentTestRunsID] = useState(null);

  const { data: testRuns, isSuccess: isTestRunsSuccess } = useQuery({
    queryKey: ['getAllTestRuns'],
    queryFn: getAllTestRuns,
    select: (data) => {
      return [...data].sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
    },
  });

  const {
    data: currentTestRun,
    isFetchedAfterMount: isCurrentTestRunFetchedAfterMount,
    isError: isCurrentTestRunError,
    isSuccess: isCurrentTestRunSuccess,
  } = useQuery({
    queryKey: ['getTestRunById', currentTestRunsID],
    queryFn: () => getTestRunById(currentTestRunsID),
    enabled: isTestRunsSuccess && !!currentTestRunsID,
    select: (data) => {
      const run = {
        [TEST_RUN]: testRunInfo(data),
        data: testRunTableData(data),
        columns: addEnvironmentStatusColumns(data),
        originalData: data,
      };

      return { ...run };
    },
    placeholderData: {
      [TEST_RUN]: {},
      columns: [],
      data: { [TEST_SUITES]: [] },
      originalData: {},
    },
  });

  const { mutate: patchComment } = useMutation({
    mutationKey: 'patchComment',
    mutationFn: async ({ testRunCaseId, comment }) => patchTestRunCaseComment(testRunCaseId, comment),
    onSuccess: (_data, { comment, onSave, testCaseRow, isCommentKeyPresent, testCaseNoCommentKeyPresentValue }) => {
      if (!isCommentKeyPresent) {
        testCaseRow = testCaseNoCommentKeyPresentValue;
      }

      if (isCommentKeyPresent && isCommentKeyPresent !== comment) {
        testCaseRow[TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT] = comment;
      }

      onSave({ isError: false });

      toast.success('Comment updated successfully');

      queryClient.invalidateQueries({ queryKey: ['getTestRunById'] });
    },
    onError: (_err, { onSave }) => {
      onSave({ isError: true });

      toast.error('Unable to update comment');
    },
  });

  const { mutate: deleteTestRun } = useMutation({
    mutationKey: 'deleteTestRun',
    mutationFn: async (testRunId) => {
      const deleteMutationResponse = await deleteTestRunById(testRunId);

      return deleteMutationResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'getAllTestRuns' });

      setItemToDelete(null);

      toast.success(`Test Run: ${itemToDelete.displayName} Successfully Deleted`);
    },
    onError: () => {
      toast.error('Unable to Delete Test Run');
    },
  });

  useEffect(() => {
    if (testRuns?.length) {
      setCurrentTestRunsID(testRuns[0].id);
    }
  }, [testRuns]);

  const handleNavigate = useCallback(({ row }) => {
    const testPathNames = {
      route: routes.TEST_HISTORY,
      params: {
        displayName: row?.original?.testSuiteName || row?.original?.name,
        testSuiteExecutionId:
          row?.original?.testSuiteExecutionId || row?.original?.envStatuses?.[0]?.testSuiteExecutionId,
        testCaseExecutionId: row?.original?.envStatuses?.[0]?.testCaseExecutionId,
      },
    };

    window.open(`${testPathNames.route}?${new URLSearchParams(testPathNames.params)}`, '_blank');
  }, []);

  const handleSaveCell = (cell, newComment, data, onSave) => {
    const newData = { ...data };
    const dataIndex = +cell.row.id.split('.')[0];
    const dataTestCasesIndex = +cell.row.id.split('.')[1];

    const testCaseRow = newData.data[dataIndex][TEST_SUITE_CASES][dataTestCasesIndex];

    const previousComment = testCaseRow[TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT];

    if (previousComment === newComment) onSave({ isError: false });

    if (previousComment !== newComment) {
      const isCommentKeyPresent = Object.keys(testCaseRow).includes(`${TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT}`);

      const testCaseNoCommentKeyPresentValue = {
        ...testCaseRow,
        [TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT]: newComment,
      };

      patchComment({
        testRunCaseId: cell.row.original.id,
        comment: newComment,
        onSave,
        testCaseRow: newData.data[dataIndex][TEST_SUITE_CASES][dataTestCasesIndex],
        isCommentKeyPresent,
        testCaseNoCommentKeyPresentValue,
      });
    }
  };

  const getPercentage = (total, item) => {
    if (total === 0 || item === 0) return 0;

    const percentage = Math.round((item / total) * 100);

    return percentage;
  };

  const chartDataCommonProps = {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 14.5,
  };

  const chartData = [
    {
      dataItem: currentTestRun?.[TEST_RUN]?.totalTestCasesPassed,
      bgColor: colors.statusResolved,
      hoverBgColor: colors.statusResolvedFadedChart,
      label: 'Case Passed',
      centerText: [
        {
          value: `${getPercentage(currentTestRun?.[TEST_RUN]?.totalTestCases, currentTestRun?.[TEST_RUN]?.totalTestCasesPassed)}%`,
          ...chartDataCommonProps,
        },
        {
          value: 'Passed',
          ...chartDataCommonProps,
        },
      ],
    },
    {
      dataItem: currentTestRun?.[TEST_RUN]?.totalTestCasesPartialPassed,
      bgColor: colors.statusAssigned,
      hoverBgColor: colors.statusAssignedFadedChart,
      label: 'Case Partially Passed',
      centerText: [
        {
          value: `${getPercentage(currentTestRun?.[TEST_RUN]?.totalTestCases, currentTestRun?.[TEST_RUN]?.totalTestCasesPartialPassed)}%`,
          ...chartDataCommonProps,
        },
        {
          value: 'Partially',
          ...chartDataCommonProps,
        },
        {
          value: 'Passed',
          ...chartDataCommonProps,
        },
      ],
    },
    {
      dataItem: currentTestRun?.[TEST_RUN]?.totalTestCasesFailed,
      bgColor: colors.statusOverdue,
      hoverBgColor: colors.statusOverdueFadedChart,
      label: 'Case Failed',
      centerText: [
        {
          value: `${getPercentage(currentTestRun?.[TEST_RUN]?.totalTestCases, currentTestRun?.[TEST_RUN]?.totalTestCasesFailed)}%`,
          ...chartDataCommonProps,
        },
        {
          value: 'Failed',
          ...chartDataCommonProps,
        },
      ],
    },
  ];

  const hasInfo = isCurrentTestRunFetchedAfterMount && currentTestRun?.columns?.length > 0;

  return (
    <StyledCard>
      <StyledFlex id="testRuns">
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="36px">
          <StyledText size={24} weight={600} lh={30}>
            Test Runs
          </StyledText>
          <StyledFlex direction="row" gap="0 18px" data-html2canvas-ignore="true">
            <StyledButton
              tertiary
              variant="contained"
              onClick={() => generateTestRunsPDF(currentTestRun?.originalData, user?.timezone)}
              disabled={!hasInfo}
              startIcon={<ExportTestRunIcon />}
            >
              Export Test Run
            </StyledButton>
            <StyledButton
              tertiary
              variant="contained"
              onClick={() => setIsCreateModalOpened(true)}
              startIcon={<CreateTestRunIcon />}
            >
              Create Test Run
            </StyledButton>
            <StyledButton
              tertiary
              variant="contained"
              onClick={() => setIsShowSideDrawer(true)}
              startIcon={<AllTestRunsIcon />}
            >
              See All Test Runs
            </StyledButton>
          </StyledFlex>
        </StyledFlex>

        {isCurrentTestRunFetchedAfterMount && (currentTestRun?.columns?.length === 0 || isCurrentTestRunError) && (
          <StyledFlex alignItems="center" justifyContent="center" gap="18px" m="154px 0" data-html2canvas-ignore="true">
            <CustomTableIcons icon="EMPTY" width={88} />
            <StyledFlex alignItems="center" justifyContent="center" gap="8px">
              <StyledText size={18} weight={600} lh={22}>
                No Test Runs Found
              </StyledText>
              <StyledText
                size={16}
                weight={600}
                lh={21}
                color={colors.linkColor}
                cursor="pointer"
                onClick={() => setIsCreateModalOpened(true)}
              >
                Create New Test Run
              </StyledText>
            </StyledFlex>
          </StyledFlex>
        )}

        {hasInfo && (
          <StyledFlex mb="26px">
            <StyledText size={20} weight={500} color={colors.textColorOptionTwo} mb={22}>
              {currentTestRun?.[TEST_RUN]?.displayName}
            </StyledText>

            <StyledTestRunsInfo direction="row" gap="12px 20px" id="top-info">
              <StyledTestRunsInfoData gap="12px 0" flex="0 0 432px">
                <TestRunInfo text="Created On" date={currentTestRun?.[TEST_RUN]?.createdAt} />
                <TestRunInfo text="Modified At" date={currentTestRun?.[TEST_RUN]?.modifiedAt} />
                <TestRunInfo text="Total Test Cases" count={currentTestRun?.[TEST_RUN]?.totalTestCases} />
              </StyledTestRunsInfoData>

              <StyledFlex
                direction="row"
                justifyContent="center"
                flex="1 1 auto"
                gap="0 44px"
                alignItems="center"
                backgroundColor={colors.bgColorOptionTwo}
                borderRadius="10px"
                p="14px 64px"
              >
                {isCurrentTestRunSuccess && (
                  <>
                    <StyledFlex direction="row" flex="0 1 auto">
                      <DoughnutChart id="my-id" chartWidth={130} data={chartData} />
                    </StyledFlex>

                    <StyledFlex gap="18px" flex="0 1 auto">
                      <TestCaseTextStats
                        passFailSelector="PASS"
                        dotColor={colors.statusResolved}
                        totalTestCases={currentTestRun?.[TEST_RUN]?.totalTestCases}
                        numOfTestCases={currentTestRun?.[TEST_RUN]?.totalTestCasesPassed}
                      />
                      <TestCaseTextStats
                        passFailSelector="PARTIAL"
                        dotColor={colors.statusAssigned}
                        totalTestCases={currentTestRun?.[TEST_RUN]?.totalTestCases}
                        numOfTestCases={currentTestRun?.[TEST_RUN]?.totalTestCasesPartialPassed}
                      />
                      <TestCaseTextStats
                        passFailSelector="FAILED"
                        dotColor={colors.statusOverdue}
                        totalTestCases={currentTestRun?.[TEST_RUN]?.totalTestCases}
                        numOfTestCases={currentTestRun?.[TEST_RUN]?.totalTestCasesFailed}
                      />
                    </StyledFlex>
                  </>
                )}
              </StyledFlex>
            </StyledTestRunsInfo>
          </StyledFlex>
        )}
      </StyledFlex>
      {hasInfo ? (
        <>
          <div data-html2canvas-ignore="true">
            <TestRunsTable
              columns={currentTestRun?.columns}
              data={currentTestRun?.data}
              meta={{
                onNavigate: (row) => handleNavigate(row),
              }}
              muiTableBodyCellEditTextFieldProps={({ cell }) => ({
                onBlur: (e, onSave) => handleSaveCell(cell, e.target.value, currentTestRun, onSave),
              })}
            />
          </div>
        </>
      ) : (
        (!isCurrentTestRunFetchedAfterMount && <Spinner medium inline />) || null
      )}
      <TestRunsSideDrawer
        isShowModal={isShowSideDrawer}
        setShowModal={setIsShowSideDrawer}
        onDelete={(item) => setItemToDelete(item)}
        onOpen={(id) => {
          setCurrentTestRunsID(id);

          setIsShowSideDrawer(false);
        }}
        allTestRuns={testRuns}
      />

      {/* Create Test Run Modal */}
      <TestRunCreateModal
        isOpen={isCreateModalOpened}
        onClose={() => setIsCreateModalOpened(false)}
        onCreate={(name) => {
          toast.success(`Test Run: ${name} Successfully Created`);
        }}
      />

      {/* Delete Test Run Modal */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        onCloseModal={() => setItemToDelete(null)}
        onSuccessClick={() => deleteTestRun(itemToDelete?.id)}
        successBtnText="Delete"
        alertType="DANGER"
        title="Are You Sure?"
        text={`You are about to permanently delete ${itemToDelete?.displayName}. This action cannot be reversed.`}
      />
    </StyledCard>
  );
};

export default TestRuns;
