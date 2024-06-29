import { allSimpleEdgePaths, allSimplePaths } from 'graphology-simple-path';
import { bfsFromNode } from 'graphology-traversal/bfs';
import { STEP_PARAMS } from '../components/sideMenu/SideMenu/keyConstants';
import { defaultStepIds, rpaStepTypes, stepTypeEnds, stepTypeGroups, stepTypes } from '../constants/graph';
import { isValueValid } from '../utils/validation';
import { getGroupEndStepId, getMergeStepId, updateNode } from './graph';

window.allSimplePaths = allSimplePaths;
window.allSimpleEdgePaths = allSimpleEdgePaths;

const END_STEPS = [stepTypes.LOOP_END_EARLY, stepTypes.END_PROCESSING];

export const graphToTree = (graph) => {
  if (!graph) return [];

  const used = [];

  const fillDefault = ({ node, attrs, res }) => {
    res.push(attrs);
    // add for render only edges with existing stepType. Edges without stepType are helper edges
    graph.outEdges(node).forEach((edge) => {
      const edgeAttrs = graph.getEdgeAttributes(edge);

      if (edgeAttrs?.stepType) {
        res.push({
          ...edgeAttrs,
          ...(END_STEPS.includes(graph.getNodeAttribute(node, 'stepType')) ? { isEnd: true } : {}),
        });
      }
    });
  };

  const fillConditional = ({ node, attrs, res }) => {
    const branches = [...graph.outEdges(node)].sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );

    res.push({
      ...attrs,
      children: branches.map((edge) => ({
        stepType: stepTypes.BRANCH,
        children: [
          graph.getEdgeAttributes(edge),
          ...renderBranch({
            graph,
            from: graph.target(edge),
            breakFn: ({ stepId, stepType }) => stepType === stepTypes.MERGE && stepId === getMergeStepId(node),
          }),
        ],
      })),
    });
  };

  const fillGroup = ({ node, attrs, res, stepType, stepTypeEnd }) => {
    const edge = graph.outEdges(node)[0];

    res.push({
      stepType,
      children: [
        attrs, // group start node
        graph.getEdgeAttributes(edge), // group start edge
        ...renderBranch({
          graph,
          from: graph.target(edge),
          breakFn: ({ stepType, stepId }) => stepType === stepTypeEnd && stepId === getGroupEndStepId(node),
        }),
      ],
    });
  };

  const renderBranch = ({ graph, from, breakFn }) => {
    const res = [];

    bfsFromNode(graph, from, (node, attrs) => {
      const { stepType, stepId } = graph.getNodeAttributes(node);

      if (
        breakFn?.({
          stepId,
          stepType,
          res,
        })
      ) {
        return true;
      }

      if (!used.includes(node)) {
        // condition branches handle
        if (stepType === stepTypes.GATEWAY) {
          fillConditional({ node, attrs, res });
          // group type handle (ex. Loop, RPA etc.)
        } else if ([stepTypes.LOOP_START, stepTypes.RPA_START].includes(stepType)) {
          fillGroup({
            node,
            attrs,
            res,
            stepType: stepTypeGroups[stepType],
            stepTypeEnd: stepTypeEnds[stepType],
          });
        } else {
          fillDefault({ node, attrs, res });
        }

        used.push(node);
      }
    });

    return res;
  };
  return renderBranch({ graph, from: defaultStepIds.START });
};

