import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactFlowProvider } from 'reactflow';

import Spinner from '../../../shared/Spinner/Spinner';
import { StyledFlowEditor, StyledFlowEditorBody } from '../../shared/components/StyledFlowEditor';

import OrchestrationEditorDiagram from './components/OrchestrationEditorDiagram/OrchestrationEditorDiagram';
import OrchestrationEditorHead from './components/OrchestrationEditorHead/OrchestrationEditorHead';
import SidebarsCombiner from './components/SidebarsCombiner/SidebarsCombiner';
import { MODES } from './constants/config';
import DataProvider from './DataProvider';

const ProcessOrchestratorEditor = ({ mode = MODES.DESIGN }) => (
  <ReactFlowProvider>
    <DndProvider backend={HTML5Backend}>
      <DataProvider mode={mode}>
        {(orchestrator, isOrchestratorLoading) => (
          <StyledFlowEditor>
            {isOrchestratorLoading && <Spinner fadeBgParent medium />}
            {mode !== MODES.VIEW && (<OrchestrationEditorHead orchestrator={orchestrator} />) }
            <StyledFlowEditorBody>
              <OrchestrationEditorDiagram mode={mode} />
              <SidebarsCombiner />
            </StyledFlowEditorBody>
          </StyledFlowEditor>
        )}
      </DataProvider>
    </DndProvider>
  </ReactFlowProvider>
);

export default ProcessOrchestratorEditor;
