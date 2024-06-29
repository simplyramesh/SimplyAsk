import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { ISSUES_QUERY_KEYS } from '../../Components/Issues/constants/core';
import {
  createIssue,
  deleteIssues,
  updateIssues,
  updateIssuesAdditionalFields,
  updateIssuesParameterGroups,
  updateIssuesRelatedEntities,
} from '../../Services/axios/issuesAxios';

export const useIssuesCUD = ({
  invalidateQueryKeys = [],
  successCreateMessage,
  successDeleteMessage,
  successUpdateIssueMessage,
  onUpdateIssueRelatedEntities,
  onUpdateIssueParameterGroups,
  onUpdateIssueAdditionalFields,
  onCreateSuccess,
  onDeleteSuccess,
  onUpdateIssueSuccess,
  onCreateError,
  onDeleteError,
  onUpdateError,
} = {}) => {
  const queryClient = useQueryClient();
  const queryKeys = Array.isArray(invalidateQueryKeys) ? invalidateQueryKeys : [invalidateQueryKeys];

  const { mutate: createIssueFn, isLoading: isCreateLoading } = useMutation({
    mutationFn: (body) => createIssue(body),
    onSuccess: (data, variables) => {
      queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS] }));

      toast.success(successCreateMessage({ data, variables }));

      onCreateSuccess?.();
    },
    onError: () => {
      toast.error('Something went wrong');

      onCreateError?.();
    },
  });

  const { mutate: deleteIssue, isPending: isDeleteLoading } = useMutation({
    mutationFn: (ids) => {
      const body = Array.isArray(ids) ? ids : [ids];

      return deleteIssues(body);
    },
    onSuccess: (data, variables) => {
      queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey: [queryKey] }));

      toast.success(successDeleteMessage?.({ data, variables }));

      onDeleteSuccess?.();
    },
    onError: (er) => {
      console.log(er);
      toast.error('Something went wrong');

      onDeleteError?.();
    },
  });

  const {
    mutate: updateIssue,
    mutateAsync: updateIssueAsync,
    isPending: isUpdateIssueLoading,
  } = useMutation({
    mutationFn: (body) => updateIssues([body]),
    onSuccess: (data, variables) => {
      queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey: [queryKey] }));

      toast.success(successUpdateIssueMessage({ data, variables }));

      onUpdateIssueSuccess?.({ data, variables });
    },
    onError: () => {
      toast.error('Something went wrong');

      onUpdateError?.();
    },
  });

  const { mutate: updateIssueRelatedEntities, isLoading: isUpdateIssueRelatedEntitiesLoading } = useMutation({
    mutationFn: ({ params, payload }) => updateIssuesRelatedEntities(params, payload), // params = { issueId }
    onSuccess: (data, variables) => {
      queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey: [queryKey] }));

      toast.success(successUpdateIssueMessage({ data, variables }));

      onUpdateIssueRelatedEntities?.({ data, variables });
    },
    onError: () => {
      toast.error('Something went wrong');

      onUpdateError?.();
    },
  });

  const { mutate: updateIssueParameterGroups, isLoading: isUpdateIssueParameterGroupsLoading } = useMutation({
    mutationFn: ({ params, payload }) => updateIssuesParameterGroups(params, payload), // params = { issueId }
    onSuccess: (data, variables) => {
      queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey: [queryKey] }));

      toast.success(successUpdateIssueMessage({ data, variables }));

      onUpdateIssueParameterGroups?.({ data, variables });
    },
    onError: () => {
      toast.error('Something went wrong');

      onUpdateError?.();
    },
  });

  const { mutate: updateIssueAdditionalFields, isLoading: isUpdateIssueAdditionalFieldsLoading } = useMutation({
    mutationFn: ({ params, payload }) => updateIssuesAdditionalFields(params, payload), // params = { issueId }
    onSuccess: (data, variables) => {
      queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey: [queryKey] }));

      toast.success(successUpdateIssueMessage({ data, variables }));

      onUpdateIssueAdditionalFields?.({ data, variables });
    },
    onError: () => {
      toast.error('Something went wrong');

      onUpdateError?.();
    },
  });

  return {
    createIssue: createIssueFn,
    deleteIssue,
    updateIssue,
    updateIssueAsync,
    updateIssueRelatedEntities,
    updateIssueParameterGroups,
    updateIssueAdditionalFields,
    isUpdateIssueAdditionalFieldsLoading,
    isUpdateIssueParameterGroupsLoading,
    isUpdateIssueRelatedEntitiesLoading,
    isCreateLoading,
    isDeleteLoading,
    isUpdateIssueLoading,
  };
};
