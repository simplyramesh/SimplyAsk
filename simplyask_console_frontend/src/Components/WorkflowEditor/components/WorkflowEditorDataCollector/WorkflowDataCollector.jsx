import { useQuery } from '@tanstack/react-query';
import { MultiDirectedGraph } from 'graphology';
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSetRecoilState, useRecoilState } from 'recoil';

import Spinner from '../../../shared/Spinner/Spinner';
import { defaultStepIds, stepTypes } from '../../constants/graph';
import { useHistoricalRecoilState } from '../../hooks/useHistoricalRecoilState';
import { addEdge, initializeMaxEdgeId } from '../../services/graph';
import { getStringifiedOrParsedGraph } from '../../services/layout';
import {
  stepDelegatesState,
  stepDelegeatesStructureState,
  workflowEditorConfig,
  workflowEditorInitialState,
  workflowSettingsState,
  workflowState,
} from '../../store';
import { WorkflowEditorConfig } from '../../WorkflowEditorConfig';
import { CustomHelmet } from '../../../shared/REDISIGNED/CustomHelmet/CustomHelmet';

const WorkflowEditorDataCollector = ({ children }) => {
  const config = useContext(WorkflowEditorConfig);
  const navigate = useNavigate();
  const { setWithoutHistory, state } = useHistoricalRecoilState();
  const setWorkflow = useSetRecoilState(workflowState);
  const setWorkflowInitial = useSetRecoilState(workflowEditorInitialState);
  const setConfig = useSetRecoilState(workflowEditorConfig);
  const [workflowSettings, setWorkflowSettings] = useRecoilState(workflowSettingsState);
  const setStateDelegates = useSetRecoilState(stepDelegatesState);
  const setStateDelegatesCategory = useSetRecoilState(stepDelegeatesStructureState);

  const { processId, errorRedirectUrl } = config;

  const { getWorkflow, getWorkflowGraph, getWorkflowStepDelegates, getWorkflowStepDelegatesStructure } = config.api;

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['workflow', processId],
    queryFn: () =>
      Promise.all([
        getWorkflow(processId),
        getWorkflowStepDelegates(processId),
        getWorkflowStepDelegatesStructure(processId),
        getWorkflowGraph(processId),
      ]),
  });

  useEffect(() => {
    if (isError) {
      toast.error('Something went wrong');
      errorRedirectUrl && navigate(`${errorRedirectUrl}`);
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && data) {
      const initializeWorkflow = (graphData, stepDelegates) => {
        const graph = new MultiDirectedGraph();

        if (graphData.edges.length && graphData.nodes.length) {
          const getAllNumericKeys = (entity) =>
            graphData[entity].map((i) => parseInt(i.key, 10)).filter((i) => Boolean(i));
          const nodeKeys = getAllNumericKeys('nodes');
          const edgeKeys = getAllNumericKeys('edges');
          const finalNodeKeys = nodeKeys.length ? nodeKeys : [1];
          const finalEdgeKeys = edgeKeys.length ? edgeKeys : [1];
          window.nodesCount = Math.max(...finalNodeKeys);
          window.edgesCount = Math.max(...finalEdgeKeys);
          window.maxEdgeId = Math.max(...finalEdgeKeys);

          graph.import(graphData);

          initializeMaxEdgeId(graph);
        } else {
          const startStep = stepDelegates.find((stepDelegate) => stepDelegate.stepDelegateType === stepTypes.START);
          const endStep = stepDelegates.find((stepDelegate) => stepDelegate.stepDelegateType === stepTypes.END);

          graph.addNode(defaultStepIds.START, {
            stepId: defaultStepIds.START,
            stepType: stepTypes.START,
            ...startStep,
          });
          graph.addNode(defaultStepIds.END, { stepId: defaultStepIds.END, stepType: stepTypes.END, ...endStep });
          addEdge({
            graph,
            source: defaultStepIds.START,
            target: defaultStepIds.END,
          });

          window.nodesCount = 1;
          window.edgesCount = 1;
          window.maxEdgeId = 1;

          initializeMaxEdgeId(graph);
        }

        const workflow = graph.export();

        setWithoutHistory({
          past: [],
          present: {
            workflow,
            editingStep: null,
          },
          future: [],
        });

        setWorkflowInitial(workflow);
      };

      if (data) {
        const [workflow, stepDelegatesState, stepDelegatesStructure, graphData] = data;
        const graphWithParsedValues = getStringifiedOrParsedGraph(graphData, 'parse');

        setWorkflow(workflow);
        setStateDelegates({ items: stepDelegatesState, isLoading: false });
        setStateDelegatesCategory({
          content: stepDelegatesStructure.content,
          totalElements: stepDelegatesStructure.totalElements,
          totalRecords: stepDelegatesStructure.totalRecords,
          isLoading: false,
        });
        setWorkflowSettings({
          ...graphWithParsedValues.attributes,
          inputParamSets: graphWithParsedValues.attributes.inputParamSets.length
            ? graphWithParsedValues.attributes.inputParamSets
            : [
                {
                  name: '',
                  orderNumber: 0,
                  staticInputParams: [],
                  dynamicInputParams: [],
                },
              ],
          processTypeId: workflow.processType?.id ?? null,
        });

        initializeWorkflow(graphWithParsedValues, stepDelegatesState);
      }
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (config) {
      setConfig(config);
    }
  }, [config]);

  useEffect(
    () => () => {
      setWithoutHistory({
        past: [],
        // Current state value
        present: { editingStep: null, workflow: null },
        // Will contain "future" state values if we undo (so we can redo)
        future: [],
      });
    },
    []
  );

  return (
    <>
      <CustomHelmet dynamicText={workflowSettings?.displayName} />
      {isLoading || !state.workflow ? <Spinner small parent /> : children}
    </>
  );
};

WorkflowEditorDataCollector.propTypes = {
  children: PropTypes.node,
};

export default WorkflowEditorDataCollector;
