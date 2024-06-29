import { allSimplePaths } from 'graphology-simple-path';

import { EXPRESSION_BUILDER_DEFAULT_VALUE } from '../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import {
  convertModelParamNodeToTextNode,
  updateModelNodes,
  updateModelParamNodeValue,
} from '../../shared/REDISIGNED/controls/lexical/utils/helpers';
import { STEP_INPUT_TYPE_KEYS, STEP_PARAM_TYPES } from '../components/sideMenu/SideMenu/keyConstants';
import { stepTypes } from '../constants/graph';

export const increment = () => (() => ++window.nodesCount)();

export const incrementBranch = () => (() => ++window.edgesCount)();

export const incrementMaxBranch = () => (() => ++window.maxEdgeId)();

export const initializeMaxEdgeId = (graph) => {
  const allEdges = graph.edges();
  const maxId = allEdges.reduce((max, edgeKey) => {
    const edgeAttributes = graph.getEdgeAttributes(edgeKey);
    const stepId = parseInt(edgeAttributes.stepId, 10);
    const edgeId = stepId ? parseInt(edgeAttributes.stepId, 10) : 0;

    return Math.max(max, edgeId);
  }, 0);

  window.maxEdgeId = maxId;
};

export const getMergeStepId = (id) => `${id}-M`;

export const getStepIdName = (id) => `step-id-${id}`;
export const getGroupEndStepId = (id) => `${id}-GE`;

export const addEdge = ({ graph, source, target, condition, stepType = stepTypes.TASK_SLOT }) => {
  const branchId = incrementBranch();
  const maxBranchId = incrementMaxBranch();
  const stepId = Math.max(branchId, maxBranchId);

  graph.addEdgeWithKey(stepId, source, target, {
    stepId,
    stepType,
    condition,
  });
};

export const addSimpleEdge = (graph, source, target) => {
  const branchId = incrementBranch();
  const maxBranchId = incrementMaxBranch();
  const stepId = Math.max(branchId, maxBranchId);

  graph.addEdgeWithKey(stepId, source, target, {
    stepId,
  });
};

export const updateEdge = (graph, edge, { source, target, attributes = {} }) => {
  const updatedSource = source ?? graph.source(edge);
  const updatedTarget = target ?? graph.target(edge);
  const updatedAttributes = { ...graph.getEdgeAttributes(edge), ...attributes };

  graph.dropEdge(edge);

  graph.addEdgeWithKey(edge, updatedSource, updatedTarget, updatedAttributes);
};

export const removeConditionalNode = (graph, nodeId) => {
  const mergedNodeId = getMergeStepId(nodeId);

  const [sourceEdge] = graph.inEdges(nodeId);

  const [target] = graph.outNeighbors(mergedNodeId);

  updateEdge(graph, sourceEdge, { target });

  const nodesInConditionalNode = new Set(allSimplePaths(graph, nodeId, mergedNodeId).flat());
  const uniqEdges = new Set([...nodesInConditionalNode].map((node) => graph.edges(node)).flat());

  uniqEdges.forEach((edge) => {
    graph.dropEdge(edge);
  });
  nodesInConditionalNode.forEach((node) => {
    graph.dropNode(node);
  });
};

export const updateNode = (graph, stepId, attributes) => {
  graph.updateNodeAttributes(stepId, (attr) => ({ ...attr, ...attributes }));
};

export const removeNode = (graph, nodeId) => {
  const [sourceEdge] = graph.inEdges(nodeId);

  const [target] = graph.outNeighbors(nodeId);

  updateEdge(graph, sourceEdge, { target });

  // remove edges
  graph.edges(nodeId).forEach((edge) => graph.dropEdge(edge));

  // remove node
  graph.dropNode(nodeId);
};

export const replaceConditionalNode = (graph, edge, nodeId) => {
  const mergedNodeId = getMergeStepId(nodeId);

  const [sourceEdge] = graph.inEdges(nodeId);

  const [target] = graph.outNeighbors(mergedNodeId);

  updateEdge(graph, sourceEdge, { target });

  const targetNode = graph.target(edge);

  updateEdge(graph, edge, { target: nodeId });

  const [targetEdge] = graph.outEdges(mergedNodeId);
  updateEdge(graph, targetEdge, { target: targetNode });
};

export const insertConditionalNode = (graph, edge, nodeAttributes, mergeAttributes) => {
  const { stepDelegateId, stepDelegateType, stepDelegateIcon, stepDelegateName } = nodeAttributes;

  const target = graph.target(edge);

  const id = increment();
  const mergeNodeId = getMergeStepId(id);

  // add new Node
  const newStepAttributes = {
    stepId: id,
    stepDelegateId,
    stepIcon: stepDelegateIcon,
    stepType: stepDelegateType,
    displayName: stepDelegateName,
    ...nodeAttributes,
  };

  // add conditional node
  graph.addNode(id, newStepAttributes);

  // add merge node
  graph.addNode(mergeNodeId, { stepType: stepTypes.MERGE, stepId: mergeNodeId, ...mergeAttributes });

  // update edge
  updateEdge(graph, edge, { target: id });

  // add new edge
  addEdge({
    graph,
    source: mergeNodeId,
    target,
  });

  // add conditional edges
  addEdge({
    graph,
    source: id,
    target: mergeNodeId,
    condition: EXPRESSION_BUILDER_DEFAULT_VALUE,
  });
  addEdge({
    graph,
    source: id,
    target: mergeNodeId,
    condition: EXPRESSION_BUILDER_DEFAULT_VALUE,
  });
};

