import React from 'react';
import { useParams } from 'react-router-dom';
import { useAgentById } from './AgentEditor/hooks/useAgentById';
import Spinner from '../../shared/Spinner/Spinner';
import { AGENT_EDITION } from './constants/core';
import AgentEditor from './AgentEditor/AgentEditor';
import GenerativeEditor from './GenerativeEditor/GenerativeEditor';

const AgentEditorsCombiner = () => {
  const { serviceTypeId } = useParams();

  const { agent, isAgentLoading } = useAgentById(serviceTypeId);

  if (isAgentLoading) return <Spinner fadeBgParent medium />;

  switch (agent?.edition) {
    case AGENT_EDITION.GENERATIVE:
      return <GenerativeEditor agent={agent} />;
    case AGENT_EDITION.STRUCTURED:
      return <AgentEditor />;
    default:
      return null;
  }
};

export default AgentEditorsCombiner;
