import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setOrganizationDetails } from '../../../../../Services/axios/authAxios';
import { GET_ORGANIZATION_DETAILS } from './useGetOrgDetails';

const useUpdateOrgDetails = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate: updateOrganizationDetails, isPending: isUpdateOrganizationDetailsLoading } = useMutation({
    mutationFn: async (payload) => setOrganizationDetails(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [GET_ORGANIZATION_DETAILS],
      });

      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return { updateOrganizationDetails, isUpdateOrganizationDetailsLoading };
};

export default useUpdateOrgDetails;
