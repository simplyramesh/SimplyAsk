import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { ISSUE_ACTIVITY_TYPE } from '../../Components/Issues/constants/core';
import { createActivity } from '../../Services/axios/activitiesAxios';

import { GET_ACTIVITIES_QUERY_KEY } from './useGetActivities';

export const generateCommentActivityPayload = (issueId, comment, userId) => ({
  issue: {
    id: issueId,
  },
  relatedIssueId: issueId,
  reason: ISSUE_ACTIVITY_TYPE.COMMENT,
  type: ISSUE_ACTIVITY_TYPE.COMMENT,
  oldValue: '',
  newValue: comment,
  mentionedUserIds: [userId],
  users: [],
});

export const useCreateActivity = ({ ignoreToasts = false } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: createIssueActivity, isPending: isFalloutLoading } = useMutation({
    mutationFn: async (params) => createActivity(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ACTIVITIES_QUERY_KEY] });

      if (!ignoreToasts) {
        // toast.success('Activity created successfully');
      }
    },
    onError: () => {
      if (!ignoreToasts) {
        toast.error('Error creating activity');
      }
    },
  });

  const createCommentActivity = (issueId, comment, userId) => createIssueActivity(generateCommentActivityPayload(issueId, comment, userId));

  const createStatusChangedActivity = ({
    issueId, oldStatus, newStatus, userId,
  }) => createIssueActivity({
    relatedIssueId: issueId,
    reason: 'STATUS_CHANGED',
    type: 'HISTORY',
    oldValue: oldStatus,
    newValue: newStatus,
    mentionedUserIds: [userId],
    users: [],
  });

  const createAssignedActivity = ({
    issueId, assignedToName, assignedToId, assignedFromId, userId,
  }) => {
    const mentionedUserIds = Array.from(new Set([assignedFromId, assignedToId, userId])).filter(Boolean);

    return createIssueActivity({
      relatedIssueId: issueId,
      reason: 'ASSIGNED',
      type: 'HISTORY',
      oldValue: assignedFromId,
      newValue: assignedToName,
      mentionedUserIds,
      users: [],
    });
  };

  const createUnassignedActivity = ({ issueId, assignedFromId, userId }) => createIssueActivity({
    relatedIssueId: issueId,
    reason: 'UNASSIGNED',
    type: 'HISTORY',
    oldValue: assignedFromId,
    newValue: null,
    mentionedUserIds: assignedFromId && assignedFromId === userId ? [userId] : [userId, assignedFromId],
    users: [],
  });

  const createActionPerformedActivity = ({
    issueId, newValue, oldValue, userId,
  }) => createIssueActivity({
    relatedIssueId: issueId,
    reason: 'ACTION_PERFORMED',
    type: 'HISTORY',
    oldValue,
    newValue,
    mentionedUserIds: [userId],
    users: [],
  });

  return {
    createIssueActivity,
    createCommentActivity,
    createAssignedActivity,
    createUnassignedActivity,
    createStatusChangedActivity,
    createActionPerformedActivity,
    isFalloutLoading,
  };
};
