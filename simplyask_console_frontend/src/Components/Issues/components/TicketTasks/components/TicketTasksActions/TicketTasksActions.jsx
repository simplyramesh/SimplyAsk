import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ActionsPopover from '../../../../../shared/REDISIGNED/popovers/ActionsPopover/ActionsPopover';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { ISSUE_SERVICE_TICKET_TASKS_STATUSES } from '../../../../constants/core';

const TicketTasksActions = ({ onCompleteTask, onRevertTaskAction, task, serviceTaskTypes }) => {
  const { additionalFields, issueType } = task;

  const type = serviceTaskTypes?.find((taskType) => taskType.name === issueType);
  const actions = type?.actions || [];

  const completeStatus = type?.statuses.find((status) =>
    [ISSUE_SERVICE_TICKET_TASKS_STATUSES.COMPLETE].includes(status.name)
  );
  const incompleteStatus = type?.statuses.find((status) =>
    [ISSUE_SERVICE_TICKET_TASKS_STATUSES.PENDING_ACTION, ISSUE_SERVICE_TICKET_TASKS_STATUSES.INCOMPLETE].includes(
      status.name
    )
  );

  if (additionalFields.actionPerformed) {
    return (
      <StyledFlex alignItems="flex-start" gap="4px 0">
        <StyledText size={15} weight={400} lh={20} textAlign="left" ml={3}>
          Action Was Performed
        </StyledText>
        <StyledButton variant="text" onClick={() => onRevertTaskAction(task, incompleteStatus?.id)}>
          <StyledText weight={500} themeColor="linkColor" lh={17} wrap="nowrap" textAlign="left">
            {`Revert Task to "${ISSUE_SERVICE_TICKET_TASKS_STATUSES.PENDING_ACTION}"`}
          </StyledText>
        </StyledButton>
      </StyledFlex>
    );
  }

  return (
    <ActionsPopover
      actions={actions}
      buttonTitle="Review"
      menuWidth="163px"
      onActionClick={(actionId) => {
        const action = actions.find((action) => action.id === actionId);
        const issueTypeStatus = type?.statuses.find((status) => status.name.includes(action?.name)) || completeStatus;

        onCompleteTask({
          action,
          task,
          issueStatusId: issueTypeStatus.id,
        });
      }}
    />
  );
};

export default TicketTasksActions;
