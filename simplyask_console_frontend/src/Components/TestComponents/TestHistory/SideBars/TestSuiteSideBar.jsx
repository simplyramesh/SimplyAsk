import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import CopyIcon from '../../../../Assets/icons/copy.svg?component';
import useGetTestCaseExecutionById from '../../../../hooks/testHistory/getTestCaseExecutionData';
import useGetTestSuiteExecutionById from '../../../../hooks/testHistory/getTestSuiteExecutionData';
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
import { ACTIVE_STATUSES } from '../../../Managers/TestManager/constants/constants';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  CustomBlackAndWhiteStyledButtonSideBar,
  StyledDivider,
  StyledFlex,
  StyledText,
} from '../../../shared/styles/styled';
import { StyledTextHoverUnderline } from '../StyledTestHistory';

import useGetProcessHistoryById from '../../../ProcessHistory/hooks/useGetProcessHistoryById';
import TestSuiteSideBarBody from './TestSuiteSideBarBody';

const TestSuiteSideBar = ({
  isActionPerforming,
  openTestSuiteSidebar,
  closeTestSuiteSideBar,
  testHistoryClickedTableRow,
  testManagerDetailsView = false,
  onCancelTestSuite,
  onReexecuteTestSuite,
  onDeleteTestSuite,
}) => {
  const [copyMessage, setCopyMessage] = useState('');
  const { copyToClipboard } = useCopyToClipboard('Copy URL of Test Execution');
  const [openTestCase, setOpenTestCase] = useState(false);
  const [clickedTableRow, setClickedTableRow] = useState('');
  const { colors } = useTheme();

  const { testSuiteExecutionData, isTestSuiteExecutionDataLoading, refetchTestSuiteExecutionData } =
    useGetTestSuiteExecutionById({
      testSuiteExecutionId: testManagerDetailsView
        ? String(testHistoryClickedTableRow?.testSuiteExecutionId)
        : testHistoryClickedTableRow?.id,
      options: {
        enabled: testManagerDetailsView
          ? testHistoryClickedTableRow?.testSuiteExecutionId !== null &&
            testHistoryClickedTableRow?.testSuiteExecutionId !== undefined &&
            String(testHistoryClickedTableRow?.testSuiteExecutionId).length > 0
          : testHistoryClickedTableRow?.id?.length > 0,
      },
    });

  const {
    testCaseExecutionData,
    isTestCaseExecutionDataLoading,
    isTestCaseExecutionDataRefetching,
    refetchExecutedTestCase,
  } = useGetTestCaseExecutionById({
    executionId: clickedTableRow?.testCaseExecutionId,
    options: {
      enabled: clickedTableRow?.testCaseExecutionId?.length > 0,
    },
  });

  const {
    singleProcessHistory: testCaseWorkflowData,
    isSingleProcessHistoryFetching: testCaseWorkflowLoading,
    refetchSingleProcessHistory: refetchTestCaseWorkflow,
  } = useGetProcessHistoryById({
    id: testCaseExecutionData?.processInstanceId,
    queryParams: {
      enabled: !!testCaseExecutionData?.processInstanceId,
    },
  });

  useEffect(() => {
    if (!isTestCaseExecutionDataRefetching && testCaseWorkflowData) {
      refetchTestCaseWorkflow();
    }
  }, [isTestCaseExecutionDataRefetching]);

  const isLoading =
    isTestSuiteExecutionDataLoading || isTestCaseExecutionDataLoading || testCaseWorkflowLoading || isActionPerforming;

  return (
    <CustomSidebar
      open={!!openTestSuiteSidebar}
      onClose={() => {
        setOpenTestCase(false);
        setClickedTableRow(null);
        closeTestSuiteSideBar();
      }}
      isLoading={isLoading}
      headBackgroundColor={colors.stormyGrey}
      headerTemplate={
        <StyledFlex gap="10px">
          <StyledFlex direction="row" alignItems="center" gap="10px">
            <StyledText>#{testSuiteExecutionData?.testSuiteExecutionId}</StyledText>
            <StyledDivider orientation="vertical" borderWidth={2} color={colors.cardGridItemBorder} height="14px" />
            {openTestCase ? (
              <StyledFlex direction="row" alignItems="center" gap="10px">
                <StyledTextHoverUnderline
                  cursor="pointer"
                  onClick={() => setOpenTestCase(false)}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  wordBreak="break-all"
                  maxWidth="325px"
                  maxLines={1}
                >
                  {testHistoryClickedTableRow?.executionName || testHistoryClickedTableRow?.displayName}
                </StyledTextHoverUnderline>{' '}
                /{' '}
                <StyledText wordBreak="break-all" maxLines={1}>
                  {clickedTableRow?.displayName}
                </StyledText>
              </StyledFlex>
            ) : (
              <StyledText maxLines={1}>
                {testHistoryClickedTableRow?.executionName || testHistoryClickedTableRow?.displayName}
              </StyledText>
            )}
          </StyledFlex>
        </StyledFlex>
      }
      customHeaderActionTemplate={
        <StyledFlex direction="row" alignItems="center" gap="15px">
          {ACTIVE_STATUSES.includes(testSuiteExecutionData?.testSuiteExecutionStatus) ? (
            <>
              <CustomBlackAndWhiteStyledButtonSideBar
                startIcon={<ReplayIcon sx={{ transform: 'scaleX(-1)' }} />}
                onClick={() =>
                  clickedTableRow?.displayName?.length > 0 ? refetchExecutedTestCase() : refetchTestSuiteExecutionData()
                }
              >
                Refresh
              </CustomBlackAndWhiteStyledButtonSideBar>

              <StyledButton
                onClick={onCancelTestSuite}
                danger
                variant="contained"
                disabled={isTestSuiteExecutionDataLoading}
                startIcon={<CloseIcon width={34} />}
              >
                Cancel Test Suite
              </StyledButton>
            </>
          ) : (
            <>
              <CustomBlackAndWhiteStyledButtonSideBar
                startIcon={<CustomTableIcons icon="BIN" width={24} />}
                disabled={isTestSuiteExecutionDataLoading}
                onClick={onDeleteTestSuite}
              >
                Delete
              </CustomBlackAndWhiteStyledButtonSideBar>

              <StyledButton
                primary
                variant="contained"
                onClick={onReexecuteTestSuite}
                startIcon={<CachedIcon width={34} />}
              >
                Re-Execute Test Suite
              </StyledButton>
            </>
          )}
          <StyledTooltip title={copyMessage} arrow placement="top" p="10px 15px" maxWidth="auto">
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
              onMouseLeave={() => setCopyMessage('Copy URL of Test Execution')}
            >
              <CopyIcon />
            </StyledFlex>
          </StyledTooltip>
        </StyledFlex>
      }
    >
      {() => (
        <TestSuiteSideBarBody
          openTestCase={openTestCase}
          setOpenTestCase={setOpenTestCase}
          testSuiteExecutionData={testSuiteExecutionData}
          testCaseExecutionData={testCaseExecutionData}
          testCaseWorkflowData={testCaseWorkflowData}
          colors={colors}
          setClickedTableRow={setClickedTableRow}
          openTestSuiteSidebar={openTestSuiteSidebar}
          testHistoryClickedTableRow={testHistoryClickedTableRow}
          testManagerDetailsView={testManagerDetailsView}
          isLoading={isLoading}
        />
      )}
    </CustomSidebar>
  );
};

export default TestSuiteSideBar;
