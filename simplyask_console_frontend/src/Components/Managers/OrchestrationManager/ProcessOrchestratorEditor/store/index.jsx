import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { atom, selector } from 'recoil';

import { defaultStartStepConfig } from '../../../shared/constants/steps';
import { edgeConfig } from '../constants/config';
import { getSidebar } from '../utils/sidebar';

const initialSteps = [
  {
    ...defaultStartStepConfig,
    id: '0',
    selectable: false,
    data: {
      label: 'Start Execution',
      job: {
        id: null,
      },
      meta: {
        hovered: false,
        touched: false,
      },
    },
  },
];
const initialEdges = [];

export const initialOrchestratorState = {
  mode: null,
  id: null,
  name: '',
  description: '',
  tags: [],
  steps: initialSteps,
  edges: initialEdges,
  version: 0,
  lastStepId: 0,
  contextMenu: null,
  copyBuffer: {
    data: null,
    type: null,
  },
  stepDetailsOpened: null,
};

export const orchestratorState = atom({
  key: 'orchestratorState',
  default: initialOrchestratorState,
  dangerouslyAllowMutability: true,
});

export const orchestratorStepsUpdate = selector({
  key: 'orchestratorStepsUpdate',
  get: ({ get }) => ((get(orchestratorState).steps)),
  set: ({ set }, newSteps) => set(orchestratorState, (prevValue) => ({
    ...prevValue, steps: applyNodeChanges(newSteps, prevValue.steps),
  })),
  dangerouslyAllowMutability: true,
});

export const orchestratorEdgesUpdate = selector({
  key: 'orchestratorEdgesUpdate',
  get: ({ get }) => ((get(orchestratorState).edges)),
  set: ({ set }, newEdges) => set(orchestratorState, (prevValue) => ({
    ...prevValue, edges: applyEdgeChanges(newEdges, prevValue.edges),
  })),
  dangerouslyAllowMutability: true,
});

export const orchestratorEdgesRemoveById = selector({
  key: 'orchestratorEdgesRemoveById',
  get: ({ get }) => ((get(orchestratorState).edges)),
  set: ({ set }, selectedEdgeId) => set(orchestratorState, (prevValue) => ({
    ...prevValue, edges: prevValue.edges?.filter((edge) => edge.id !== selectedEdgeId),
  })),
  dangerouslyAllowMutability: true,
});

export const orchestratorEdgesUpdateTargetNode = selector({
  key: 'orchestratorEdgesUpdateTargetNode',
  get: ({ get }) => ((get(orchestratorState).edges)),
  set: ({ set }, { selectedEdgeId, newConnection }) => set(orchestratorState, (prevValue) => ({
    ...prevValue,
    edges: prevValue.edges?.map((edge) => {
      if (edge.id === selectedEdgeId) {
        return { ...edge, ...newConnection };
      }
      return edge;
    }),
  })),
  dangerouslyAllowMutability: true,
});

export const orchestratorEdgesAdd = selector({
  key: 'orchestratorEdgesAdd',
  get: ({ get }) => ((get(orchestratorState).edges)),
  set: ({ set }, newEdges) => set(orchestratorState, (prevValue) => ({
    ...prevValue, edges: addEdge({ ...edgeConfig, ...newEdges }, prevValue.edges),
  })),
  dangerouslyAllowMutability: true,
});

export const orchestratorStepId = selector({
  key: 'orchestratorStepId',
  get: ({ get }) => ((get(orchestratorState).lastStepId)),
  set: ({ set }, newValue) => set(orchestratorState, (prevValue) => ({
    ...prevValue, lastStepId: newValue,
  })),
  dangerouslyAllowMutability: true,
});

export const orchestratorStepsCopyBuffer = selector({
  key: 'orchestratorStepsCopyBuffer',
  get: ({ get }) => ((get(orchestratorState).copyBuffer)),
  set: ({ set }, bufferData) => set(orchestratorState, (prevValue) => ({
    ...prevValue,
    copyBuffer: bufferData,
  })),
  dangerouslyAllowMutability: true,
});

export const orchestratorContextMenu = selector({
  key: 'orchestratorContextMenu',
  get: ({ get }) => ((get(orchestratorState).contextMenu)),
  set: ({ set }, newValue) => set(orchestratorState, (prevValue) => ({
    ...prevValue, contextMenu: newValue,
  })),
  dangerouslyAllowMutability: true,
});

export const orchestratorStepDetailsOpened = selector({
  key: 'orchestratorStepDetailsOpened',
  get: ({ get }) => ((get(orchestratorState).stepDetailsOpened)),
  set: ({ set }, newValue) => set(orchestratorState, (prevValue) => ({
    ...prevValue, stepDetailsOpened: newValue ? getSidebar(newValue) : null,
  })),
  dangerouslyAllowMutability: true,
});

export const orchestratorMode = selector({
  key: 'orchestratorMode',
  get: ({ get }) => ((get(orchestratorState).mode)),
  dangerouslyAllowMutability: true,
});
