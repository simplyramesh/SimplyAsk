import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import { useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';

import CopyIcon from '../../../../Assets/icons/copy.svg?component';
import useGetTestCaseExecutionById from '../../../../hooks/testHistory/getTestCaseExecutionData';
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

import TestCaseSideBarBody from './TestCaseSideBarBody';
import useGetProcessHistoryById from '../../../ProcessHistory/hooks/useGetProcessHistoryById';

const TestCaseSideBar = ({
  openTestCaseSidebar,
  closeTestCaseSideBar,
  clickedTableRow,
  testManagerDetailsView = false,
  isActionPerforming,
  onCancelTestCase,
  onReexecuteTestCase,
  onDeleteTestCase,
}) => {
  const [copyMessage, setCopyMessage] = useState('');
  const { copyToClipboard } = useCopyToClipboard('Copy URL of Test Execution');
  const { colors } = useTheme();

  const executionId = testManagerDetailsView ? clickedTableRow?.testCaseExecutionId : clickedTableRow?.id;

  const {
    testCaseExecutionData,
    isTestCaseExecutionDataLoading,
    refetchExecutedTestCase,
    isTestCaseExecutionDataRefetching,
  } = useGetTestCaseExecutionById({
    executionId,
    options: {
      enabled: !!executionId,
    },
  });

  const processInstanceId = testCaseExecutionData?.processInstanceId;

  const { singleProcessHistory, isSingleProcessHistoryFetching, refetchSingleProcessHistory } =
    useGetProcessHistoryById({
      id: processInstanceId,
      queryParams: {
        enabled: !!processInstanceId,
      },
    });

  useEffect(() => {
    if (!isTestCaseExecutionDataRefetching && singleProcessHistory) {
      refetchSingleProcessHistory();
    }
  }, [isTestCaseExecutionDataRefetching]);

  const isLoading = isTestCaseExecutionDataLoading || isSingleProcessHistoryFetching || isActionPerforming;

  const refetchExecution = useCallback(() => {
    refetchExecutedTestCase();
  }, []);

  return (
    <CustomSidebar
      open={!!openTestCaseSidebar}
      onClose={closeTestCaseSideBar}
      isLoading={isLoading}
      headBackgroundColor={colors.stormyGrey}
      headerTemplate={
        <StyledFlex direction="row" alignItems="center" gap="10px">
          <StyledText flex="0 0 auto">#{testCaseExecutionData?.testCaseExecutionId}</StyledText>

          <StyledDivider orientation="vertical" borderWidth={2} color={colors.cardGridItemBorder} height="14px" />

          <StyledText flex="1" maxLines={1} wordBreak="break-word">
            {testCaseExecutionData?.displayName}
          </StyledText>
        </StyledFlex>
      }
      customHeaderActionTemplate={
        <StyledFlex direction="row" alignItems="center" gap="15px">
          {ACTIVE_STATUSES.includes(testCaseExecutionData?.testCaseExecutionStatus) ? (
            <>
              <CustomBlackAndWhiteStyledButtonSideBar
                startIcon={<ReplayIcon sx={{ transform: 'scaleX(-1)' }} />}
                onClick={refetchExecution}
              >
                Refresh
              </CustomBlackAndWhiteStyledButtonSideBar>
              <StyledButton
                onClick={onCancelTestCase}
                danger
                variant="contained"
                disabled={isTestCaseExecutionDataLoading}
                startIcon={<CloseIcon width={34} />}
              >
                Cancel Test Case
              </StyledButton>
            </>
          ) : (
            <>
              <CustomBlackAndWhiteStyledButtonSideBar
                startIcon={<CustomTableIcons icon="BIN" width={24} />}
                disabled={isTestCaseExecutionDataLoading}
                onClick={onDeleteTestCase}
              >
                Delete
              </CustomBlackAndWhiteStyledButtonSideBar>
              <StyledButton
                primary
                variant="contained"
                onClick={onReexecuteTestCase}
                startIcon={<CachedIcon width={34} />}
              >
                Re-Execute Test Case
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
        <TestCaseSideBarBody
          testCaseExecution={testCaseExecutionData}
          workflowExecution={singleProcessHistory}
          onRefetch={refetchExecution}
          isLoading={isLoading}
          colors={colors}
        />
      )}
    </CustomSidebar>
  );
};

export default TestCaseSideBar;
