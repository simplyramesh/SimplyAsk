import StructuredIcon from '../../../../Assets/icons/agent/generativeAgent/structuredBranch.svg?component';
import AiTextIcon from '../../../../Assets/icons/agent/generativeAgent/aiText.svg?component';

export const AGENT_QUERY_KEYS = {
  GET_AGENTS: 'GET_AGENTS',
  GET_AGENT_DETAILS: 'GET_AGENT_DETAILS',
  GET_AGENT_ACTIONS: 'GET_AGENT_ACTIONS',
  UPDATE_AGENT: 'UPDATE_AGENT',
  GET_AGENT_INTENTS: 'GET_AGENT_INTENTS',
};

export const SHOW_AGENT_MANAGER_MODAL_TYPES = {
  DUPLICATE_AGENT: 'DUPLICATE_AGENT',
  IMPORT_NEW_AGENT: 'IMPORT_NEW_AGENT',
  IMPORT_AND_REPLACE_AGENT: 'IMPORT_AND_REPLACE_AGENT',
};

export const AgentTypeOptions = [
  {
    label: 'Generative (Recommended)',
    value: 'GENERATIVE',
    Icon: AiTextIcon,
  },
  {
    label: 'Structured',
    value: 'STRUCTURED',
    Icon: StructuredIcon,
  },
];

export const AGENT_EDITION = {
  GENERATIVE: 'GENERATIVE',
  STRUCTURED: 'STRUCTURED',
};
