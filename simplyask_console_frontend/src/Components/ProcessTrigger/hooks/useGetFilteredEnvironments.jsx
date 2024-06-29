import { useQuery } from '@tanstack/react-query';
import { getEnvironments } from '../../../Services/axios/environment';

export const GET_FILTERED_ENVIRONMENTS = 'GET_FILTERED_ENVIRONMENTS';

export const useGetFilteredEnvironments = ({ params = {}, ...rest }) => {
  const { data: filteredEnvironments, isLoading: isFilteredEnvironmentsLoading } = useQuery({
    queryKey: [GET_FILTERED_ENVIRONMENTS, params],
    queryFn: () => getEnvironments(params),
    ...rest,
  });

  return {
    filteredEnvironments,
    isFilteredEnvironmentsLoading,
  };
};
