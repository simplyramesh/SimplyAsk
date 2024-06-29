import { useQuery } from '@tanstack/react-query';

import { getProxyDefinitions } from '../../Services/axios/workflowEditor';

export const QUERY_KEY_PROXY_DEFINITIONS = 'proxyDefinitions';

export const useProxyDefinitions = (type, rest = {}) => {
  const { data: definitions, isLoading } = useQuery({
    queryKey: [QUERY_KEY_PROXY_DEFINITIONS, type],
    queryFn: () => getProxyDefinitions(type),
    enabled: !!type,
    ...rest,
  });

  return {
    definitions,
    isLoading,
  };
};
