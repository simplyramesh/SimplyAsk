import { useQuery } from '@tanstack/react-query';

import { getIssueById } from '../../Services/axios/issuesAxios';

export const GET_FALLOUT_TICKET_BY_INCIDENT_ID = 'GET_FALLOUT_TICKET_BY_INCIDENT_ID';

export const useFalloutDetails = ({ incidentId, timezone, enabled = true }) => {
  const {
    data: falloutTicketDetails,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [GET_FALLOUT_TICKET_BY_INCIDENT_ID, incidentId],
    queryFn: () => getIssueById(incidentId),
    enabled,
  });

  return {
    falloutTicketDetails,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
