import RefreshIcon from '@mui/icons-material/Refresh';
import React from 'react';
import { Portal } from 'react-portal';
import { useQueryClient } from '@tanstack/react-query';

import OpenInNewArrow from '../../../../../Assets/icons/openInNewArrow.svg?component';
import routes from '../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useGetUserById } from '../../../../../hooks/useUserById';
import { processHistoryKeys } from '../../../../../utils/serviceRequests';
import { BASE_DATE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../../utils/timeUtil';
import { StyledActionsDiagram } from '../../../../Issues/components/FalloutTickets/components/FalloutTicketActionsView/StyledFalloutTicketActionsView';
import { PROCESS_STATUS_COLORS_MAP } from '../../../../ProcessHistory/constants/core';
import useGetProcessHistoryById, {
  GET_PROCESS_HISTORY_BY_ID,
} from '../../../../ProcessHistory/hooks/useGetProcessHistoryById';
import { StyledNewTabButton } from '../../../../ProcessHistory/ProcessHistoryModalView/StyledProcessHistoryModalView';
import ExecutionParameters from '../../../../shared/ExecutionParameters/ExecutionParameters';
import { StyledButton, StyledLoadingButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ExecutionLogsViewer from '../../../../shared/REDISIGNED/layouts/ExecutionLogsViewer/ExecutionLogsViewer';
import InfoListGroup from '../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import Spinner from '../../../../shared/Spinner/Spinner';
import {
  StyledDivider,
  StyledEmptyValue,
  StyledFlex,
  StyledStatus,
  StyledText,
} from '../../../../shared/styles/styled';
import { AvatarWithName } from '../../../../UserAvatar';
import FalloutProcessEditor from '../../../../WorkflowEditor/FalloutProcessEditor';

const ProcessExecutionInfo = ({ processInstanceId, customActionsRef }) => {
  const queryClient = useQueryClient();
  const { currentUser } = useGetCurrentUser();

  const { singleProcessHistory, isSingleProcessHistoryFetching, isError } = useGetProcessHistoryById(
    processInstanceId,
    {},
    { enabled: true }
  );

  const { status, currentTask, businessKey, startTime, endTime, issueId } = singleProcessHistory || {};

  const { userInfo } = useGetUserById(businessKey?.user, { enabled: !!businessKey?.user });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [GET_PROCESS_HISTORY_BY_ID] });
  };

  return (
    <>
      {isSingleProcessHistoryFetching && <Spinner small parent fadeBgParent />}

      <StyledFlex gap="30px">
        <StyledFlex gap="16px">
          <StyledFlex p="0 30px">
            <StyledText size={19} weight={600}>
              Execution Path
            </StyledText>
          </StyledFlex>
          {isError ? (
            <StyledFlex p="0 30px">
              <StyledText>Execution path can't be loaded</StyledText>
            </StyledFlex>
          ) : (
            <StyledActionsDiagram>
              <FalloutProcessEditor
                isEmbeddedSideModalData={singleProcessHistory}
                processId={singleProcessHistory?.workflowId}
                processInstanceId={singleProcessHistory?.procInstanceId}
                paneConfigurations={{ centerOnInit: false }}
              />
            </StyledActionsDiagram>
          )}
        </StyledFlex>
        <StyledFlex p="0 16px">
          <InfoListGroup title="Details" noPaddings>
            <InfoListItem name="Status" alignItems="center">
              <StyledStatus color={PROCESS_STATUS_COLORS_MAP[status]?.color}>
                {PROCESS_STATUS_COLORS_MAP[status]?.label}
              </StyledStatus>
            </InfoListItem>
            <InfoListItem name="Status Details" alignItems="center">
              {singleProcessHistory?.incidentMsg}
            </InfoListItem>
            <InfoListItem name="Current task" alignItems="center">
              {currentTask}
            </InfoListItem>
            <InfoListItem name="Execution Group" alignItems="center">
              {businessKey?.group && (
                <StyledButton variant="text" textAlign="right" onClick={() => {}}>
                  {businessKey?.group}
                </StyledButton>
              )}
            </InfoListItem>
            <InfoListItem name="Execution Method" alignItems="center">
              {businessKey?.source}
            </InfoListItem>
            <InfoListItem name="Executed By">
              {userInfo && <AvatarWithName size={30} customUser={userInfo} />}
            </InfoListItem>
            <InfoListItem name="Start Time">
              {getInFormattedUserTimezone(startTime, currentUser?.timezone, BASE_DATE_TIME_FORMAT)}
            </InfoListItem>
            <InfoListItem name="End Time">
              {endTime ? (
                getInFormattedUserTimezone(endTime, currentUser?.timezone, BASE_DATE_TIME_FORMAT)
              ) : (
                <StyledEmptyValue />
              )}
            </InfoListItem>
          </InfoListGroup>
        </StyledFlex>
        <StyledDivider borderWidth={2} />
        <ExecutionParameters data={singleProcessHistory} noPaddings>
          {({ inputParams, executionParams }) => (
            <StyledFlex p="0 16px">
              <StyledFlex gap="30px">
                {!!inputParams.length && (
                  <InfoListGroup noPaddings title="Input Parameters">
                    {inputParams.map(({ key, value }) => (
                      <InfoListItem name={key} key={key}>
                        {value}
                      </InfoListItem>
                    ))}
                  </InfoListGroup>
                )}
                {!!executionParams.length && (
                  <InfoListGroup noPaddings title="Execution Parameters">
                    {executionParams.map(({ key, value }) => (
                      <InfoListItem name={key} key={key}>
                        {value}
                      </InfoListItem>
                    ))}
                  </InfoListGroup>
                )}
              </StyledFlex>
            </StyledFlex>
          )}
        </ExecutionParameters>
        <StyledFlex p="0 30px">
          <ExecutionLogsViewer logs={singleProcessHistory?.logs} />
        </StyledFlex>

        {/* PORTING CUSTOM ACTIONS TO SIDEBAR HEAD */}
        <Portal node={customActionsRef?.current}>
          <StyledFlex direction="row" gap="15px">
            {[processHistoryKeys.FAILED, processHistoryKeys.RESOLVED].includes(status) && (
              <StyledNewTabButton
                onClick={() => window.open(`${routes.FALLOUT_TICKETS}/${issueId}`, '_blank')}
                startIcon={<OpenInNewArrow />}
                variant="contained"
                primary
              >
                Open Fallout Ticket
              </StyledNewTabButton>
            )}

            <StyledLoadingButton
              variant="outlined"
              primary
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              transparent
            >
              Refresh
            </StyledLoadingButton>
          </StyledFlex>
        </Portal>
      </StyledFlex>
    </>
  );
};

export default ProcessExecutionInfo;
