import { ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY } from '../constants/initialValues';

export const selectedOrchestratorListFiltersMeta = {
  key: ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY,
  formatter: {
    executedDate: ({ v, k }) => ({
      label: 'Last Executed',
      value: v?.label || '',
      k,
    }),
    updatedDate: ({ v, k }) => ({
      label: 'Last Edited',
      value: v?.label || '',
      k,
    }),
    createdDate: ({ v, k }) => ({
      label: 'Created On',
      value: v?.label || '',
      k,
    }),
    tags: ({ v, k }) => ({
      label: 'Tag',
      value: v || '',
      k,
    }),
  },
};

export const orchestratorListFormatter = (values) => ({
  timezone: values.timezone || '',
  updatedBefore: values[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY].updatedDate?.filterValue?.updatedBefore || '',
  updatedAfter: values[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY].updatedDate?.filterValue?.updatedAfter || '',
  createdBefore: values[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY].createdDate?.filterValue?.createdBefore || '',
  createdAfter: values[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY].createdDate?.filterValue?.createdAfter || '',
  executedBefore: values[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY].executedDate?.filterValue?.executedBefore || '',
  executedAfter: values[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY].executedDate?.filterValue?.executedAfter || '',
  tags: values[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY].tags || [],
});