export const canDropItem = (graph, node, data) => {
  // not possible to drop something in end edge
  if (data.isEnd) return false;

  try {
    const getUniqEdgesForGroupedDelegates = (sourceId, targetId) => {
      const nodesInGroup = new Set(allSimplePaths(graph, sourceId, targetId).flat());
      const uniqEdges = new Set([...nodesInGroup].map((node) => graph.edges(node)).flat());

      return [...uniqEdges];
    };

    const getAllEdgesInsideRPA = () => {
      const allEdges = graph
        .nodes()
        .filter((eachNode) => graph.getNodeAttribute(eachNode, 'stepType') === stepTypes.RPA_START)
        .map((startNode) => {
          const endNode = getGroupEndStepId(startNode);
          const allNodes = allSimplePaths(graph, startNode, endNode).flat();
          const filtered = allNodes.filter(
            (n) => ![stepTypes.RPA_START, stepTypes.RPA_END].includes(graph.getNodeAttribute(n, 'stepType'))
          );

          if (filtered.length === 0 && graph.outNeighbors(startNode)[0] === endNode) {
            return graph.inEdges(endNode).flat();
          }

          return filtered.map((n) => graph.edges(n)).flat();
        });

      return [...new Set(allEdges.flat())];
    };

    const getAllEdgesInsideLoops = () => {
      const loopStartNodes = graph
        .nodes()
        .filter((node) => graph.getNodeAttribute(node, 'stepType') === stepTypes.LOOP_START);

      const allEdges = loopStartNodes.reduce((acc, node) => {
        const allNodes = allSimplePaths(graph, node, getGroupEndStepId(node)).flat();

        const filtered = allNodes.filter((node) => {
          const stepType = graph.getNodeAttribute(node, 'stepType');
          return ![stepTypes.LOOP_START, stepTypes.LOOP_END].includes(stepType);
        });

        const edgesFromNodes = filtered.map((node) => graph.edges(node)).flat();

        acc.push(...edgesFromNodes);

        return acc;
      }, []);

      return [...new Set(allEdges)];
    };

    const getLastEdgesInsideBranch = () => {
      const allMergeNodes = graph
        .nodes()
        .filter((node) => graph.getNodeAttribute(node, 'stepType') === stepTypes.MERGE);

      return allMergeNodes.map((node) => graph.inEdges(node)).flat();
    };

    const nodeType = node.stepType || node.stepDelegateType;

    if (nodeType === stepTypes.GATEWAY) {
      return !getUniqEdgesForGroupedDelegates(node.stepId, getMergeStepId(node.stepId)).includes(`${data.stepId}`);
    }

    if (nodeType === stepTypes.LOOP_START) {
      return !getUniqEdgesForGroupedDelegates(node.stepId, getGroupEndStepId(node.stepId)).includes(`${data.stepId}`);
    }

    if (nodeType === stepTypes.LOOP_END_EARLY) {
      return (
        getAllEdgesInsideLoops().includes(`${data.stepId}`) && !graph.edges(node.stepId).includes(`${data.stepId}`)
      );
    }

    if (nodeType === stepTypes.END_PROCESSING) {
      return getLastEdgesInsideBranch().includes(`${data.stepId}`);
    }

    const allEdgesInsideRPA = getAllEdgesInsideRPA();

    if (Object.values(rpaStepTypes).includes(nodeType)) {
      return allEdgesInsideRPA.length > 0 ? allEdgesInsideRPA.includes(`${data.stepId}`) : false;
    }

    return !allEdgesInsideRPA.includes(`${data.stepId}`) && !graph.edges(node.stepId).includes(`${data.stepId}`);
  } catch {
    return true;
  }
};

export const getStringifiedOrParsedGraph = (graph, action) => {
  const getParams = (node, paramsKey) =>
    node.attributes[paramsKey]?.map((param) => ({
      ...param,
      currentValue: JSON[action](param.currentValue != null ? param.currentValue : ''),
    }));

  return {
    ...graph,
    nodes: graph.nodes.map((node) => ({
      ...node,
      attributes: {
        ...node.attributes,
        stepInputParameters: getParams(node, STEP_PARAMS.INPUT),
        stepOutputParameters: getParams(node, STEP_PARAMS.OUTPUT),
      },
    })),
  };
};

export const getNodesValidationInfo = (allParams) => {
  const countOfRequiredFields = allParams.filter(
    (param) =>
      !param.stepSettingTemplate?.isOptional &&
      !param.stepSettingTemplate?.isRecommended &&
      !param.stepSettingTemplate?.stepSettingOptions?.isHideField
  ).length;

  const completedRequiredFields = allParams.filter(
    (param) =>
      !param.stepSettingTemplate?.isOptional &&
      !param.stepSettingTemplate?.isRecommended &&
      !param.stepSettingTemplate?.stepSettingOptions?.isHideField &&
      isValueValid(param, allParams).isValid
  ).length;

  const countOfIncompleteRecommendFields = allParams.filter(
    (param) =>
      param.stepSettingTemplate?.isRecommended &&
      !param.stepSettingTemplate?.isOptional &&
      !param.stepSettingTemplate?.stepSettingOptions?.isHideField &&
      !isValueValid(param, allParams).isValid
  ).length;

  const isCustomValidationsFailed = allParams.some(
    (param) => isValueValid(param, allParams).isValidationRequired && !isValueValid(param, allParams).isValid
  );

  const countOfIncompleteRequiredFields = countOfRequiredFields - completedRequiredFields;

  const hasError = countOfIncompleteRequiredFields > 0 || isCustomValidationsFailed;
  const hasWarning = countOfIncompleteRecommendFields > 0;

  return {
    countOfRequiredFields,
    completedRequiredFields,
    countOfIncompleteRecommendFields,
    countOfIncompleteRequiredFields,
    isCustomValidationsFailed,
    hasError,
    hasWarning,
  };
};

export const validateNodes = (graph, onValidate) => {
  const nodeWithErrors = [];
  const nodeWithWarnings = [];

  const { nodes } = graph.export();

  nodes?.forEach((node) => {
    if (node.attributes?.stepInputParameters && node.attributes?.stepOutputParameters) {
      const allParams = [...node.attributes.stepInputParameters, ...node.attributes.stepOutputParameters];

      const { hasError, hasWarning } = getNodesValidationInfo(allParams);

      if (hasError) {
        nodeWithErrors.push(node.key);
      }

      if (hasWarning) {
        nodeWithWarnings.push(node.key);
      }

      updateNode(graph, node.key, { hasError, hasWarning: hasWarning && !hasError });
    }
  });

  onValidate({
    nodeWithErrors,
    nodeWithWarnings,
  });
};
