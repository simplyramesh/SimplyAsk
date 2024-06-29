import { MODES } from '../constants/config';
import { EXECUTIONS_STATUSES } from '../../ProcessOrchestratorDetails/constants/initialValues';
import { STEP_TYPES } from '../../../shared/constants/steps';

export const getHighlightedEdges = ({ mode, edges, steps, theme }) => {
  return mode === MODES.HISTORY ? edges.map(edge => {
    const source = steps.find(step => step.id === edge.source);
    const target = steps.find(step => step.id === edge.target);

    if ((source?.data.job.status === EXECUTIONS_STATUSES.SUCCESS || source.type === STEP_TYPES.START) && [
      EXECUTIONS_STATUSES.SUCCESS,
      EXECUTIONS_STATUSES.FAILED,
      EXECUTIONS_STATUSES.SCHEDULED,
      EXECUTIONS_STATUSES.EXECUTING
    ].includes(target?.data.job.status))  {
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: theme.colors.grassGreen,
        }
      }
    }
    return edge;
  }) : edges;
}
