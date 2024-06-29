import React from 'react';
import { MODES } from '../../../ProcessOrchestratorEditor/constants/config';
import ProcessOrchestratorEditor from '../../../ProcessOrchestratorEditor/ProcessOrchestratorEditor';

const OrchestratorViewMode = () => {
  return (
    <ProcessOrchestratorEditor mode={MODES.VIEW} />
  );
};

export default OrchestratorViewMode;
