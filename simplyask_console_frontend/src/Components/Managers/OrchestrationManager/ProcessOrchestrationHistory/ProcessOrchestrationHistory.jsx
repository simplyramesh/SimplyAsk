import React from 'react';
import { MODES } from '../ProcessOrchestratorEditor/constants/config';
import ProcessOrchestratorEditor from '../ProcessOrchestratorEditor/ProcessOrchestratorEditor';

const ProcessOrchestrationHistory = () => {
  return (
    <ProcessOrchestratorEditor mode={MODES.HISTORY} />
  );
};

export default ProcessOrchestrationHistory;
