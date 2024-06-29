import { useQuery } from '@tanstack/react-query';

import { getPublicFormConfig } from '../../../../../Services/axios/workflowEditor';
import { PUBLIC_FORM_QUERY_KEYS } from '../utils/constants';

const useGetPublicFormConfig = () => {
  const { data: publicFormConfigValues, isFetching: isPublicFormConfigValuesLoading } = useQuery({
    queryKey: [PUBLIC_FORM_QUERY_KEYS.GET_PUBLIC_FORM_CONFIG],
    queryFn: getPublicFormConfig,
  });

  return { publicFormConfigValues, isPublicFormConfigValuesLoading };
};

export default useGetPublicFormConfig;
