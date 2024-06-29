import { FALLOUT_TICKET_FILTER_KEYS } from '../constants/constants';

export const FILTER_KEY = 'sideFilter';

export const getDefaultUserOption = (issue) => {
  const assignedTo = issue?.assignedTo || null;

  if (!assignedTo?.name) return '';

  const { id, name } = assignedTo;

  const firstName = name?.split(' ')[0] || '';
  const lastName = name?.split(' ')[1] || '';

  return assignedTo
    ? [
        {
          label: name,
          value: {
            id,
            firstName,
            lastName,
            pfp: '',
          },
        },
      ]
    : '';
};

export const getNestedObjectValue = (optionObject, optionKey) => {
  const keys = optionKey.split('.');

  return keys.reduce((object, key) => object?.[key] || '', optionObject);
};

export const selectDropdownOption = (option, optionKey) => {
  if (Array.isArray(option)) {
    return option.map((o) => getNestedObjectValue(o, optionKey));
  }

  return option?.[optionKey];
};

export const createLabeledSelection = ({ v, k }, label) => {
  const val = selectDropdownOption(v, k);

  return {
    label,
    value: val.length > 0 ? val : '',
    k,
  };
};

export const selectedFalloutTicketsFiltersMeta = {
  key: FILTER_KEY,
  formatter: {
    [FALLOUT_TICKET_FILTER_KEYS.PRIORITY]: ({ v, k }) => ({
      label: 'Priority',
      value: v?.map((item) => item.label) || '',
      k,
    }),
    [FALLOUT_TICKET_FILTER_KEYS.ASSIGNED_TO]: ({ v, k }) => ({
      label: 'Assignee',
      value: v?.map((item) => item.label) || '',
      k,
    }),
    [FALLOUT_TICKET_FILTER_KEYS.DUE_DATE]: ({ v, k }) => ({
      label: 'Due Date',
      value: v?.label || '',
      k,
    }),
    [FALLOUT_TICKET_FILTER_KEYS.CREATED_DATE]: ({ v, k }) => ({
      label: 'Incident Time',
      value: v?.label || '',
      k,
    }),
    [FALLOUT_TICKET_FILTER_KEYS.STATUS]: ({ v, k }) => createLabeledSelection({ v, k }, 'Status'),
  },
};

export const falloutTicketsFormatter = (values) => {
  return {
    priority: selectDropdownOption(values[FILTER_KEY].priority, 'value') || '',
    issueTypeStatusId: selectDropdownOption(values[FILTER_KEY][FALLOUT_TICKET_FILTER_KEYS.STATUS], 'value') || '',
    assignedTo: selectDropdownOption(values[FILTER_KEY].assignedTo, 'value.id') || '',

    ...(values[FILTER_KEY][FALLOUT_TICKET_FILTER_KEYS.CREATED_DATE]?.filterValue &&
      values[FILTER_KEY][FALLOUT_TICKET_FILTER_KEYS.CREATED_DATE].filterValue),

    ...(values[FILTER_KEY][FALLOUT_TICKET_FILTER_KEYS.DUE_DATE]?.filterValue &&
      values[FILTER_KEY][FALLOUT_TICKET_FILTER_KEYS.DUE_DATE].filterValue),

    timezone: values.timezone || '',
    returnParameters: values.returnParameters,
    returnAdditionalField: values.returnAdditionalField,
    returnRelatedEntities: values.returnRelatedEntities,
    issueCategoryId: values.issueCategoryId,
  };
};

export const getIssueParameterGroup = (issue, paramGroupName) => {
  return issue?.issueParameterGroup?.find((paramGroup) => paramGroup.groupName === paramGroupName)?.parameters || [];
};