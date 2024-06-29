import React, { memo } from 'react';
import KnowledgeBaseSelect from '../../../AgentEditor/components/sideForms/ActionsSidebar/KnowledgeBaseSelect/KnowledgeBaseSelect';

const QueryKnowledgeBase = ({ data, onChange, error }) => {
  return (
    <KnowledgeBaseSelect
      value={data.knowledgeBaseId}
      onChange={(val) => onChange(val, ['data', 'knowledgeBaseId'])}
      invalid={error}
      hasManage={false}
      placeholder="Select Knowledge Base"
      toolTipText="Select a single, existing Knowledge Base to be queried"
    />
  );
};

export default memo(QueryKnowledgeBase);
