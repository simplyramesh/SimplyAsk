import { atom, selector } from 'recoil';
import { generateUUID } from '../../../../Settings/AccessManagement/utils/helpers';
import { getErrors } from '../../../shared/utils/validation';
import { objectiveDefaultTemplate } from '../util/objective';
import { generativeEditorSchema } from '../util/validationSchemas';

export const initialGenerativeAgentState = {
  greetingEnabled: true,
  greeting: 'Greet the user and ask them what they need to support with.',
  objectives: [objectiveDefaultTemplate(generateUUID())],
  topics: [],
  modelConfig: {
    id: null,
    persona: '',
    model: 2,
    enhanceQuery: false,
    validateResponse: false,
    includeReferences: false,
    translateOutput: false,
    maxResponseLength: 128,
    responseVariability: 0.7,
    isDeleted: false,
  },
  actionOpened: null,
  actionDragging: null,
  errors: {},
};

export const generativeEditorState = atom({
  key: 'generativeEditorState',
  default: initialGenerativeAgentState,
  dangerouslyAllowMutability: true,
});

export const generativeEditorInitialState = atom({
  key: 'generativeEditorInitialState',
  default: initialGenerativeAgentState,
  dangerouslyAllowMutability: true,
});


export const generativeEditorObjectivesState = selector({
  key: 'generativeEditorObjectivesState',
  get: ({ get }) => get(generativeEditorState).objectives,
  set: ({ set }, objectives) =>
    set(generativeEditorState, (prevValue) => ({
      ...prevValue,
      objectives,
    })),
  dangerouslyAllowMutability: true,
});

export const generativeEditorErrors = selector({
  key: 'generativeEditorErrors',
  get: ({ get }) => {
    const { objectives, modelConfig, topics, greeting, greetingEnabled } = get(generativeEditorState);
    return getErrors({
      schema: generativeEditorSchema,
      data: { objectives, modelConfig, topics, greeting, greetingEnabled },
    });
  },
  dangerouslyAllowMutability: true,
});

export const generativeEditorTopicsState = selector({
  key: 'generativeEditorTopicsState',
  get: ({ get }) => get(generativeEditorState).topics,
  set: ({ set }, topics) =>
    set(generativeEditorState, (prevValue) => ({
      ...prevValue,
      topics,
    })),
  dangerouslyAllowMutability: true,
});

export const generativeEditorConfigurationState = selector({
  key: 'generativeEditorConfigurationState',
  get: ({ get }) => get(generativeEditorState).modelConfig,
  set: ({ set }, modelConfig) =>
    set(generativeEditorState, (prevValue) => ({
      ...prevValue,
      modelConfig,
    })),
  dangerouslyAllowMutability: true,
});

export const generativeEditorActionOpened = selector({
  key: 'generativeEditorActionOpened',
  get: ({ get }) => get(generativeEditorState).actionOpened,
  set: ({ set }, actionOpened) =>
    set(generativeEditorState, (prevValue) => ({
      ...prevValue,
      actionOpened,
    })),
  dangerouslyAllowMutability: true,
});

export const generativeEditorActionDragging = selector({
  key: 'generativeEditorActionDragging',
  get: ({ get }) => get(generativeEditorState).actionDragging,
  set: ({ set }, actionDragging) =>
    set(generativeEditorState, (prevValue) => ({
      ...prevValue,
      actionDragging,
    })),
  dangerouslyAllowMutability: true,
});