export const insertGroupNode = (graph, edge, nodeAttributes, mergeAttributes) => {
  const { stepDelegateId, stepDelegateType, stepDelegateIcon, stepDelegateName } = nodeAttributes;

  const target = graph.target(edge);

  const id = increment();
  const mergeNodeId = getGroupEndStepId(id);

  // add new Node
  const newStepAttributes = {
    stepId: id,
    stepDelegateId,
    stepIcon: stepDelegateIcon,
    stepType: stepDelegateType,
    displayName: stepDelegateName,
    ...nodeAttributes,
  };

  // add conditional node
  graph.addNode(id, newStepAttributes);

  // add merge node
  if (stepDelegateType === stepTypes.LOOP_START) {
    graph.addNode(mergeNodeId, { stepType: stepTypes.LOOP_END, stepId: mergeNodeId, ...mergeAttributes });
  } else if (stepDelegateType === stepTypes.RPA_START) {
    graph.addNode(mergeNodeId, { stepType: stepTypes.RPA_END, stepId: mergeNodeId, ...mergeAttributes });
  }

  // update edge
  updateEdge(graph, edge, { target: id });

  // add new edge
  addEdge({
    graph,
    source: id,
    target: mergeNodeId,
  });
  addEdge({
    graph,
    source: mergeNodeId,
    target,
  });

  // add loop back edge (exceptional case for loops)
  if (stepDelegateType === stepTypes.LOOP_START) {
    addEdge({
      graph,
      source: mergeNodeId,
      target: id,
      condition: EXPRESSION_BUILDER_DEFAULT_VALUE,
      stepType: null,
    });
  }
};

export const replaceGroupNode = (graph, edge, nodeId) => {
  const mergedNodeId = getGroupEndStepId(nodeId);
  const mergeNodeOutEdges = graph.outEdges(mergedNodeId);

  const [sourceEdge] = graph.inEdges(nodeId).filter((e) => !mergeNodeOutEdges.includes(e));

  const [target] = graph.outNeighbors(mergedNodeId).filter((n) => n !== `${nodeId}`);

  updateEdge(graph, sourceEdge, { target });

  const targetNode = graph.target(edge);

  updateEdge(graph, edge, { target: nodeId });

  const [targetEdge] = mergeNodeOutEdges.filter((e) => graph.target(e) !== `${nodeId}`);

  if (targetEdge) {
    updateEdge(graph, targetEdge, { target: targetNode });
  }
};

export const removeGroupNode = (graph, nodeId) => {
  const mergedNodeId = getGroupEndStepId(nodeId);
  const mergeNodeOutEdges = graph.outEdges(mergedNodeId);

  const [sourceEdge] = graph.inEdges(nodeId).filter((e) => !mergeNodeOutEdges.includes(e));

  const [target] = graph.outNeighbors(mergedNodeId).filter((n) => n !== `${nodeId}`);

  updateEdge(graph, sourceEdge, { target });

  const nodesInConditionalNode = new Set(allSimplePaths(graph, nodeId, mergedNodeId).flat());
  const uniqEdges = new Set([...nodesInConditionalNode].map((node) => graph.edges(node)).flat());

  uniqEdges.forEach((edge) => {
    graph.dropEdge(edge);
  });
  nodesInConditionalNode.forEach((node) => {
    graph.dropNode(node);
  });
};

export const insertNode = (graph, edge, nodeAttributes) => {
  const { stepDelegateId, stepDelegateType, stepDelegateIcon, stepDelegateName } = nodeAttributes;

  const target = graph.target(edge);

  const id = increment();

  // add new Node
  const newStepAttributes = {
    stepId: id,
    stepDelegateId,
    stepIcon: stepDelegateIcon,
    stepType: stepDelegateType,
    displayName: stepDelegateName,
    ...nodeAttributes,
  };

  graph.addNode(id, newStepAttributes);

  updateEdge(graph, edge, { target: id });
  addEdge({
    graph,
    source: id,
    target,
  });
};

export const replaceNode = (graph, edge, nodeId) => {
  const [sourceEdge] = graph.inEdges(nodeId);
  const [target] = graph.outNeighbors(nodeId);

  updateEdge(graph, sourceEdge, { target });

  graph.edges(nodeId).forEach((edge) => graph.dropEdge(edge));

  const replacementTarget = graph.target(edge);

  updateEdge(graph, edge, { target: nodeId });

  addEdge({
    graph,
    source: nodeId,
    target: replacementTarget,
  });
};

