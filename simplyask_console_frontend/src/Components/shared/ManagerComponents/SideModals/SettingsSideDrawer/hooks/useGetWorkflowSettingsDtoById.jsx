import { useQuery } from '@tanstack/react-query';

import { getWorkflowSettingsDTO } from '../../../../../../Services/axios/processManager';

export const WORKFLOW_SETTINGS_DTO_QUERY_KEY = 'getWorkflowSettingsDTO';

const useGetWorkflowSettingsDto = ({ workflowId, options }) => {
  const { data, isFetching, ...rest } = useQuery({
    queryKey: [WORKFLOW_SETTINGS_DTO_QUERY_KEY, workflowId],
    queryFn: () => getWorkflowSettingsDTO(workflowId),
    ...options,
  });

  return {
    workflowDtoSettings: data,
    isWorkflowDtoSettingsFetching: isFetching,
    ...rest,
  };
};

export default useGetWorkflowSettingsDto;
