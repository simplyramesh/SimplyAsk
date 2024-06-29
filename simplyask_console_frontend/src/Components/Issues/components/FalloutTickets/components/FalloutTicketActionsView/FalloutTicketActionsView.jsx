import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import {
  generateCommentActivityPayload,
  useCreateActivity
} from '../../../../../../hooks/activities/useCreateActivitiy';
import {
  GET_FALLOUT_TICKET_BY_INCIDENT_ID,
  useFalloutDetails
} from '../../../../../../hooks/fallout/useFalloutDetails';
import { useProcessParams } from '../../../../../../hooks/fallout/useFalloutParams';
import useFalloutRetry from '../../../../../../hooks/fallout/useFalloutRetry';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { getFalloutTicketsStatuses } from '../../../../../../store/selectors';
import BaseTextArea from '../../../../../shared/REDISIGNED/controls/BaseTextArea/BaseTextArea';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import SearchBar from '../../../../../shared/SearchBar/SearchBar';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import FalloutProcessEditor from '../../../../../WorkflowEditor/FalloutProcessEditor';
import { STATUS_CONSTANTS } from '../../constants/constants';

import ActionsExecutionSection from './components/ActionsExecutionSection/ActionsExecutionSection';
import { StyledActionsExecutionFilters } from './components/ActionsExecutionSection/StyledActionsExecutionSection';
import ExecutionParameterItem from './components/ExecutionParameterItem/ExecutionParameterItem';
import ParametersHistory from './components/ParametersHistory/ParametersHistory';
import ExecutionStatus from './ExecutionStatus';
// TODO: update to real data
import { useGetExecutionHeaders } from '../../../../../../hooks/process/useProcessDefinitionExecutionHeaders';
import {
  onTicketDetailsCustomUpdate,
  SERVICE_TICKET_FIELDS_TYPE,
  useOptimisticIssuesUpdate
} from '../../../../hooks/useOptimisticIssuesUpdate';
import {
  ActionsExecutionSectionContent,
  ActionsExecutionSectionItem,
  StyledActionsDiagram,
  StyledActionsExecution,
  StyledActionsView
} from './StyledFalloutTicketActionsView';
import { getInitialParameters, revertAllParameters, revertParameterItem, updateParameterItem } from './utils/helpers';

