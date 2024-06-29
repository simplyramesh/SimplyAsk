import { useMutation } from '@tanstack/react-query';

import { getFalloutReportCsv } from '../../../Services/axios/boaDashboardReports';

const useGenerateAuditReportCSV = ({ onError, onSuccess } = {}) => {
  const { mutate: generateAuditReportCSV, isPending: isGenerateAuditReportCSVLoading } = useMutation({
    mutationFn: ({
      source, from, to, params,
    }) => getFalloutReportCsv(source, from, to, params),
    onSuccess: (data, variables) => {
      onSuccess?.({ data, variables });
    },
    onError,
  });

  return {
    generateAuditReportCSV,
    isGenerateAuditReportCSVLoading,
  };
};

export default useGenerateAuditReportCSV;
