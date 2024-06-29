import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useEntityCreateDelete = ({
  createFn,
  deleteFn,
  editFn,
  invalidateQueryKey,
  successCreateMessage,
  successDeleteMessage,
  successEditMessage,
  onCreateSuccess,
  onDeleteSuccess,
  onEditSuccess,
  onCreateError,
  onDeleteError,
  onEditError,
}) => {
  const queryClient = useQueryClient();

  const { mutate: createEntity, isPending: isCreateLoading } = useMutation({
    mutationFn: (values) => createFn(values),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });

      toast.success(successCreateMessage({ data, variables }));

      onCreateSuccess?.();
    },
    onError: () => {
      toast.error('Something went wrong');

      onCreateError?.();
    },
  });

  const { mutate: deleteEntity, isPending: isDeleteLoading } = useMutation({
    mutationFn: (item) => deleteFn(item.id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });

      toast.success(successDeleteMessage({ data, variables }));

      onDeleteSuccess?.();
    },
    onError: () => {
      toast.error('Something went wrong');

      onDeleteError?.();
    },
  });

  const { mutate: editEntity, isPending: isEditLoading } = useMutation({
    mutationFn: ({ id, body }) => editFn(id, body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });

      toast.success(successEditMessage({ data, variables }));

      onEditSuccess?.({ data, variables });
    },
    onError: (error) => {
      console.log(error);
      toast.error('Something went wrong');

      onEditError?.();
    },
  });

  return {
    createEntity,
    deleteEntity,
    editEntity,
    isCreateLoading,
    isDeleteLoading,
    isEditLoading,
  };
};
