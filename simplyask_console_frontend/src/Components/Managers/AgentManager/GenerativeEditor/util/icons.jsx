import InvokeApiIcon from '../../../../../Assets/icons/agent/generativeAgent/apiAcion.svg?component';
import TransferHumanIcon from '../../../../../Assets/icons/agent/generativeAgent/transferHumanAction.svg?component';
import TransferAgentIcon from '../../../../../Assets/icons/agent/generativeAgent/transferAgentAction.svg?component';
import KbIcon from '../../../../../Assets/icons/agent/generativeAgent/kbAction.svg?component';
import ExecuteProcessIcon from '../../../../../Assets/icons/agent/generativeAgent/executeProcessAction.svg?component';
import PlusIcon from '../../../../../Assets/icons/agent/generativeAgent/plusAction.svg?component';
import { ACTION_TYPES } from '../constants/core';

export const getActionIcon = (type) => {
  switch (type) {
    case ACTION_TYPES.INVOKE_API:
      return <InvokeApiIcon />;
    case ACTION_TYPES.EXECUTE_PROCESS:
      return <ExecuteProcessIcon />;
    case ACTION_TYPES.TRANSFER_TO_AGENT:
      return <TransferAgentIcon />;
    case ACTION_TYPES.TRANSFER_TO_HUMAN:
      return <TransferHumanIcon />;
    case ACTION_TYPES.QUERY_KNOWLEDGE_BASE:
      return <KbIcon />;
    default:
      return <PlusIcon />;
  }
};