const FalloutTicketActionsView = ({ ticket }) => {
  const queryClient = useQueryClient();
  const initialRenderRef = useRef(0);

  const relatedProcessEntity = ticket?.relatedEntities?.find((entity) => entity.type === 'PROCESS');

  const procInstanceId = relatedProcessEntity?.relatedEntity?.procInstanceId;
  const processName = relatedProcessEntity?.relatedEntity?.projectName;

  const [forceResolveModal, setForceResolveModal] = useState(false);
  const [retryExecutionModal, setRetryExecutionModal] = useState(false);
  const [retryExecutionComment, setRetryExecutionComment] = useState('');
  const [revertParametersModal, setRevertParametersModal] = useState(false);

  const [oldStatusValue, setOldStatusValue] = useState();

  const [executionParameters, setExecutionParameters] = useState([]);

  const [searchCriteria, setSearchCriteria] = useState('');

  const [isRetriedTicket, setIsRetriedTicket] = useState(false);

  const { currentUser } = useGetCurrentUser();

  const { falloutTicketDetails, isLoading: isFalloutTicketLoading } = useFalloutDetails({
    incidentId: ticket?.id,
    timezone: currentUser?.timezone,
  });

  useEffect(() => {
    if (falloutTicketDetails && initialRenderRef.current === 0) {
      setOldStatusValue(falloutTicketDetails.status);
      initialRenderRef.current++;
    }
  }, [falloutTicketDetails]);

  const { processParams } = useProcessParams({ procInstanceId });

  const { dataHeaderColumns: validationFields } = useGetExecutionHeaders({
    pathVariable: processName,
    options: {
      enabled: !!processName,
      select: (data) => {
        const mergedProcessParams = getInitialParameters(processParams);

        return data?.data?.reduce((acc, item) => {
          const paramValue = mergedProcessParams.find((param) => param.title === item.fieldName);
          if (paramValue) {
            return [
              ...acc,
              { ...paramValue, ...item, dataType: item.fieldValidationType.split('_').join(' ').toLowerCase() },
            ];
          }
          return acc;
        }, []);
      },
    },
  });

  const { updateVariables, restart, isRestartLoading } = useFalloutRetry(procInstanceId, {
    onRestartSuccess: () => {
      toast.success('Fallout ticket was retried');

      queryClient.invalidateQueries({
        queryKey: [GET_FALLOUT_TICKET_BY_INCIDENT_ID],
      });

      setRetryExecutionModal(false);
      setIsRetriedTicket(true);
    },
    onRestartError: () => {
      toast.error('Something went wrong!');
    },
  });

  const { createStatusChangedActivity } = useCreateActivity();

  const { mutate: handleStatusUpdate } = useOptimisticIssuesUpdate({
    queryKey: [GET_FALLOUT_TICKET_BY_INCIDENT_ID, ticket?.id],
    type: SERVICE_TICKET_FIELDS_TYPE.STATUS,
    ...onTicketDetailsCustomUpdate([GET_FALLOUT_TICKET_BY_INCIDENT_ID, ticket?.id]),
    customOnSuccess: (data) => {
      createStatusChangedActivity({
        issueId: ticket?.id,
        oldStatus: oldStatusValue,
        newStatus: data[0].status,
        userId: currentUser?.id,
      });

      setOldStatusValue(data[0].status);
    },
  });

  const falloutTicketStatuses = useRecoilValue(getFalloutTicketsStatuses);

  const isResolvedTicket =
    falloutTicketDetails?.status === STATUS_CONSTANTS.RESOLVED ||
    falloutTicketDetails?.status === STATUS_CONSTANTS.FORCE_RESOLVED;

  const isEditable = !isResolvedTicket && !isRetriedTicket;

  const hasModifications = isEditable && executionParameters.some((item) => item.currentValue !== item.initialValue);

  const changedParams = executionParameters.filter((item) => item.currentValue !== item.initialValue);

  const processId = ticket?.workflowId;

  useEffect(() => {
    if (validationFields) {
      setExecutionParameters(validationFields);
    }
  }, [validationFields]);

  const forceResolveTicket = async () => {
    const forceResolvedStatus = falloutTicketStatuses.find((status) => status.name === STATUS_CONSTANTS.FORCE_RESOLVED);

    handleStatusUpdate({
      dueDate: ticket?.dueDate,
      issueId: ticket?.id,
      assignedToUserId: ticket?.assignedTo?.id || null,
      issueStatusId: forceResolvedStatus?.id,
      newStatus: forceResolvedStatus?.name,
    });

    setForceResolveModal(false);
  };

  const retryExecution = async (comment) => {
    try {
      const body = executionParameters.reduce((acc, param) => {
        const key = param.isRequest ? `REQUEST_PARAM.${param.title}` : param.title;
        acc[key] = { value: param.currentValue };

        return acc;
      }, {});

      await updateVariables(body);

      const restartPayload = generateCommentActivityPayload(ticket?.id, comment, currentUser?.id);

      restart(restartPayload);
    } catch {
      toast.error('Something went wrong!');
    }
  };

  const updateExecutionParameter = (id, value) => {
    setExecutionParameters(updateParameterItem(executionParameters, id, value));
  };

  const revertExecutionParameter = (item) => {
    setExecutionParameters(revertParameterItem(executionParameters, item.id));
  };

  const revertAllExecutionParameter = () => {
    setExecutionParameters(revertAllParameters(executionParameters));
    setRevertParametersModal(false);
  };

  const executionParametersActions = () =>
    isEditable ? (
      <StyledFlex direction="row" gap="16px">
        <StyledButton
          primary
          variant="outlined"
          onClick={() => setForceResolveModal(true)}
          startIcon={<CustomTableIcons icon="ASSIGNMENT_TURNED" width={26} margin="0 10px 0 0" />}
        >
          Force Resolve
        </StyledButton>
        <StyledButton
          primary
          variant="outlined"
          onClick={() => setRetryExecutionModal(true)}
          startIcon={<CustomTableIcons icon="REPLAY" width={26} margin="0 10px 0 0" turnAround />}
        >
          Retry Execution
        </StyledButton>
      </StyledFlex>
    ) : (
      <StyledFlex alignItems="end">
        <StyledText size={16} lh={22} weight={600}>
          Action Performed
        </StyledText>
        <StyledText size={13} lh={18}>
          {(isResolvedTicket && 'Marked as Resolved') || (isRetriedTicket && 'Retried Execution')}
        </StyledText>
      </StyledFlex>
    );

  const isLoading = isFalloutTicketLoading || isRestartLoading;

  return (
    <StyledActionsView>
      {isLoading && <Spinner fadeBgParentFixedPosition />}
      {processId && procInstanceId && (
        <StyledActionsDiagram>
          <FalloutProcessEditor processId={processId} processInstanceId={procInstanceId} />
        </StyledActionsDiagram>
      )}
      <StyledActionsExecution>
        <ActionsExecutionSection title="Execution Status" width="373px" headerHeight="58px" headerPadding="9px 22px">
          <Scrollbars autoHide style={{ height: '100%' }}>
            <ExecutionStatus ticket={falloutTicketDetails} />
          </Scrollbars>
        </ActionsExecutionSection>

        <ActionsExecutionSection
          title="Execution Parameters"
          headerHeight="58px"
          headerPadding="9px 22px"
          headerAction={executionParametersActions()}
        >
          <Scrollbars autoHide style={{ height: '100%' }}>
            <StyledActionsExecutionFilters
              p="5px 10px"
              direction="row"
              justifyContent="space-between"
              gap="16px"
              alignItems="center"
            >
              <SearchBar
                placeholder="Search Execution Parameters"
                onChange={(e) => setSearchCriteria(e.target.value)}
                maxWidth="310px"
              />
              {hasModifications && (
                <StyledButton variant="text" onClick={() => setRevertParametersModal(true)}>
                  View / Revert Modifications
                </StyledButton>
              )}
            </StyledActionsExecutionFilters>
            <ActionsExecutionSectionContent>
              {executionParameters
                .filter((item) => item?.title.toLowerCase().includes(searchCriteria.toLowerCase()))
                .sort((a, b) => a?.title.localeCompare(b?.title))
                .map((item, index) => (
                  <ActionsExecutionSectionItem key={index}>
                    <ExecutionParameterItem
                      item={item}
                      isEditable={isEditable}
                      handleUpdate={updateExecutionParameter}
                    />
                  </ActionsExecutionSectionItem>
                ))}
            </ActionsExecutionSectionContent>
          </Scrollbars>
        </ActionsExecutionSection>
      </StyledActionsExecution>

      {/* Confirmation Mark As Resolved Modal */}
      <ConfirmationModal
        isOpen={forceResolveModal}
        onCloseModal={() => setForceResolveModal(false)}
        onSuccessClick={forceResolveTicket}
        successBtnText="Force Resolve"
        alertType="WARNING"
        title="Mark As Force Resolved?"
        text={`You are about to force resolve the ${ticket?.displayName}`}
      />

      {/* Confirmation Retry Execution Modal */}
      <ConfirmationModal
        isLoading={isRestartLoading}
        isOpen={retryExecutionModal}
        onCloseModal={() => setRetryExecutionModal(false)}
        onSuccessClick={() => retryExecution(retryExecutionComment)}
        isSuccessBtnDisabled={!retryExecutionComment.length}
        successBtnHint="In order to Confirm, please add a comment above."
        successBtnHintIfDisabled
        alertType="WARNING"
        title="Are You Sure?"
        text="You are about to Retry Execution. To proceed, please leave a brief comment describing your action in order to confirm. This action cannot be reversed."
      >
        <StyledFlex direction="column" flex="auto" width="100%">
          <InputLabel label="Comment" />
          <BaseTextArea
            id="comment"
            name="comment"
            placeholder="Add a comment..."
            value={retryExecutionComment}
            onChange={(event) => setRetryExecutionComment(event.target.value)}
            rows="3"
          />
        </StyledFlex>
      </ConfirmationModal>

      {/* SideModal of Parameters History */}
      <CustomSidebar
        open={revertParametersModal}
        onClose={() => setRevertParametersModal(false)}
        headStyleType="filter"
        disableCustomScroll
      >
        {() =>
          revertParametersModal && (
            <ParametersHistory
              history={changedParams}
              revertItem={(id) => revertExecutionParameter(id)}
              revertAll={revertAllExecutionParameter}
            />
          )
        }
      </CustomSidebar>
    </StyledActionsView>
  );
};

export default FalloutTicketActionsView;
