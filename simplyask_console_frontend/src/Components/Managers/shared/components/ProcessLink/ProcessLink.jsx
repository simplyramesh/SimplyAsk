import { generatePath } from 'react-router-dom';

import routes from '../../../../../config/routes';
import { useProcesses } from '../../../../../hooks/process/useProcesses';

const ProcessLink = ({ children, processId }) => {
  const { processes } = useProcesses({
    params: {
      pageSize: 999,
    },
    options: {
      gcTime: Infinity,
      staleTime: Infinity,
    },
  });

  const id = processes?.find(({ deploymentId }) => deploymentId === processId)?.workflowId;

  const processLink = generatePath(routes.PROCESS_MANAGER_INFO, { processId: id });

  return children(processLink);
};

export default ProcessLink;
