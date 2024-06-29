import { atom } from 'recoil';
import { SIDEBAR_TYPES } from '../utils/sidebar';

export const workflowEditorConfig = atom({
  key: 'workflowEditorConfig',
  default: {},
});

export const workflowEditorInitialState = atom({
  key: 'workflowEditorInitialState',
  default: {},
});

export const workflowEditorState = atom({
  key: 'workflowEditorState',
  default: {
    // Array of previous state values updated each time we push a new state
    past: [],
    // Current state value
    present: { editingStep: null, workflow: null },
    // Will contain "future" state values if we undo (so we can redo)
    future: [],
  },
});

export const workflowState = atom({
  key: 'workflowState',
  default: {
    workflowId: null,
    testCaseId: null,
    displayName: null,
    organizationId: null,
    deploymentId: null,
    status: null,
    isEditingDisabled: null,
    description: null,
    tags: null,
    createdAt: null,
    updatedAt: null,
    isFavourite: null,
    isArchived: null,
    processType: {
      id: null,
      name: null,
      description: null,
    },
  },
});

export const workflowSettingsState = atom({
  key: 'workflowSettingsState',
  default: {
    displayName: '',
    description: '',
    envParamSets: [],
    inputParamSets: [{
      name: '',
      orderNumber: 0,
      staticInputParams: [],
      dynamicInputParams: [],
    }],
    falloutDestination: '',
    processTypeId: '',
    tags: [],
  },
});

export const headerState = atom({
  key: 'headerState',
  default: {
    zoom: 100,
  },
});

export const stepDelegatesState = atom({
  key: 'stepDelegatesState',
  default: { items: [], isLoading: false },
});

export const stepDelegeatesStructureState = atom({
  key: 'stepDelegatesStructureState',
  default: {
    content: [],
    totalElements: 0,
    totalRecords: 0,
    isLoading: true,
  },
});

export const workflowSidebarState = atom({
  key: 'workflowSidebarState',
  default: {
    [SIDEBAR_TYPES.PROCESS_DETAILS]: false,
    [SIDEBAR_TYPES.VERSION_MANAGEMENT]: false
  },
});

export const expandAllStepsState = atom({
  key: 'expandAllStepsState',
  default: false, // Initial value
});