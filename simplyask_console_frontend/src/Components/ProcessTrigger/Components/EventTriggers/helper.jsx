import { debounce } from 'lodash';
import { FILTERS_FORM_KEY } from './constants';
import { getEnvironments } from '../../../../Services/axios/environment';

export const eventTriggersFiltersFormatter = (values) => {
  const createdAt = values?.[FILTERS_FORM_KEY]?.createdAt?.filterValue;
  const updatedAt = values?.[FILTERS_FORM_KEY]?.updatedAt?.filterValue;
  const workflowsInUse = values?.[FILTERS_FORM_KEY]?.workflowsInUse?.value;
  const environmentIds = values?.[FILTERS_FORM_KEY]?.environmentIds?.map((item) => item.value);

  return {
    ...(createdAt && createdAt),
    ...(updatedAt && updatedAt),
    ...(workflowsInUse && { workflowsInUse }),
    ...(environmentIds && { environmentIds }),
    timezone: values.timezone || '',
  };
};

export const eventTriggersFiltersMeta = {
  key: FILTERS_FORM_KEY,
  formatter: {
    updatedAt: ({ v, k }) => ({
      label: 'Updated Date',
      value: v?.label || '',
      k,
    }),
    createdAt: ({ v, k }) => ({
      label: 'Created Date',
      value: v?.label || '',
      k,
    }),
    workflowsInUse: ({ v, k }) => ({
      label: 'Process',
      value: v?.label || '',
      k,
    }),
    environmentIds: ({ v, k }) => ({
      label: 'Environment',
      value: v?.map((item) => item.label),
      k,
    }),
  },
};

export const debouncedEnvironmentSearchFn = debounce((value, setOptions) => {
  getEnvironments(`searchText=${value}`).then((resp) => {
    const options = resp.content?.map((env) => ({ label: env.envName, value: env.id }));
    setOptions(options);
  });
}, 300);
