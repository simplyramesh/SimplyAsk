import { useMutation } from '@tanstack/react-query';

import { deleteFileOrFolder } from '../../../Services/axios/filesAxios';

export const useDeleteFileById = ({ onSuccess, onError } = {}) => {
  const { mutate: deleteFileById, isLoading: isLoadingDeleteFileById } = useMutation({
    mutationFn: (id) => deleteFileOrFolder(id),
    onSuccess,
    onError,
  });

  return { deleteFileById, isLoadingDeleteFileById };
};
