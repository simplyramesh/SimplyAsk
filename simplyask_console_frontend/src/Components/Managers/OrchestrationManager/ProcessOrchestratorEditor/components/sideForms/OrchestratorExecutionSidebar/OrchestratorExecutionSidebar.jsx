import React, { useState } from 'react';
import { formatDistanceStrict, formatDistanceToNowStrict } from 'date-fns';
import { StyledExpandButton, StyledFlex, StyledStatus, StyledText } from '../../../../../../shared/styles/styled';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { StyledFlowSidebar, StyledFlowSidebarInner } from '../../../../../shared/components/StyledFlowSidebar';
import InfoListItem from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import InfoListGroup from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import useOrchestratorExecutionById from '../../../../../../../hooks/orchestrator/useOrchestratorExecutionById';
import { MODES } from '../../../constants/config';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { orchestratorMode, orchestratorStepDetailsOpened } from '../../../store';
import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';
import { BASE_DATE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../../../../utils/timeUtil';
import {
  ORCHESTRATOR_GROUP_EXECUTIONS_STATUS_COLOR_MAP,
  EXECUTIONS_STATUS_MAP,
  EXECUTIONS_STATUSES,
} from '../../../../ProcessOrchestratorDetails/constants/initialValues';
import Spinner from '../../../../../../shared/Spinner/Spinner';

const OrchestratorExecutionSidebar = () => {
  const { processId, executingId } = useParams();
  const [open, setOpen] = useState(true);
  const mode = useRecoilValue(orchestratorMode);
  const stepItemOpened = useRecoilValue(orchestratorStepDetailsOpened);
  const { currentUser } = useGetCurrentUser();

  const { orchestratorExecution, isOrchestratorExecutionFetching } = useOrchestratorExecutionById({
    id: processId,
    executingId,
    enabled: mode === MODES.HISTORY,
    refetchInterval: (query) =>
      query.state?.data?.status === EXECUTIONS_STATUSES.EXECUTING && !stepItemOpened ? 10000 : false,
  });

  const { groupExecutionId, status, createdAt, updatedAt, startJobName } = orchestratorExecution || {};

  const duration =
    status === EXECUTIONS_STATUSES.EXECUTING
      ? createdAt && formatDistanceToNowStrict(new Date(createdAt))
      : createdAt && updatedAt && formatDistanceStrict(new Date(createdAt), new Date(updatedAt));

  return (
    <StyledFlowSidebar open={open} width="480px">
      {isOrchestratorExecutionFetching && <Spinner parent fadeBgParent />}
      <StyledExpandButton open={open} onClick={() => setOpen(!open)} top="50%" right="100%">
        {open ? <KeyboardArrowRightRoundedIcon /> : <KeyboardArrowLeftRoundedIcon />}
      </StyledExpandButton>

      <StyledFlowSidebarInner>
        <StyledFlex p="30px 20px">
          <InfoListGroup title="Orchestration Details" noPaddings>
            <InfoListItem name="Execution ID">#{groupExecutionId}</InfoListItem>
            <InfoListItem name="Status">
              {status ? (
                <StyledStatus color={ORCHESTRATOR_GROUP_EXECUTIONS_STATUS_COLOR_MAP[status]}>
                  {EXECUTIONS_STATUS_MAP[status]}
                </StyledStatus>
              ) : (
                <StyledStatus color={ORCHESTRATOR_GROUP_EXECUTIONS_STATUS_COLOR_MAP[EXECUTIONS_STATUSES.PREPARING]}>
                  {EXECUTIONS_STATUS_MAP[EXECUTIONS_STATUSES.PREPARING]}
                </StyledStatus>
              )}
            </InfoListItem>
            <InfoListItem name="Starting Step">{startJobName || 'Start Execution'}</InfoListItem>
            <InfoListItem name="Start Time">
              {getInFormattedUserTimezone(createdAt, currentUser?.timezone, BASE_DATE_TIME_FORMAT)}
            </InfoListItem>
            <InfoListItem name="End Time">
              {[EXECUTIONS_STATUSES.EXECUTING, EXECUTIONS_STATUSES.PREPARING].includes(status) ? (
                <StyledFlex>
                  <StyledText textAlign="right">To Be Determined</StyledText>
                  <StyledText textAlign="right">(Executing)</StyledText>
                </StyledFlex>
              ) : (
                getInFormattedUserTimezone(updatedAt, currentUser?.timezone, BASE_DATE_TIME_FORMAT)
              )}
            </InfoListItem>
            <InfoListItem name="Duration">{duration}</InfoListItem>
          </InfoListGroup>
        </StyledFlex>
      </StyledFlowSidebarInner>
    </StyledFlowSidebar>
  );
};

export default OrchestratorExecutionSidebar;
