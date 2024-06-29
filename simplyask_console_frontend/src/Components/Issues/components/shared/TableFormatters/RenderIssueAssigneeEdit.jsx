import { useCreateActivity } from '../../../../../hooks/activities/useCreateActivitiy';
import { UserAutocompleteWithAvatar } from '../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import { SERVICE_TICKET_FIELDS_TYPE, useOptimisticIssuesUpdate } from '../../../hooks/useOptimisticIssuesUpdate';
import { getDefaultUserOption } from '../../FalloutTickets/utils/helpers';

const RenderIssueAssigneeEdit = ({ table, row }) => {
  const { key, user } = table.options.meta;
  const { createAssignedActivity, createUnassignedActivity } = useCreateActivity();
  const defaultOptions = getDefaultUserOption(row.original);
  const issue = row.original;

  const { mutate } = useOptimisticIssuesUpdate({
    queryKey: key,
    type: SERVICE_TICKET_FIELDS_TYPE.ASSIGNEE,
    customOnSuccess: (data) => {
      const res = data[0];
      res?.assignedTo
        ? createAssignedActivity({
            assignedFromId: issue?.assignedTo?.id,
            assignedToId: res?.assignedTo?.id,
            assignedToName: res?.assignedTo?.name,
            issueId: res?.id,
            userId: user.id,
          })
        : createUnassignedActivity({
            issueId: res?.id,
            assignedFromId: issue?.assignedTo?.id,
            userId: user.id,
          });
    },
  });

  const handleAssigneeChange = (user) => {
    mutate({
      dueDate: issue.dueDate,
      issueId: issue.id,
      assignedToUserId: user?.value.id || null,
      ...(user?.value.id && { name: `${user?.value?.firstName} ${user?.value?.lastName}` }),
    });

    if (user !== null) {
      table.setEditingCell(null);
    }
  };

  return (
    <UserAutocompleteWithAvatar
      defaultMenuIsOpen
      autoFocus
      placeholder="Unassigned"
      defaultOptions={defaultOptions}
      value={defaultOptions?.[0]}
      onChange={handleAssigneeChange}
      onBlur={() => table.setEditingCell(null)}
      borderRadius="10px"
    />
  );
};

export default RenderIssueAssigneeEdit;
