import { useMutation } from '@tanstack/react-query';

import { getFalloutReportHtml } from '../../../Services/axios/boaDashboardReports';

const useGenerateAuditReportHTML = ({ onError, onSuccess } = {}) => {
  const { mutate: generateAuditReportHTML, isPending: isGenerateAuditReportHTMLLoading } = useMutation({
    mutationFn: ({
      source, from, to, params,
    }) => getFalloutReportHtml(source, from, to, params),
    onSuccess: (data, variables) => {
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    generateAuditReportHTML,
    isGenerateAuditReportHTMLLoading,
  };
};

export default useGenerateAuditReportHTML;
