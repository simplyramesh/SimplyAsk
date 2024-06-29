import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import { createIssuesTypesConfig } from '../../../../../Services/axios/issuesAxios';
import { getServiceTicketsCategory } from '../../../../../store/selectors';
import { ISSUES_QUERY_KEYS } from '../../../../Issues/constants/core';

const useCreateServiceTicketType = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { id: serviceTicketCategoryId } = useRecoilValue(getServiceTicketsCategory);

  const { mutate: createServiceTicketType, isPending: isCreateServiceTicketTypeLoading } = useMutation({
    mutationFn: async (body) => {
      const payload = {
        ...body,
        relatedCategoryId: serviceTicketCategoryId,
      };

      return createIssuesTypesConfig(payload);
    },
    onSuccess: ({ data, variables }) => {
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEYS.GET_CATEGORY_CONFIG, ISSUES_QUERY_KEYS.GET_SERVICE_TYPE_CONFIGURATIONS],
      });

      onSuccess?.({ data, variables });
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return { createServiceTicketType, isCreateServiceTicketTypeLoading };
};

export default useCreateServiceTicketType;
