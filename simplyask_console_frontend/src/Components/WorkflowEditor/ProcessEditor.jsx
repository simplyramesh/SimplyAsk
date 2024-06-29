import React from 'react';
import { useParams } from 'react-router-dom';

import routes from '../../config/routes';
import {
  getWorkflow,
  getWorkflowGraph,
  getWorkflowStepDelegates,
  getWorkflowStepDelegatesFilter,
  getWorkflowStepDelegatesStructure,
  updateWorkflow,
} from '../../Services/axios/workflowEditor';
import WorkflowEditor from './components/WorkflowEditor/WorkflowEditor';

const ProcessEditor = () => {
  const { processId } = useParams();

  return (
    <WorkflowEditor
      config={{
        processId,
        isReadOnly: false,
        isTestEditor: false,
        redirectUrl: routes.PROCESS_MANAGER,
        entityIdName: 'workflowId',
        api: {
          getWorkflow,
          getWorkflowGraph,
          getWorkflowStepDelegates,
          getWorkflowStepDelegatesFilter,
          getWorkflowStepDelegatesStructure,
          updateWorkflow,
        },
      }}
    />
  );
};

export default ProcessEditor;
