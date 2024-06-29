export const FILTER_KEY = 'sideFilter';

export const STATUS_OPTIONS = [
  {
    label: 'Show completed',
    value: true,
  },
  {
    label: 'Hide completed',
    value: false,
  },
];

export const RESOLVED_BY_OPTIONS = [
  {
    label: 'PROCESS',
    value: 'PROCESS',
  },
  {
    label: 'USER',
    value: 'USER',
  },
  {
    label: 'AGENT',
    value: 'AGENT',
  },
];

export const selectedFiltersMeta = {
  key: FILTER_KEY,
  formatter: {
    status: ({ v, k }) => ({
      label: 'Status',
      value: v?.map?.((s) => s?.status || '') || '',
      k,
    }),
    assignedTo: ({ v, k }) => ({
      label: 'Assignee',
      value: v?.map?.((item) => item.label) || '',
      k,
    }),
    createdDate: ({ v, k }) => ({
      label: 'Created On',
      value: v.label,
      k,
    }),
    resolvedDate: ({ v, k }) => ({
      label: 'Resolved On',
      value: v.label,
      k,
    }),
    resolvedBy: ({ v, k }) => ({
      label: 'Resolved By',
      value: v?.map((item) => item.label),
      k,
    }),
    parentIssueId: ({ v, k }) => ({
      label: 'Associated Service Ticket',
      value: v?.map((item) => item.label),
      k,
    }),
  },
};

export const formatter = (values) => {
  return {
    assignedTo: values?.[FILTER_KEY]?.assignedTo?.map?.((a) => a.value.id) || '',
    issueTypeStatusId: values?.[FILTER_KEY]?.status?.map?.((s) => s.value) || '',
    createdAfter: values?.[FILTER_KEY]?.createdDate?.filterValue?.createdAfter || '',
    createdBefore: values?.[FILTER_KEY]?.createdDate?.filterValue?.createdBefore || '',
    resolvedAfter: values?.[FILTER_KEY]?.resolvedDate?.filterValue?.resolvedAfter || '',
    resolvedBefore: values?.[FILTER_KEY]?.resolvedDate?.filterValue?.resolvedBefore || '',
    resolvedBy: values?.[FILTER_KEY]?.resolvedBy?.map((r) => r.value) || '',
    timezone: values.timezone || '',
    returnParameters: true,
    returnAdditionalField: true,
    returnRelatedEntities: true,
    issueCategoryId: values.issueCategoryId,
    parentIssueId:
      typeof values?.parentIssueId === 'string'
        ? values?.parentIssueId
        : values?.[FILTER_KEY]?.parentIssueId?.map((p) => p.value) || '',
  };
};

export const getDefaultUserOption = (ticketDetails, assignedUserPfp) => {
  const assignedUserFirstName = ticketDetails?.assignedTo?.name.split(' ')[0];
  const assignedUserLastName = ticketDetails?.assignedTo?.name.split(' ')[1];
  const assignedUserId = ticketDetails?.assignedTo?.id;

  return assignedUserId ? [{
    label: `${ticketDetails?.assignedTo?.name}`,
    value: {
      id: assignedUserId,
      firstName: assignedUserFirstName,
      lastName: assignedUserLastName,
      pfp: assignedUserPfp,
    },
  }] : '';
};

export const getFirstOrFullNameInitials = (name = '') => { // first two letters when only one name as opposed to first letter of each name only
  const initials = name
    .trim()
    .split(' ')
    .reduce((acc, curr, index, arr) => ((index > 1 || acc.length > 1 || !curr)
      ? acc
      : (arr.length < 2
        && [`${curr[0].toUpperCase()}`, `${curr[1].toUpperCase()}`])
      || [...acc, curr[0].toUpperCase()]), [])
    .join('');

  return initials;
};
