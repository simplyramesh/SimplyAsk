import { useQuery } from '@tanstack/react-query';

import { getFalloutDestinations } from '../../Services/axios/processManager';

export const GET_FALLOUT_DESTINATIONS = 'GET_FALLOUT_DESTINATIONS';

export const useFalloutDestinations = (rest = {}) => {
  const {
    data: falloutDestinations,
    isFetching,
  } = useQuery({
    queryKey: [GET_FALLOUT_DESTINATIONS],
    queryFn: ({ signal }) => getFalloutDestinations(signal),
    ...rest,
  });

  return {
    falloutDestinations,
    isFetching,
  };
};
