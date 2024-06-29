import PropTypes from 'prop-types';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { WorkflowEditorConfig } from '../../WorkflowEditorConfig';
import WorkflowEditorCore from '../WorkflowEditorCore/WorkflowEditorCore';
import WorkflowEditorDataCollector from '../WorkflowEditorDataCollector/WorkflowDataCollector';

const WorkflowEditor = ({ config }) => (
  <WorkflowEditorConfig.Provider value={config}>
    <DndProvider backend={HTML5Backend}>
      <WorkflowEditorDataCollector>
        <WorkflowEditorCore />
      </WorkflowEditorDataCollector>
    </DndProvider>
  </WorkflowEditorConfig.Provider>
);

WorkflowEditor.propTypes = {
  config: PropTypes.shape({
    isTestEditor: PropTypes.bool,
    isEmbeddedSideModalData: PropTypes.bool,
    redirectUrl: PropTypes.string,
    entityIdName: PropTypes.string,
    api: PropTypes.shape({
      getWorkflow: PropTypes.func,
      getWorkflowGraph: PropTypes.func,
      getWorkflowStepDelegates: PropTypes.func,
      getWorkflowStepDelegatesFilter: PropTypes.func,
      getWorkflowStepDelegatesStructure: PropTypes.func,
      updateWorkflow: PropTypes.func,
    }),
  }),
};

export default WorkflowEditor;