export const isSpecificNodesUsed = (graph, workflowProcessTypeId) => {
  if (!graph || !workflowProcessTypeId) {
    return false;
  }

  const nodes = graph.nodes();

  return nodes
    .map((node) => graph.getNodeAttributes(node))
    .some((node) => node.processTypeIds?.every((nodePocessTypeId) => nodePocessTypeId === workflowProcessTypeId));
};

export const getNodesWithParam = (graph, paramName) => {
  if (!graph || !paramName) {
    return [];
  }

  const nodes = graph.nodes();
  const nodesModel = nodes
    .map((node) => graph.getNodeAttributes(node))
    .filter((node) => node.stepInputParameters?.length || node.stepOutputParameters?.length);

  const nodesWithParam = nodesModel.filter((node) => {
    const isInputsIncludesParam = isParamUsedInSet(paramName, node.stepInputParameters);
    const isOuputsIncludesParam = isParamUsedInSet(paramName, node.stepOutputParameters);

    return isInputsIncludesParam || isOuputsIncludesParam;
  });

  return nodesWithParam;
};

const isParamUsedInSet = (paramName, paramSet) =>
  paramSet?.some((inputParam) => {
    const paramValue = inputParam.currentValue;
    const stepType = inputParam.stepSettingTemplate.stepSettingsInputType;

    if (STEP_PARAM_TYPES.includes(stepType)) {
      switch (stepType) {
        case STEP_INPUT_TYPE_KEYS.PARAMETER_AUTOCOMPLETE: {
          if (!paramValue) return false;

          try {
            const jsonValue = JSON.parse(paramValue);
            const autocompleteValue = jsonValue.root.children[0]?.children;

            return autocompleteValue?.some((autocompleteItem) => autocompleteItem.paramName === paramName);
          } catch (e) {
            console.error(e);
            return false;
          }
        }
        case STEP_INPUT_TYPE_KEYS.API_PARAMETER_LIST:
          return Array.isArray(paramValue) && paramValue.some((param) => param?.value?.label === paramName);
        case STEP_INPUT_TYPE_KEYS.STATIC_DYNAMIC_PARAMETER_FIELD:
          return paramValue?.label === paramName;
        case STEP_INPUT_TYPE_KEYS.DROPDOWN_SELECTOR:
          return (
            inputParam.stepSettingTemplate?.stepSettingOptions?.shouldDisplayDynamicParameterValues &&
            paramValue?.label === paramName
          );
        default:
          return false;
      }
    }

    return false;
  });

export const updateParamNamesInSet = (paramSet, oldParamName, newParamModel) =>
  paramSet.map((inputParam) => {
    const { currentValue } = inputParam;
    const newParamName = newParamModel?.value?.paramName;
    const stepType = inputParam.stepSettingTemplate.stepSettingsInputType;

    if (!STEP_PARAM_TYPES.includes(stepType)) {
      return inputParam;
    }

    let newValue;

    switch (stepType) {
      case STEP_INPUT_TYPE_KEYS.STATIC_DYNAMIC_PARAMETER_FIELD:
        newValue = updateParamName(currentValue, oldParamName, newParamModel);
        break;

      case STEP_INPUT_TYPE_KEYS.API_PARAMETER_LIST:
        newValue = newParamModel
          ? currentValue.map((param) => ({
              ...param,
              value: updateParamName(param.value, oldParamName, newParamModel),
            }))
          : currentValue.filter((param) => param?.value?.label !== oldParamName);
        break;

      case STEP_INPUT_TYPE_KEYS.DROPDOWN_SELECTOR:
        newValue = inputParam.stepSettingTemplate?.stepSettingOptions?.shouldDisplayDynamicParameterValues
          ? updateParamName(currentValue, oldParamName, newParamModel)
          : inputParam;
        break;

      case STEP_INPUT_TYPE_KEYS.PARAMETER_AUTOCOMPLETE:
        newValue = updateAutocompleteParamName(currentValue, oldParamName, newParamName);
        break;

      default:
        break;
    }

    return {
      ...inputParam,
      currentValue: newValue,
    };
  });

const updateParamName = (currentValue, oldParamName, newParamModel) => {
  const newParamValue = newParamModel ?? '';

  return currentValue?.label === oldParamName ? newParamValue : currentValue;
};

const updateAutocompleteParamName = (currentValue, oldParamName, newParamName) => {
  if (!currentValue) {
    return '';
  }

  try {
    const jsonValue = JSON.parse(currentValue);

    const updatedValue = updateModelNodes(jsonValue, (node) => {
      if (node.paramName !== oldParamName) return node;

      const newNode = newParamName
        ? updateModelParamNodeValue(node, newParamName)
        : convertModelParamNodeToTextNode(node, oldParamName);

      return newNode;
    });

    return JSON.stringify(updatedValue);
  } catch (e) {
    console.error(e);
    return currentValue;
  }
};

