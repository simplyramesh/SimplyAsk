import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useReactFlow } from 'reactflow';
import { useSetRecoilState } from 'recoil';

import routes from '../../../../config/routes';
import useOrchestratorDetails from '../../../../hooks/orchestrator/useOrchestratorDetails';
import useOrchestratorExecutionById from '../../../../hooks/orchestrator/useOrchestratorExecutionById';
import { modifiedCurrentPageDetails } from '../../../../store';

import { MODES } from './constants/config';
import { initialOrchestratorState, orchestratorState } from './store';
import { getHighlightedEdges } from './utils/edges';

const DataProvider = ({ children, mode }) => {
  const theme = useTheme();
  const { processId, executingId } = useParams();
  const { setViewport } = useReactFlow();
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);
  const setOrchestrator = useSetRecoilState(orchestratorState);

  const handleSetOrchestrator = (data, shouldShipViewport) => {
    const { graph, ...rest } = data;
    const { viewport, edges, nodes: steps } = graph || {};

    if (graph) {
      const nodesIdsArr = steps.map(({ id }) => Number(id)).filter(Boolean);
      const lastStepId = nodesIdsArr.length > 0 ? Math.max(...nodesIdsArr) : 0;

      if (viewport && !shouldShipViewport) {
        setViewport(viewport);
      }

      const highlightedEdges = getHighlightedEdges({
        mode, edges, steps, theme,
      });

      setOrchestrator((prev) => ({
        ...prev,
        ...rest,
        steps,
        lastStepId,
        edges: highlightedEdges,
      }));
    }
  };

  const { orchestrator, isOrchestratorFetching } = useOrchestratorDetails({
    id: processId,
    enabled: Boolean(processId) && mode !== MODES.HISTORY,
    onSuccess: handleSetOrchestrator,
  });

  const {
    orchestratorExecution,
    isOrchestratorExecutionFetching,
    isOrchestratorExecutionLoading,
  } = useOrchestratorExecutionById({
    id: processId,
    executingId,
    enabled: Boolean(processId && executingId) && mode === MODES.HISTORY,
    onSuccess: (data) => handleSetOrchestrator(data, true),
  });

  useEffect(() => {
    setOrchestrator((prev) => ({
      ...prev,
      mode,
    }));

    mode === MODES.VIEW && setCurrentPageDetailsState({
      pageUrlPath: routes.PROCESS_ORCHESTRATION_DETAILS,
      pageName: 'Orchestrator Editor',
    });
  }, [mode]);

  useEffect(() => () => {
    setOrchestrator(initialOrchestratorState);
  }, []);

  const currentOrchestrator = orchestrator || orchestratorExecution;
  const currentLoading = isOrchestratorFetching
      // for history mode we need show loading only first load on graph
      || (mode === MODES.HISTORY ? isOrchestratorExecutionLoading : isOrchestratorExecutionFetching);

  return children(currentOrchestrator, currentLoading);
};

export default DataProvider;
