import { useQuery } from '@tanstack/react-query';

import { getAllIssueAttachments } from '../../../Services/axios/filesAxios';
import { ISSUES_QUERY_KEYS } from '../constants/core';

const useIssueGetAllAttachedFiles = (params) => {
  const { data: getAllAttachedFiles, isLoading: isGetAllAttachedFilesLoading } = useQuery({
    queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_ATTACHMENTS, params],
    queryFn: () => getAllIssueAttachments(params),
    enabled: !!params.issueId,
    select: (res) => res?.filter((item) => !item.isDeleted),
  });
  return {
    getAllAttachedFiles,
    isGetAllAttachedFilesLoading,
  };
};

export default useIssueGetAllAttachedFiles;
