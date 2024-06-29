import InvokeApiIcon from '../../../../../Assets/icons/agent/generativeAgent/apiAcion.svg?component';
import TransferHumanIcon from '../../../../../Assets/icons/agent/generativeAgent/transferHumanAction.svg?component';
import TransferAgentIcon from '../../../../../Assets/icons/agent/generativeAgent/transferAgentAction.svg?component';
import KbIcon from '../../../../../Assets/icons/agent/generativeAgent/kbAction.svg?component';
import ExecuteProcessIcon from '../../../../../Assets/icons/agent/generativeAgent/executeProcessAction.svg?component';

export const ACTION_TYPES = {
  QUERY_KNOWLEDGE_BASE: 'QUERY_KNOWLEDGE_BASE',
  EXECUTE_PROCESS: 'EXECUTE_PROCESS',
  INVOKE_API: 'INVOKE_API',
  TRANSFER_TO_AGENT: 'TRANSFER_TO_AGENT',
  TRANSFER_TO_HUMAN: 'TRANSFER_TO_HUMAN',
};

export const ACTION_TYPES_OPTIONS = [
  { value: ACTION_TYPES.QUERY_KNOWLEDGE_BASE, label: 'Query Knowledge Base', Icon: KbIcon },
  { value: ACTION_TYPES.EXECUTE_PROCESS, label: 'Execute Process', Icon: ExecuteProcessIcon },
  { value: ACTION_TYPES.INVOKE_API, label: 'Invoke API', Icon: InvokeApiIcon },
  { value: ACTION_TYPES.TRANSFER_TO_AGENT, label: 'Transfer to Agent', Icon: TransferAgentIcon },
  { value: ACTION_TYPES.TRANSFER_TO_HUMAN, label: 'Transfer to Human', Icon: TransferHumanIcon },
];

export const HTTP_METHODS_OPTIONS = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'OPTIONS', value: 'OPTIONS' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'TRACE', value: 'TRACE' },
  { label: 'CONNECT', value: 'CONNECT' },
];

export const DUPLICATE_NAME_COPY = ' - Copy';
 