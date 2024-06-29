import { useMutation } from '@tanstack/react-query';
import { movePhoneNumberAxios } from '../../Services/axios/phoneNumberManagementAxios';

const useUpdatePhoneNumber = ({ onError, onSuccess } = {}) => {
  const { mutate: movePhoneNumber, isPending: isPhoneNumberMoving } = useMutation({
    mutationFn: (body) => movePhoneNumberAxios(body),
    onSuccess,
    onError,
  });

  return { movePhoneNumber, isPhoneNumberMoving };
};

export default useUpdatePhoneNumber;
