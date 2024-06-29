import { allSimplePaths } from 'graphology-simple-path';

import { defaultStepIds, promptText, stepTypes } from '../../../constants/graph';
import { updateNode } from '../../../services/graph';
import { STEP_PARAMS } from '../../sideMenu/SideMenu/keyConstants';

const mergeSpreadsheetsValues = (current, next) => {
  const biggerSpreadsheet = current.length > next.length ? current : next;

  return biggerSpreadsheet.map((row, index) => ({
    ...row,
    ...(current[index] || {}),
  }));
};

const getModifiedParams = (params, currentValue) => params.map((param) => {
  if (param.stepSettingTemplate.promptText === promptText.SPREADSHEET_EDITOR) {
    const targetValue = param.currentValue;

    return {
      ...param,
      currentValue: mergeSpreadsheetsValues(currentValue, targetValue),
    };
  }

  return param;
});

export const updateAllSpreadsheetsAfterCurrent = (graph, stepId, currentValue) => {
  const allSpreadsheetNodesAfterCurrent = new Set(allSimplePaths(graph, stepId, defaultStepIds.END).flat(Infinity));
  const filteredSpreadsheetNodes = [...allSpreadsheetNodesAfterCurrent].filter((node) => {
    const type = graph.getNodeAttribute(node, 'stepType');

    return node !== `${stepId}` && (type === stepTypes.CREATE_EXCEL_SPREADSHEET || type === stepTypes.UPDATE_EXCEL_DATA);
  });

  filteredSpreadsheetNodes.forEach((node) => {
    const inputParams = graph.getNodeAttribute(node, STEP_PARAMS.INPUT);
    const outputParams = graph.getNodeAttribute(node, STEP_PARAMS.OUTPUT);

    const modifiedInputParams = getModifiedParams(inputParams, currentValue);
    const modifiedOutputParams = getModifiedParams(outputParams, currentValue);

    updateNode(graph, node, {
      [STEP_PARAMS.INPUT]: modifiedInputParams,
      [STEP_PARAMS.OUTPUT]: modifiedOutputParams,
    });
  });
};

export const modifyAllSpreadsheetNodes = (graph) => {
  const allSpreadsheetNodes = allSimplePaths(graph, defaultStepIds.START, defaultStepIds.END);
  const excelRelatedNodeSets = [...allSpreadsheetNodes].map((nodes) => {
    return nodes.filter((node) => {
      const type = graph.getNodeAttribute(node, 'stepType');

      return type === stepTypes.CREATE_EXCEL_SPREADSHEET || type === stepTypes.UPDATE_EXCEL_DATA;
    });
  });

  const isSpreadsheetParam = (param) => param.stepSettingTemplate.promptText === promptText.SPREADSHEET_EDITOR;

  for (const nodes of excelRelatedNodeSets) {
    for (let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i];
      const nextNode = nodes[i + 1];

      if (nextNode) {
        const currentInputParams = graph.getNodeAttribute(currentNode, STEP_PARAMS.INPUT);
        const nextInputParams = graph.getNodeAttribute(nextNode, STEP_PARAMS.INPUT);

        const currentValue = currentInputParams.find((param) => isSpreadsheetParam(param))?.currentValue;

        const modifiedInputParams = nextInputParams.map((param) => {
          if (isSpreadsheetParam(param)) {
            const targetValue = param.currentValue;

            return {
              ...param,
              currentValue: mergeSpreadsheetsValues(currentValue, targetValue),
            };
          }

          return param;
        });

        updateNode(graph, nextNode, {
          [STEP_PARAMS.INPUT]: modifiedInputParams,
        });
      }
    }
  }
};

window.modifyAllSpreadsheetNodes = modifyAllSpreadsheetNodes;
