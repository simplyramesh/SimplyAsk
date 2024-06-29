import { useQuery } from '@tanstack/react-query';

import { getProcessExecutionsForVisualizerTable } from '../../../Services/axios/processDataVisualizer';

export const GET_PROCESS_EXECUTIONS_FOR_VISUALIZER = 'getProcessExecutionsForVisualizerTable';

export const useGetProcessesVisualizerTable = (id, rest = {}) => {
  const { data: processVisualizerTableData, isFetching: isProcessVisualizerTableDataFetching } = useQuery({
    queryKet: [GET_PROCESS_EXECUTIONS_FOR_VISUALIZER, id],
    queryFn: () => getProcessExecutionsForVisualizerTable(id),
    ...rest,
  });

  return {
    processVisualizerTableData,
    isProcessVisualizerTableDataFetching,
  };
};
