export const KNOWLEDGE_BASES_FILTER_KEY = 'sideFilter';

export const knowledgeBaseSearchFormatter = (values) => ({
  ...(values[KNOWLEDGE_BASES_FILTER_KEY].createdDate?.filterValue &&
    values[KNOWLEDGE_BASES_FILTER_KEY].createdDate?.filterValue),
  ...(values[KNOWLEDGE_BASES_FILTER_KEY].updatedDate?.filterValue &&
    values[KNOWLEDGE_BASES_FILTER_KEY].updatedDate?.filterValue),
  search: values[KNOWLEDGE_BASES_FILTER_KEY].searchText || '',
  timezone: values.timezone || '',
});

export const knowledgeBasesFiltersMeta = {
  key: KNOWLEDGE_BASES_FILTER_KEY,
  formatter: {
    updatedDate: ({ v, k }) => ({
      label: 'Last Updated',
      value: v?.label || '',
      k,
    }),
    createdDate: ({ v, k }) => ({
      label: 'Created Date',
      value: v?.label || '',
      k,
    }),
  },
};

export const removeProtocolFromUrl = (url, removeTrailingSlash = true) => {
  let updatedUrl;

  if (!url || typeof url !== 'string') return;

  const protocolRegex = /^https?:\/\/|\/\/?/i;

  const domainName = url.replace(protocolRegex, '');

  if (removeTrailingSlash) {
    updatedUrl = url.endsWith('/') ? domainName.slice(0, -1) : domainName;
  } else {
    updatedUrl = domainName;
  }

  return updatedUrl;
};
