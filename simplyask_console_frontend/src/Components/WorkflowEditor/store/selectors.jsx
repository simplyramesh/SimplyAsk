import { MultiDirectedGraph } from 'graphology';
import { allSimplePaths } from 'graphology-simple-path';
import { selector } from 'recoil';
import { defaultStepIds, promptText, stepTypes } from '../constants/graph';
import {
  stepDelegatesState,
  workflowEditorInitialState,
  workflowEditorState,
  workflowSettingsState,
  workflowState,
  workflowSidebarState,
} from './index';
import { PARAM_SOURCES, PARAM_TYPES } from "../constants/layout";
import { STEP_INPUT_TYPE_KEYS } from "../components/sideMenu/SideMenu/keyConstants";

window.allSimplePaths = allSimplePaths;

export const initialWorkflowState = selector({
  key: 'initialWorkflowState',
  get: ({ get }) => {
    const workflowGraph = get(workflowEditorInitialState);
    const workflowInfo = get(workflowState);

    return {
      workflowGraph,
      workflowInfo,
    };
  },
});

export const editingStep = selector({
  key: 'editingStep',
  get: ({ get }) => {
    const state = get(workflowEditorState);

    return state?.present.editingStep;
  },
});

export const canSubmit = selector({
  key: 'canSubmit',
  get: ({ get }) => {
    const state = get(workflowEditorState);

    const { workflow } = state?.present;

    if (workflow) {
      const graph = new MultiDirectedGraph().import(workflow);

      return graph.nodes().every((node) => !graph.getNodeAttributes(node).hasError);
    }

    return false;
  },
});

export const staticStepDelegates = selector({
  key: 'staticStepDelegates',
  get: ({ get }) => {
    const state = get(stepDelegatesState);

    return state.items?.reduce((acc, item) => {
      acc[item.stepDelegateType] = item;

      return acc;
    }, {});
  },
});

