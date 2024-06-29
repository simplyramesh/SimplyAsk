import { useMutation } from '@tanstack/react-query';
import { generateNewPhoneNumber } from '../../Services/axios/phoneNumberManagementAxios';

const useGenerateNewPhoneNumber = ({ onSuccess, onError, onSettled }) => {
  const { mutate: generatePhoneNumber, isPending: isPhoneNumberGenerating } = useMutation({
    mutationFn: (payload) => generateNewPhoneNumber(payload.countryCode, payload.provinceCode, payload.areaCode),
    onSuccess,
    onError,
    onSettled,
  });
  return {
    generatePhoneNumber,
    isPhoneNumberGenerating,
  };
};

export default useGenerateNewPhoneNumber;
