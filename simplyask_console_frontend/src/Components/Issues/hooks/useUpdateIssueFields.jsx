import { toast } from 'react-toastify';

import { useCreateActivity } from '../../../hooks/activities/useCreateActivitiy';
import { useSaveIssues } from '../../../hooks/issue/useSaveIssues';

export const useUpdateIssueFields = ({ onSuccessParam } = {}) => {
  const { saveIssues, isUpdateIssueLoading, isUpdateIssuePending } = useSaveIssues({
    onSuccess: ({ data }) => {
      let message = '';

      if (Array.isArray(data)) {
        message = `${data.length || ''} Service Ticket${data.length > 1 ? 's': ''} have been updated successfully!`;
        toast.success(message);
      } else {
        message = `${data.displayName} has been created successfully!`;
        toast.success(message);
      }

      onSuccessParam?.({ data });
    },
  });

  const { createStatusChangedActivity, createAssignedActivity, createUnassignedActivity } = useCreateActivity({
    ignoreToasts: true,
  });
  const handleUpdate = ({ issue, fields = {} }) => {
    saveIssues([
      {
        dueDate: issue.dueDate,
        issueId: issue.id,
        assignedToUserId: issue.assignedTo?.id || null,
        ...fields,
      },
    ]);
  };

  const handleStatusUpdate = ({ issue, status, actionUserId }) => {
    handleUpdate({
      issue,
      fields: {
        issueStatusId: status.value,
      },
    });

    createStatusChangedActivity({
      issueId: issue.id,
      oldStatus: issue.status.toUpperCase(),
      newStatus: status.label.toUpperCase(),
      userId: actionUserId,
    });
  };

  const handlePriorityUpdate = ({ issue, priority }) => {
    handleUpdate({
      issue,
      fields: {
        priority: priority.value,
      },
    });
  };

  const handleAssigneeUpdate = ({ issue, user, actionUserId }) => {
    handleUpdate({
      issue,
      fields: {
        assignedToUserId: user?.value.id || null,
      },
    });

    if (user) {
      createAssignedActivity({
        assignedFromId: issue.assignedTo?.id,
        assignedToId: user.value.id,
        assignedToName: user.label,
        issueId: issue.id,
        userId: actionUserId,
      });
    } else {
      createUnassignedActivity({
        issueId: issue.id,
        assignedFromId: issue.assignedTo?.id,
        userId: actionUserId,
      });
    }
  };

  const handleDueDateUpdate = ({ issue, dueDate }) => {
    handleUpdate({
      issue,
      fields: {
        dueDate,
      },
    });
  };

  const handleDescriptionUpdate = ({ issue, description }) => {
    handleUpdate({
      issue,
      fields: {
        description,
      },
    });
  };

  const handleDisplayNameUpdate = ({ issue, displayName }) => {
    handleUpdate({
      issue,
      fields: {
        displayName,
      },
    });
  };

  return {
    handleStatusUpdate,
    handlePriorityUpdate,
    handleAssigneeUpdate,
    handleDueDateUpdate,
    handleDescriptionUpdate,
    handleDisplayNameUpdate,
    saveIssues,
    isUpdateIssueLoading,
    isUpdateIssuePending,
  };
};
