import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PHONE_NUMBER_MANAGEMENT_QUERY_KEYS } from '../../Components/Settings/Components/FrontOffice/constants/common';
import { deletePhoneNumberAxios } from '../../Services/axios/phoneNumberManagementAxios';

const useDeletePhoneNumber = ({ onError, onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: deletePhoneNumberMutate, isPending: isPhoneNumberDeleting } = useMutation({
    mutationFn: (phoneNumberId) => deletePhoneNumberAxios(phoneNumberId),
    onSuccess: (data, variables) => {
      onSuccess?.({ data, variables });
    },
    onError,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_TELEPHONE_INFO] }),
  });

  return { deletePhoneNumberMutate, isPhoneNumberDeleting };
};

export default useDeletePhoneNumber;