export const fullyAndPotentiallyParams = selector({
  key: 'fullyAndPotentiallyParams',
  get: ({ get }) => {
    const state = get(workflowEditorState);
    const { inputParamSets } = get(workflowSettingsState);
    const staticInputParams = inputParamSets[0].staticInputParams?.map((param) => ({
        ...param,
        source: PARAM_SOURCES.DEFAULT_PARAMS,
    }));
    const dynamicInputParams = inputParamSets[0].dynamicInputParams.map((param) => ({
      ...param,
      source: param.isEnvParam ? PARAM_SOURCES.ENV_PARAMS : PARAM_SOURCES.INPUT_PARAMS,
    }));

    const { workflow, editingStep } = state?.present;

    if (workflow) {
      const graph = new MultiDirectedGraph().import(workflow);
      const fullyParams = [];
      const potentiallyParams = [];

      if (editingStep && graph.hasNode(editingStep.stepId)) {
        const paths = allSimplePaths(graph, defaultStepIds.START, editingStep.stepId);

        let hasMetMerge = false;

        paths.forEach((path) => {
          [...path.reverse()].forEach((step) => {
            if (`${step}` !== `${editingStep.stepId}`) {
              const attrs = graph.getNodeAttributes(step);

              if (hasMetMerge) {
                if (attrs.stepOutputParameters?.length) {
                  const paramsWithId = attrs.stepOutputParameters
                    .map((param) => ({ ...param, stepId: step, stepName: attrs.displayName }));

                  potentiallyParams.push(...paramsWithId);
                }
              } else if (attrs.stepType !== stepTypes.MERGE) {
                if (attrs.stepOutputParameters?.length) {
                  const paramsWithId = attrs.stepOutputParameters
                    .map((param) => ({ ...param, stepId: step, stepName: attrs.displayName }))

                  fullyParams.push(...paramsWithId);
                }
              } else {
                hasMetMerge = true;
              }
            }
          });
        });
      }

      const getFormattedPrevStepsParams = (params) => {
        return params
          .filter((i) => !!i.currentValue)
          .map(({ currentValue, stepSettingTemplate, stepId, stepName }) => {
            if (typeof currentValue === 'string' || typeof currentValue === 'number') {
              return {
                label: `${currentValue}`,
                value: currentValue,
                source: PARAM_SOURCES.STEP_PARAMS,
                stepId,
                stepName,
                stepSettingTemplate,
              };
            }

            if (Array.isArray(currentValue) && stepSettingTemplate.promptText === promptText.API_RESPONSE_DATA) {
              return currentValue.map((item) => ({
                ...item,
                label: item.label,
                source: PARAM_SOURCES.STEP_PARAMS,
                stepId,
                stepName,
                stepSettingTemplate,
              }));
            }

            return {
              ...currentValue,
              source: PARAM_SOURCES.STEP_PARAMS,
              stepId,
              stepName,
              stepSettingTemplate,
            };
          })
          .flat();
      };

      const getMappedSettingsParams = (params) =>
        params.map((value) => ({
          label: value.paramName,
          source: value.source,
          value,
        }));

      const getUniqueTypedParams = (params, type) => {
        return params.reduce((acc, param) => {
          const id = param.stepSettingTemplate?.stepSettingTemplateId;
          const inputType = param.stepSettingTemplate?.stepSettingsInputType;
          const alreadyHasTemplateId = acc.some((item) => item.stepSettingTemplate?.stepSettingTemplateId === id);
          /* if param is already in the list
          and if it is a rest body parameter or api parameter,
          and if it is a step parameter - change source to multiple places and squash them to 1 param */
          if (alreadyHasTemplateId && param.source === PARAM_SOURCES.STEP_PARAMS && ![
            STEP_INPUT_TYPE_KEYS.REST_BODY_PARAMETER_LIST,
            STEP_INPUT_TYPE_KEYS.API_PARAMETER_LIST
          ].includes(inputType)) {
            acc = acc.map((item) => item.stepSettingTemplate?.stepSettingTemplateId === id ? {
              ...item,
              label: item.stepSettingTemplate?.displayName,
              source: PARAM_SOURCES.MULTIPLE_PLACES,
            } : item);
            // if param with the same label already in the list - squash them to 1 param
          } else if (acc.some((item) => item.label === param.label)) {
            acc = acc.map((item) => item.label === param.label ? {
              ...item,
              source: PARAM_SOURCES.MULTIPLE_STEPS,
            } : item);
          } else {
            acc.push(param);
          }



          return acc;
        }, []).map(param => ({ ...param, type }));
      }

      const mappedStaticParams = getMappedSettingsParams(staticInputParams);
      const mappedDynamicParams = getMappedSettingsParams(dynamicInputParams, PARAM_SOURCES.INPUT_PARAMS);

      const fullyParamsArr = [
        ...getFormattedPrevStepsParams(fullyParams),
        ...mappedStaticParams,
        ...mappedDynamicParams.filter((param) => param.isRequired),
      ];

      const potentiallyParamsArr = [
        ...getFormattedPrevStepsParams(potentiallyParams),
        ...mappedDynamicParams.filter((param) => !param.isRequired),
      ];

      const fully = getUniqueTypedParams(fullyParamsArr, PARAM_TYPES.FULLY_AVAILABLE);
      const potentially = getUniqueTypedParams(potentiallyParamsArr, PARAM_TYPES.POTENTIALLY_AVAILABLE);

      const groupedParams = [
        {
          label: 'Fully available parameters',
          options: fully,
        },
        {
          label: 'Potentially available parameters',
          options: potentially,
        },
      ];

      const flatParams = [...fully, ...potentially];

      return {
        groupedParams,
        flatParams
      };
    }

    return {
      groupedParams: [],
      flatParams: [],
    };
  },
});

export const workflowEditorSidebars = selector({
  key: 'workflowEditorSidebars',
  get: ({ get }) => get(workflowSidebarState),
  set: ({ set }, { type, open }) =>
    set(workflowSidebarState, (prevValue) => ({
      ...prevValue,
      [type]: open,
    })),
});
