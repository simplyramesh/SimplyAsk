import { useQuery } from '@tanstack/react-query';

export const useGetGroupPermissions = ({
    uniqueKey,
    paramsId,
    queryFn,
    enabled = true,
    select = (data) => data
}) => {
    const { data } = useQuery({
      queryKey: [uniqueKey, paramsId],
      queryFn,
      enabled,
      select,
    });

    return {
        data
    };
  };
