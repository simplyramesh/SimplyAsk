import { atom, selector } from 'recoil';
import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { edgeConfig } from '../constants/config';
import { getSidebar } from '../utils/sidebar';
import { defaultStartStepConfig } from '../../../shared/constants/steps';

const initialSteps = [
  {
    ...defaultStartStepConfig,
    data: {
      label: 'Starting Step',
      meta: {
        hovered: false,
        touched: false
      },
      stepItems: [],
    },
  }
];
const initialEdges = [];

export const initialAgentState = {
  steps: initialSteps,
  edges: initialEdges,
  settings: null,
  agentConfiguration: { useDefaultConfiguration: true
  },
  assignedWidgets: [],
  assignedPhoneNumbers: [],
  version: 0,
  lastStepId: 0,
  stepsSidebarOpen: true,
  showIncomplete: false,
  contextMenu: {
    pane: null,
    step: null,
    panel: null,
    block: null,
  },
  copyBuffer: {
    data: null,
    type: null,
  },
  stepItemOpened: null,
  sidebarOpened: null,
};

export const agentEditorState = atom({
  key: 'agentEditorState',
  default: initialAgentState,
  dangerouslyAllowMutability: true,
});

export const initialAgentEditorStateAfterLoad = atom({
  key: 'initialAgentEditorStateAfterLoad',
  default: initialAgentState,
  dangerouslyAllowMutability: true,
});

export const agentEditorStepsUpdate = selector({
  key: 'agentEditorStepsUpdate',
  get: ({ get }) => ((get(agentEditorState).steps)),
  set: ({ set }, newSteps) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, steps: applyNodeChanges(newSteps, prevValue.steps)
    })),
  dangerouslyAllowMutability: true,
});

export const agentEditorStepsCopyBuffer = selector({
  key: 'agentEditorStepsCopyBuffer',
  get: ({ get }) => ((get(agentEditorState).copyBuffer)),
  set: ({ set }, bufferData) =>
    set(agentEditorState, prevValue => ({
      ...prevValue,
      copyBuffer: bufferData
    })),
  dangerouslyAllowMutability: true,
});

export const agentEditorEdgesUpdate = selector({
  key: 'agentEditorEdgesUpdate',
  get: ({ get }) => ((get(agentEditorState).edges)),
  set: ({ set }, newEdges) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, edges: applyEdgeChanges(newEdges, prevValue.edges)
    })),
  dangerouslyAllowMutability: true,
});

export const agentEditorEdgesAdd = selector({
  key: 'agentEditorEdgesAdd',
  get: ({ get }) => ((get(agentEditorState).edges)),
  set: ({ set }, newEdges) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, edges: addEdge({ ...edgeConfig, ...newEdges }, prevValue.edges)
    })),
  dangerouslyAllowMutability: true,
});

export const agentEditorStepsSidebarOpen = selector({
  key: 'agentEditorStepsSidebarOpen',
  get: ({ get }) => ((get(agentEditorState).stepsSidebarOpen)),
  set: ({ set }, open) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, stepsSidebarOpen: open
    })),
});

export const agentEditorShowIncomplete = selector({
  key: 'agentEditorShowIncomplete',
  get: ({ get }) => ((get(agentEditorState).showIncomplete)),
  set: ({ set }, newValue) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, showIncomplete: newValue
    })),
});

export const agentEditorContextMenu = selector({
  key: 'agentEditorContextMenu',
  get: ({ get }) => ((get(agentEditorState).contextMenu)),
  set: ({ set }, newValue) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, contextMenu: newValue
    })),
});

export const agentEditorStepItem = selector({
  key: 'agentEditorStepItem',
  get: ({ get }) => ((get(agentEditorState).stepItemOpened)),
  set: ({ set }, newValue) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, stepItemOpened: newValue
    })),
});

export const agentEditorSettings = selector({
  key: 'agentEditorSettings',
  get: ({ get }) => ((get(agentEditorState).settings)),
  set: ({ set }, newValue) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, settings: newValue
    })),
});

export const agentEditorAgentConfiguration = selector({
  key: 'agentEditorAgentConfiguration',
  get: ({ get }) => ((get(agentEditorState).agentConfiguration)),
  set: ({ set }, newValue) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, agentConfiguration: newValue
    })),
});

export const agentEditorAssociatedWidgets = selector({
  key: 'agentEditorAssociatedWidgets',
  get: ({ get }) => ((get(agentEditorState).assignedWidgets)),
  set: ({ set }, newValue) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, assignedWidgets: newValue
    })),
});

export const agentEditorAssociatedPhoneNumbers = selector({
  key: 'agentEditorAssociatedPhoneNumbers',
  get: ({ get }) => ((get(agentEditorState).assignedPhoneNumbers)),
  set: ({ set }, newValue) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, assignedPhoneNumbers: newValue
    })),
});

export const agentEditorStepId = selector({
  key: 'agentEditorStepId',
  get: ({ get }) => ((get(agentEditorState).lastStepId)),
  set: ({ set }, newValue) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, lastStepId: newValue
    })),
});

export const agentEditorSidebars = selector({
  key: 'agentEditorSidebars',
  get: ({ get }) => ((get(agentEditorState).sidebarOpened)),
  set: ({ set }, newValue) =>
    set(agentEditorState, prevValue => ({
      ...prevValue, sidebarOpened: newValue ? getSidebar(newValue): null,
    })),
});
