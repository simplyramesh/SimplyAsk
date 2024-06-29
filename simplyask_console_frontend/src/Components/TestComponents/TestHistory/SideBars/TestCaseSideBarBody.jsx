import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import InfoIcon from '../../../../Assets/icons/infoIcon.svg?component';
import routes from '../../../../config/routes';
import { useUser } from '../../../../contexts/UserContext';
import { capitalizeFirstLetterOfRegion } from '../../../../utils/helperFunctions';
import { getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import { StyledActionsDiagram } from '../../../Issues/components/FalloutTickets/components/FalloutTicketActionsView/StyledFalloutTicketActionsView';
import TestIcon from '../../../Managers/TestManager/components/TestIcon/TestIcon';
import {
  ACTIVE_STATUSES,
  TEST_CASE_EXECUTION_STATUS,
  TEST_ENTITY_TYPE,
  TEST_MANAGER_MODAL_TYPE,
} from '../../../Managers/TestManager/constants/constants';
import { executionStatusWithDescription } from '../../../Managers/TestManager/constants/formatters';
import { usePerformTestAction } from '../../../Managers/TestManager/hooks/usePerformTestAction';
import TestCancelModal from '../../../Managers/TestManager/modals/TestCancelModal';
import { STATUSES_COLORS } from '../../../Settings/Components/FrontOffice/constants/iconConstants';
import { EXECUTION_FRAMEWORKS } from '../../../shared/constants/core';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import ExecutionLogsViewer from '../../../shared/REDISIGNED/layouts/ExecutionLogsViewer/ExecutionLogsViewer';
import InfoList from '../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import ProgressStatus from '../../../shared/REDISIGNED/layouts/ProgressStatus/ProgressStatus';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledDivider, StyledEmptyValue, StyledFlex, StyledText } from '../../../shared/styles/styled';
import FalloutProcessEditor from '../../../WorkflowEditor/FalloutProcessEditor';
import { TagsSideBarGreyBackgroundRounded } from '../StyledTestHistory';
import { TEST_HISTORY_QUERY_KEY } from '../TestHistory';

const TestCaseSideBarBody = ({
  testCaseExecution,
  workflowExecution,
  onRefetch,
  isLoading,
  colors,
  fromTestSuite = false,
}) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const timezone = user?.timezone;

  const executionLogs = workflowExecution ? workflowExecution?.logs : testCaseExecution?.log;
  const executionStatus = workflowExecution ? workflowExecution?.status : testCaseExecution?.testCaseExecutionStatus;
  const workflowId = workflowExecution ? testCaseExecution?.workflowId : testCaseExecution?.testCaseId;

  executionLogs?.sort((log1, log2) => new Date(log1.createdDate) - new Date(log2.createdDate));

  const [openCancelTestCaseModal, setOpenCancelTestCaseModal] = useState(false);

  const renderExecutionStatus = () => {
    if (executionStatus === TEST_CASE_EXECUTION_STATUS.FAILED) {
      return (
        <>
          <InfoListItem name="Execution Status" alignItems="start">
            {executionStatusWithDescription('Failed', STATUSES_COLORS.RED, 'Failed To Execute')}
          </InfoListItem>
          <InfoListItem name="Execution Summary" alignItems="center">
            {testCaseExecution.executionSummary}
          </InfoListItem>
        </>
      );
    }

    if (executionStatus === TEST_CASE_EXECUTION_STATUS.STOPPED) {
      return (
        <InfoListItem name="Execution Status" alignItems="start">
          {executionStatusWithDescription('Stopped', STATUSES_COLORS.CHARCOAL, 'Canceled Before Finished Executing')}
        </InfoListItem>
      );
    }

    const createReadings = () => {
      if (executionStatus === TEST_CASE_EXECUTION_STATUS.EXECUTING) {
        return [{ name: 'Executing', value: 1 }];
      }
      if (executionStatus === TEST_CASE_EXECUTION_STATUS.FINALIZING) {
        return [{ name: 'Preparing', value: 1 }];
      }
      if (
        executionStatus === TEST_CASE_EXECUTION_STATUS.DONE ||
        executionStatus === TEST_CASE_EXECUTION_STATUS.SUCCESS ||
        executionStatus === TEST_CASE_EXECUTION_STATUS.RESOLVED
      ) {
        return [{ name: 'Passed', value: 1 }];
      }
      if (executionStatus === TEST_CASE_EXECUTION_STATUS.FAILED) {
        return [{ name: 'Failed', value: 1 }];
      }
      if (executionStatus === TEST_CASE_EXECUTION_STATUS.STOPPED) {
        return [{ name: 'Canceled', value: 1 }];
      }
      return [];
    };

    return (
      <>
        <StyledFlex p="15px 15px">
          <StyledText weight={600} size={16} mb={4}>
            Execution Status
          </StyledText>
          <ProgressStatus
            readings={createReadings()}
            status={capitalizeFirstLetterOfRegion(executionStatus)}
            showLegend="row"
            showPercentExecuted={false}
          />
        </StyledFlex>
        <StyledDivider borderWidth={1} color={colors.dividerColor} />
      </>
    );
  };

  const { performStop } = usePerformTestAction({
    onSuccess: () => {
      setOpenCancelTestCaseModal(false);
      onRefetch?.();
    },
    invalidateQueries: [TEST_HISTORY_QUERY_KEY],
  });

  const getActionPayloadFromRows = (rows) => {
    if (rows.length > 0) {
      const testCaseId = rows[0]?.testCaseExecutionId;

      return {
        testCaseExecutionId: [testCaseId],
        testSuiteExecutionId: [],
        testGroupExecutionId: [],
      };
    }

    return {
      testCaseExecutionId: [],
      testSuiteExecutionId: [],
      testGroupExecutionId: [],
    };
  };

  const performAction = (rows, callback, queryParams) => {
    const payload = getActionPayloadFromRows(rows);

    callback(payload, queryParams);
  };
  const onTestCancel = (rows, queryParams) => performAction(rows, performStop, queryParams);

  const handleModalAction = (actionType, envName = null) => {
    const additionalParams = envName ? { envName: testCaseExecution.environment } : undefined;
    onTestCancel([testCaseExecution], additionalParams);
  };

  return (
    <>
      <TestCancelModal
        open={openCancelTestCaseModal}
        onClose={() => setOpenCancelTestCaseModal(false)}
        onCancel={(envName) => handleModalAction(TEST_MANAGER_MODAL_TYPE.CANCEL, envName)}
        rows={[testCaseExecution]}
        fromTestCaseBody
      />
      <InfoList p="20px 30px 30px 30px">
        <InfoListGroup title={testCaseExecution?.displayName} noPaddings>
          <StyledFlex flexDirection="row" width={fromTestSuite ? '440px' : '220px'} mb={4} gap="10px">
            <StyledTooltip
              title="View the Test Case in the Test Manager"
              placement="bottom"
              p="10px 10px"
              maxWidth="auto"
            >
              <StyledButton
                variant="contained"
                tertiary
                onClick={() => {
                  const testCaseId = testCaseExecution?.testCaseId;
                  navigate(routes.TEST_CASE_DETAILS.replace(':caseId', testCaseId));
                }}
              >
                View in Test Manager
              </StyledButton>
            </StyledTooltip>
            {fromTestSuite && ACTIVE_STATUSES.includes(testCaseExecution?.testCaseExecutionStatus) ? (
              <StyledButton
                startIcon={<CloseIcon width={34} />}
                variant="contained"
                tertiary
                onClick={() => setOpenCancelTestCaseModal(true)}
              >
                Cancel Test Case
              </StyledButton>
            ) : null}
          </StyledFlex>

          <StyledText weight={600} size={20} ml={10} mb={10}>
            Details
          </StyledText>

          <InfoListItem name="Type" alignItems="center">
            <StyledFlex flexDirection="row" gap="5px">
              <TestIcon entityType={TEST_ENTITY_TYPE.CASE} />
              <StyledText>Test Case</StyledText>
            </StyledFlex>
          </InfoListItem>

          {renderExecutionStatus()}

          <InfoListItem name="Environment" alignItems="center">
            {testCaseExecution?.environment}
          </InfoListItem>
          <InfoListItem name="Start Time" alignItems="center">
            {testCaseExecution?.startTime ? (
              getInFormattedUserTimezone(testCaseExecution.startTime, timezone)
            ) : (
              <StyledEmptyValue />
            )}
          </InfoListItem>
          <InfoListItem name="End Time" alignItems="center">
            {testCaseExecution?.endTime
              ? getInFormattedUserTimezone(testCaseExecution.endTime, timezone)
              : 'To Be Determined (Preparing)'}
          </InfoListItem>
          <InfoListItem name="Duration" alignItems="center">
            {testCaseExecution?.duration || <StyledEmptyValue />}
          </InfoListItem>
        </InfoListGroup>
        <StyledDivider borderWidth={1} color={colors.dividerColor} />
        <StyledFlex flexDirection="row" p="15px 15px" gap="10px">
          <StyledText weight={600} size={16}>
            Related Test Case Tags
          </StyledText>
          <StyledTooltip
            title="Tags for this execution are exported from the Test Manger, and they cannot be edited or removed."
            arrow
            placement="bottom"
            p="10px 10px"
            maxWidth="auto"
          >
            <InfoIcon width={18} />
          </StyledTooltip>
        </StyledFlex>
        <StyledFlex flexDirection="row" flexWrap="wrap" p="10px 15px" gap="10px">
          {testCaseExecution?.tags?.length > 0 ? (
            testCaseExecution?.tags?.map((tag, idx) => (
              <TagsSideBarGreyBackgroundRounded key={idx}>{tag.name}</TagsSideBarGreyBackgroundRounded>
            ))
          ) : (
            <StyledEmptyValue />
          )}
        </StyledFlex>

        <StyledFlex my={4}>
          <StyledDivider borderWidth={2} color={colors.cardGridItemBorder} />
        </StyledFlex>

        {workflowId && !isLoading && (
          <StyledFlex margin="0px -22px 30px -22px">
            <StyledText size={19} weight={600} mb={14} ml={20}>
              Execution Path
            </StyledText>
            <StyledActionsDiagram>
              <FalloutProcessEditor
                isEmbeddedSideModalData={testCaseExecution?.testCaseId}
                processId={workflowId}
                processInstanceId={
                  testCaseExecution?.type === EXECUTION_FRAMEWORKS.RPA
                    ? testCaseExecution?.processInstanceId
                    : undefined
                }
                testCaseExecutionId={testCaseExecution?.testCaseExecutionId}
                paneConfigurations={{ centerOnInit: false }}
              />
            </StyledActionsDiagram>
          </StyledFlex>
        )}

        {executionLogs?.length > 0 ? (
          <ExecutionLogsViewer logs={executionLogs} />
        ) : (
          <StyledFlex>
            <StyledText weight={600} p="0 15px">
              Execution Logs
            </StyledText>
            <StyledFlex gap="18px" flex="1" alignItems="center" justifyContent="center" mt="10vh" mb="10vh">
              <CustomTableIcons icon="EMPTY" width={88} />
              <StyledFlex width="390px" alignItems="center" justifyContent="center">
                <StyledText as="h3" size={18} lh={22} weight={600} mb={9} textAlign="center">
                  Execution Logs will Appear Here When Execution Starts
                </StyledText>
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        )}
      </InfoList>
    </>
  );
};

export default TestCaseSideBarBody;
