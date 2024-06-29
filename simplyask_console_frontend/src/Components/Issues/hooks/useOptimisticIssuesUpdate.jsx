import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';

import { updateIssues } from '../../../Services/axios/issuesAxios';

export const SERVICE_TICKET_FIELDS_TYPE = {
  STATUS: 'status',
  PRIORITY: 'priority',
  ASSIGNEE: 'assignee',
  DUE_DATE: 'dueDate',
  DISPLAY_NAME: 'displayName',
  DESCRIPTION: 'description',
};

export const onTicketDetailsCustomUpdate = (ticketByIdQueryKey) => ({
  onCustomMutation: async ({ queryClient, data = {}, type }) => {
    await queryClient.cancelQueries({ queryKey: ticketByIdQueryKey });

    const { dueDate, newStatus, priority, name, assignedToUserId } = data;

    const currentData = queryClient.getQueryData(ticketByIdQueryKey);

    const newDataCopy = cloneDeep(currentData);

    if (type === SERVICE_TICKET_FIELDS_TYPE.STATUS) {
      newDataCopy.status = newStatus;
    }
    if (type === SERVICE_TICKET_FIELDS_TYPE.PRIORITY) {
      newDataCopy.priority = priority;
    }
    if (type === SERVICE_TICKET_FIELDS_TYPE.ASSIGNEE) {
      newDataCopy.assignedTo = {
        id: assignedToUserId,
        ...(name && { name }),
      };
    }
    if (type === SERVICE_TICKET_FIELDS_TYPE.DUE_DATE) {
      newDataCopy.dueDate = dueDate;
    }
    if (type === SERVICE_TICKET_FIELDS_TYPE.DISPLAY_NAME) {
      newDataCopy.displayName = data.displayName;
    }
    if (type === SERVICE_TICKET_FIELDS_TYPE.DESCRIPTION) {
      newDataCopy.description = data.description;
    }

    queryClient.setQueryData(ticketByIdQueryKey, newDataCopy);

    return { customMutationPrevData: currentData, customMutationNewData: newDataCopy };
  },
  customSettled: ({ queryClient }) => {
    queryClient.invalidateQueries({ queryKey: ticketByIdQueryKey });
  },
  customOnError: ({ queryClient, customMutationPrevData }) => {
    queryClient.setQueryData(ticketByIdQueryKey, customMutationPrevData);
  },
});

export const useOptimisticIssuesUpdate = ({
  queryKey,
  type,
  onCustomMutation,
  customSettled,
  customOnError,
  customOnSuccess,
  dismissOtherToasts,
  ignoreToasts = false,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (data) => updateIssues([data]),
    onMutate: async (data) => {
      const baseQueryKey = queryKey.slice(0, -1);

      let customMutationData = {};
      if (onCustomMutation) {
        customMutationData = await onCustomMutation({ data, queryClient, type });
      }

      await queryClient.cancelQueries({ queryKey });

      const currentData = queryClient.getQueryData(queryKey);

      let newDataCopy = cloneDeep(currentData);

      if (!currentData) {
        const queriesData = queryClient.getQueriesData({ queryKey: baseQueryKey, exact: false });

        const currentQueriesDataIndex = queriesData?.findIndex((queryData) => queryData[1] == null);
        const previousQueryKey = queriesData[currentQueriesDataIndex - 1][0];
        const lastSuccessfulQueryData = queryClient.getQueryData(previousQueryKey);

        newDataCopy = cloneDeep(lastSuccessfulQueryData);
      }

      let getIssueIndex;
      let updatedItem;

      const isArrayData = Array.isArray(newDataCopy?.content);

      if (isArrayData) {
        getIssueIndex = newDataCopy.content.findIndex((issue) => issue.id === data.issueId);

        updatedItem = { ...newDataCopy.content[getIssueIndex], isUpdating: true };
      } else {
        updatedItem = { ...newDataCopy };
      }

      if (type === SERVICE_TICKET_FIELDS_TYPE.STATUS) {
        updatedItem.status = data.newStatus;
      }
      if (type === SERVICE_TICKET_FIELDS_TYPE.PRIORITY) {
        updatedItem.priority = data.priority;
      }
      if (type === SERVICE_TICKET_FIELDS_TYPE.ASSIGNEE) {
        updatedItem.assignedTo = {
          id: data.assignedToUserId,
          ...(data?.name && { name: data.name }),
        };
      }
      if (type === SERVICE_TICKET_FIELDS_TYPE.DUE_DATE) {
        updatedItem.dueDate = data.dueDate;
      }
      if (type === SERVICE_TICKET_FIELDS_TYPE.DISPLAY_NAME) {
        updatedItem.displayName = data.displayName;
      }
      if (type === SERVICE_TICKET_FIELDS_TYPE.DESCRIPTION) {
        updatedItem.description = data.description;
      }

      isArrayData ? newDataCopy.content.splice(getIssueIndex, 1, updatedItem) : (newDataCopy = updatedItem);

      queryClient.setQueryData(queryKey, newDataCopy);

      return { prevData: currentData, newData: newDataCopy, ...customMutationData };
    },
    onSettled: () => {
      if (customSettled) {
        customSettled({ queryClient });
      }
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
    onSuccess: (data, variables, context) => {
      const [{ displayName }] = data;
      if (dismissOtherToasts) toast.dismiss();
      if (!ignoreToasts) {
        toast.success(`${displayName} has been updated successfully!`);
      }
      customOnSuccess?.(data, variables, context);
    },
    onError: (err, data, context) => {
      if (customOnError) {
        customOnError({ queryClient, customMutationPrevData: context?.customMutationPrevData });
      }
      // TODO: add toast error message
      // const [{ displayName }] = data;

      queryClient.setQueryData(queryKey, context.prevData);
    },
  });

  return { mutate, isLoading };
};
