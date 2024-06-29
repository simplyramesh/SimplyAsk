import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OpenInNewArrow from '../../../Assets/icons/openInNewArrow.svg?component';
import routes from '../../../config/routes';
import { useGetCurrentUser } from '../../../hooks/useGetCurrentUser';
import { checkIfProcessExistsInWorkflowEngineDatabase } from '../../../Services/axios/bpmnAxios';
import { getUserByUserId } from '../../../Services/axios/processHistory';
import { processHistoryKeys } from '../../../utils/serviceRequests';
import { BASE_DATE_TIME_FORMAT, formatLocalTime } from '../../../utils/timeUtil';
import { StyledActionsDiagram } from '../../Issues/components/FalloutTickets/components/FalloutTicketActionsView/StyledFalloutTicketActionsView';
import ExecutionParameters from '../../shared/ExecutionParameters/ExecutionParameters';
import { StyledButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';
import ExecutionLogsViewer from '../../shared/REDISIGNED/layouts/ExecutionLogsViewer/ExecutionLogsViewer';
import InfoList from '../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import CustomSidebar from '../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import Spinner from '../../shared/Spinner/Spinner';
import { StyledDivider, StyledEmptyValue, StyledFlex, StyledStatus, StyledText } from '../../shared/styles/styled';
import FalloutProcessEditor from '../../WorkflowEditor/FalloutProcessEditor';
import CancelExecutions from '../components/CancelExecutions/CancelExecutions';
import { PROCESS_HISTORY_EXECUTION_STATUS_COLOR_MAP } from '../constants/core';
import useGetProcessHistoryById, { GET_PROCESS_HISTORY_BY_ID } from '../hooks/useGetProcessHistoryById';
import { convertRequestDataStrToJson } from '../utils/helpers';
import { StyledNewTabButton } from './StyledProcessHistoryModalView';

const ProcessHistoryModalView = ({
  processExecutionSideModalData,
  processExecutionTableData,
  tableQueryKey,
  disableExecutionGroupLink,
  open,
  closeModal,
}) => {
  const queryClient = useQueryClient();
  const { currentUser } = useGetCurrentUser();

  const procInstanceId = processExecutionSideModalData?.procInstanceId;

  const { singleProcessHistory, isSingleProcessHistoryLoading } = useGetProcessHistoryById({
    id: procInstanceId,
    requestParams: {
      timezone: currentUser?.timezone,
    },
    queryParams: {
      enabled: !!procInstanceId,
    },
  });

  const { data: userData, isLoading } = useQuery({
    queryKey: ['getUserByUserId', singleProcessHistory?.businessKey?.user],
    queryFn: () => getUserByUserId(singleProcessHistory?.businessKey?.user),
    enabled: !!singleProcessHistory?.businessKey?.user,
  });

  const { data: processExists } = useQuery({
    queryKey: ['checkIfProcessExistsInWorkflowEngineDatabase', singleProcessHistory?.procInstanceId],
    queryFn: () => checkIfProcessExistsInWorkflowEngineDatabase(singleProcessHistory?.procInstanceId),
    enabled: !!singleProcessHistory?.procInstanceId,
  });

  const syncCurrentDataWithTable = () => {
    const currentTableData = queryClient.getQueryData(tableQueryKey);

    const updatedData = currentTableData?.content?.map((process) =>
      process.procInstanceId === singleProcessHistory.procInstanceId ? singleProcessHistory : process
    );

    queryClient.setQueryData(tableQueryKey, { ...currentTableData, content: updatedData });
  };

  useEffect(() => {
    if (singleProcessHistory) {
      const parameterValuesArray = singleProcessHistory?.data?.split(',');

      const getEmptyValueIndexes = [];

      parameterValuesArray?.forEach((item, index) => {
        if (!item || item === '') getEmptyValueIndexes.push(index);
      });

      syncCurrentDataWithTable();
    }
  }, [singleProcessHistory]);

  const navigate = useNavigate();

  const falloutTicketId = singleProcessHistory?.issueId ?? '';

  const handleExecutionGroupClick = () => {
    const fileId = singleProcessHistory?.[processHistoryKeys.BUSINESS_KEY]?.[processHistoryKeys.EXECUTION_GROUP];

    if (!fileId) return;

    const bulkPreviewFullViewPath = routes.PROCESS_HISTORY_BULK_PREVIEW;
    const findColonIndex = bulkPreviewFullViewPath.lastIndexOf('/:');
    const filterColon = bulkPreviewFullViewPath.slice(0, findColonIndex);

    const updatePath = `${filterColon}/${fileId}`;

    navigate(`${updatePath}`);
  };

  const getExecutedByUser = () => {
    if (!userData || !userData.firstName || !userData.lastName) return '---';

    const fullName = `${userData.firstName} ${userData.lastName}`;

    return fullName;
  };

  const goToProcessManagerPage = () => {
    navigate('/ProcessManager', {
      state: {
        id: 1,
        name: singleProcessHistory.projectName,
      },
    });
  };

  const status = singleProcessHistory?.[processHistoryKeys.STATUS_ONLY];

  return (
    <CustomSidebar
      open={open}
      onClose={closeModal}
      headerTemplate={
        <StyledFlex>
          <StyledFlex width="230px" position="absolute" right="25px" top="25px">
            {(status === processHistoryKeys.FAILED || status === processHistoryKeys.RESOLVED) && (
              <StyledNewTabButton
                onClick={() =>
                  navigate(`${routes.FALLOUT_TICKETS}/${falloutTicketId}`, {
                    state: {
                      routeToProcessHistory: true,
                    },
                  })
                }
                startIcon={<OpenInNewArrow />}
                variant="contained"
                primary
              >
                Open Fallout Ticket
              </StyledNewTabButton>
            )}
          </StyledFlex>
          <CancelExecutions
            isActive={status === processHistoryKeys.PREPARING || status === processHistoryKeys.EXECUTING}
            processId={singleProcessHistory?.procInstanceId}
            invalidateKeys={GET_PROCESS_HISTORY_BY_ID}
            processName={singleProcessHistory?.[processHistoryKeys.PROCESS_NAME]}
          />

          <StyledFlex>
            <StyledText weight={500}>#{singleProcessHistory?.[processHistoryKeys.PROCESS_ID]}</StyledText>

            <StyledText weight={500}>{singleProcessHistory?.[processHistoryKeys.PROCESS_NAME]}</StyledText>
          </StyledFlex>
        </StyledFlex>
      }
    >
      {() =>
        !singleProcessHistory || isLoading || isSingleProcessHistoryLoading ? (
          <Spinner parent />
        ) : (
          <StyledFlex padding="28px 20px 40px 20px" position="relative">
            <StyledFlex marginLeft="12px">
              <StyledText size={24} weight={600} wordBreak="break-word">
                {singleProcessHistory[processHistoryKeys.PROCESS_NAME]}
              </StyledText>

              {processExists?.data && (
                <StyledFlex width="fit-content" marginTop="10px">
                  <StyledButton variant="contained" tertiary onClick={() => goToProcessManagerPage()}>
                    View in Process Manager
                  </StyledButton>
                </StyledFlex>
              )}
            </StyledFlex>

            {singleProcessHistory?.procInstanceId && singleProcessHistory?.workflowId && (
              <StyledFlex margin="30px -22px 0 -22px">
                <StyledText size={19} weight={600} mb={14} ml={34}>
                  Execution Path
                </StyledText>
                <StyledActionsDiagram>
                  <FalloutProcessEditor
                    isEmbeddedSideModalData={singleProcessHistory}
                    processId={singleProcessHistory.workflowId}
                    processInstanceId={singleProcessHistory?.procInstanceId}
                    paneConfigurations={{ centerOnInit: false }}
                  />
                </StyledActionsDiagram>
              </StyledFlex>
            )}
            <StyledFlex mt="35px">
              <InfoListGroup title="Details">
                <InfoList>
                  <InfoListItem name="Status" alignItems="center">
                    <StyledStatus height="34px" color={PROCESS_HISTORY_EXECUTION_STATUS_COLOR_MAP[status]?.color}>
                      {PROCESS_HISTORY_EXECUTION_STATUS_COLOR_MAP[status]?.label}
                    </StyledStatus>
                  </InfoListItem>
                  <InfoListItem name="Status Details" alignItems="center">
                    <StyledEmptyValue />
                  </InfoListItem>
                  <InfoListItem name="Current Task" alignItems="center">
                    {singleProcessHistory?.[processHistoryKeys.CURRENT_TASK_ONLY]}
                  </InfoListItem>
                  <InfoListItem name="Execution Group" alignItems="center" wordBreak="break-word">
                    {!disableExecutionGroupLink ? (
                      <StyledButton textAlign="end" variant="text" onClick={handleExecutionGroupClick}>
                        {singleProcessHistory?.[processHistoryKeys.BUSINESS_KEY]?.[processHistoryKeys.EXECUTION_GROUP]}
                      </StyledButton>
                    ) : (
                      singleProcessHistory?.[processHistoryKeys.BUSINESS_KEY]?.[processHistoryKeys.EXECUTION_GROUP]
                    )}
                  </InfoListItem>
                  <InfoListItem name="Environment" alignItems="center">
                    {convertRequestDataStrToJson(singleProcessHistory?.requestData)?.environment ?? 'No Environment'}
                  </InfoListItem>
                  <InfoListItem name="Start Time" alignItems="center">
                    {formatLocalTime(singleProcessHistory?.[processHistoryKeys.START_TIME], BASE_DATE_TIME_FORMAT)}
                  </InfoListItem>
                  <InfoListItem name="End Time" alignItems="center">
                    {singleProcessHistory?.[processHistoryKeys.END_TIME] ? (
                      formatLocalTime(singleProcessHistory?.[processHistoryKeys.END_TIME], BASE_DATE_TIME_FORMAT)
                    ) : (
                      <StyledEmptyValue />
                    )}
                  </InfoListItem>
                  <InfoListItem name="Trigger Method" alignItems="center">
                    {singleProcessHistory?.[processHistoryKeys.BUSINESS_KEY]?.[processHistoryKeys.SOURCE]}
                  </InfoListItem>
                  <InfoListItem name="Triggered By" alignItems="center">
                    {getExecutedByUser()}
                  </InfoListItem>
                </InfoList>
              </InfoListGroup>
            </StyledFlex>
            <ExecutionParameters data={singleProcessHistory} noPaddings />
            <StyledDivider m="40px 0 20px 0" />
            <StyledFlex marginLeft="12px">
              <ExecutionLogsViewer logs={singleProcessHistory?.logs} />
            </StyledFlex>
          </StyledFlex>
        )
      }
    </CustomSidebar>
  );
};

export default ProcessHistoryModalView;
