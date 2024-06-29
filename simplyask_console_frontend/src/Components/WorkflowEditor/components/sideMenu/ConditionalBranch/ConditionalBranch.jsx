import { useFormik } from 'formik';
import { MultiDirectedGraph } from 'graphology';
import { allSimplePaths } from 'graphology-simple-path';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { EXPRESSION_BUILDER_DEFAULT_VALUE } from '../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import { useHistoricalRecoilState } from '../../../hooks/useHistoricalRecoilState';
import { addEdge, getMergeStepId, updateEdge, updateNode } from '../../../services/graph';
import { handleRemoveConditionalStep } from '../../../utils/helperFunctions';
import { ERROR_TYPES } from '../../../utils/validation';
import { Divider } from '../base';
import { SideMenuCard, SideMenuHeader } from '../SideMenu';
import { Content, Scrollable } from '../wrappers';
import Configuration from './Configuration/Configuration';
import Resources from './Resources/Resources';

const ConditionalBranch = ({ stepId, onClick }) => {
  const { set, state } = useHistoricalRecoilState();

  const { workflow } = state;

  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [state]);
  const step = graph.getNodeAttributes(stepId);

  const { stepIcon, displayName } = step;

  let edges;

  try {
    edges = graph.outEdges(stepId);
  } catch {
    // close the conditional branch sidebar if the stepId is not found
    set({ ...state, editingStep: null });
  }

  const mappedEdges = edges
    .sort((a, b) => {
      return a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    })
    .map((edge) => ({ stepId: edge, ...graph.getEdgeAttributes(edge) }));

  const { values, errors } = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      edges: mappedEdges,
      displayName,
    },
    validate: (values) => {
      const errors = values.edges.reduce((acc, edge, index) => {
        if (!edge.condition.length) {
          acc[index] = { type: ERROR_TYPES.WARNING, message: 'recommended' };
        }

        if (!values.displayName) {
          acc.displayName = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };
        }

        return acc;
      }, {});

      return errors;
    },
  });

  const countOfIncompleteRecommendFields = useMemo(
    () => values.edges.filter((edge) => !edge.condition.length).length,
    [values.edges]
  );

  useEffect(() => {
    const hasError = values.displayName.length === 0;
    const hasWarning = countOfIncompleteRecommendFields > 0;

    updateNode(graph, stepId, { hasError, hasWarning: hasWarning && !hasError });

    set({ ...state, workflow: graph.export() });
  }, [countOfIncompleteRecommendFields, values.displayName.length]);

  const handleBranchConditionChange = (edge, value) => {
    updateEdge(graph, edge, { attributes: { condition: value } });

    set({ ...state, workflow: graph.export() });
  };

  const handleBranchConditionAdd = () => {
    addEdge({
      graph,
      source: stepId,
      target: getMergeStepId(stepId),
      condition: EXPRESSION_BUILDER_DEFAULT_VALUE,
    });

    set({ ...state, workflow: graph.export() });
  };

  const handleBranchConditionDelete = (edge) => {
    const mergeId = getMergeStepId(stepId);

    const target = graph.target(edge);

    if (target === mergeId) {
      graph.dropEdge(edge);
    } else {
      const nodesInConditionalNode = new Set(
        allSimplePaths(graph, target, mergeId)
          .flat()
          .filter((i) => i !== mergeId)
      );
      const uniqEdges = new Set([...nodesInConditionalNode].map((node) => graph.edges(node)).flat());

      uniqEdges.forEach((edge) => {
        graph.dropEdge(edge);
      });
      nodesInConditionalNode.forEach((node) => {
        graph.dropNode(node);
      });
    }

    set({ ...state, workflow: graph.export() });
  };

  const handleSidebarClose = () => {
    set({ ...state, editingStep: null });
  };

  const handleDisplayNameChange = (value) => {
    updateNode(graph, stepId, { displayName: value });

    set({ ...state, workflow: graph.export() });
  };

  const handleStepRemove = () => {
    const { editingStep, ...restState } = state;
    handleRemoveConditionalStep({ graph, stepId, set, state: restState });
  };

  return (
    <>
      <SideMenuHeader
        text="Conditional Branch"
        withColor
        closeIcon
        onClose={handleSidebarClose}
        onRemoveStepClick={handleStepRemove}
      />
      <Scrollable>
        <Content>
          <SideMenuCard
            name="Conditional Branch"
            displayName={values.displayName}
            stepId={stepId}
            stepIcon={stepIcon || 'CUSTOM'}
            error={errors.displayName}
            onChange={handleDisplayNameChange}
          />
        </Content>
        <Divider color="gray" />
        <Content>
          <Configuration
            edges={mappedEdges}
            onChange={handleBranchConditionChange}
            onAdd={handleBranchConditionAdd}
            onDelete={handleBranchConditionDelete}
            errors={errors}
          />
        </Content>
        <Divider color="gray" variant="center" />
        <Content variant="wide">
          <Resources onClick={onClick} />
        </Content>
      </Scrollable>
    </>
  );
};

export default ConditionalBranch;

ConditionalBranch.propTypes = {
  onClick: PropTypes.func,
  stepId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
