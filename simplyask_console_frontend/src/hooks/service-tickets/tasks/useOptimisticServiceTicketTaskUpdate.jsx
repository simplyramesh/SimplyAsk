import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';
import { updateIssues } from '../../../Services/axios/issuesAxios';

const useOptimisticServiceTicketTaskUpdate = ({ onSuccess, onError, queryKey, onSettled, dismissOtherToasts } = {}) => {
  const queryClient = useQueryClient();

  const {
    mutate: updateServiceTicketTask,
    mutateAsync: updateServiceTicketTaskAsync,
    isPending: isServiceTicketTaskUpdateLoading,
  } = useMutation({
    mutationFn: ({ task, assignedTo, assignedBy, issueStatusId, resolvedBy, displayName, description }) => {
      const assignedToUserId = assignedTo || assignedTo === null ? assignedTo : task.assignedTo?.id || null;

      const payload = {
        issueId: task.id,
        assignedToUserId,
        ...(issueStatusId && { issueStatusId }),
        ...((resolvedBy || resolvedBy === null) && { resolvedBy }),
        ...(assignedBy ? { assignedByUserId: assignedBy } : {}),
        ...(displayName ? { displayName } : {}),
        ...(description ? { description } : {}),
      };

      return updateIssues([payload]);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData(queryKey);
      const newPreviousTasks = cloneDeep(previousTasks);
      const taskIndex = [].concat(newPreviousTasks?.content).findIndex((task) => task.id === data.task.id);

      if (taskIndex > -1) {
        newPreviousTasks.content[taskIndex] = { ...newPreviousTasks.content[taskIndex], isUpdating: true };
      }

      queryClient.setQueryData(queryKey, newPreviousTasks);

      return { previousTasks, updatedTask: newPreviousTasks.content[taskIndex] };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context.previousTasks);
      toast.error('Creating Service Ticket Task error');
      onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      // const [{ displayName }] = data; // NOTE: This may need to be updated

      if (dismissOtherToasts) toast.dismiss();
      // toast.success(`${displayName} has been updated successfully!`);

      onSuccess?.(data, variables, context);
    },
    onSettled: () => {
      onSettled?.({ queryClient });

      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  return {
    updateServiceTicketTask,
    updateServiceTicketTaskAsync,
    isServiceTicketTaskUpdateLoading,
  };
};

export default useOptimisticServiceTicketTaskUpdate;
