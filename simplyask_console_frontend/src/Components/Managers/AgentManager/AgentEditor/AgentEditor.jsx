import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactFlowProvider } from 'reactflow';
import { useRecoilState } from 'recoil';
import AgentEditorDiagram from './components/AgentEditorDiagram/AgentEditorDiagram';
import AgentEditorHead from './components/AgentEditorHead/AgentEditorHead';
import DataProvider from './DataProvider';
import { agentEditorState, initialAgentState } from './store';
import { StyledFlowEditor, StyledFlowEditorBody } from '../../shared/components/StyledFlowEditor';
import Spinner from '../../../shared/Spinner/Spinner';
import SidebarsCombiner from './components/SidebarsCombiner/SidebarsCombiner';
import { CustomHelmet } from '../../../shared/REDISIGNED/CustomHelmet/CustomHelmet';

const AgentEditor = () => {
  const [agentEditor, setAgentEditor] = useRecoilState(agentEditorState);

  useEffect(() => {
    return () => {
      setAgentEditor(initialAgentState);
    };
  }, []);

  return (
    <ReactFlowProvider>
      <CustomHelmet dynamicText={agentEditor?.settings?.name} />
      <DndProvider backend={HTML5Backend}>
        <DataProvider>
          {(isAgentLoading) => (
            <StyledFlowEditor>
              {isAgentLoading && <Spinner fadeBgParent medium />}
              <AgentEditorHead />
              <StyledFlowEditorBody>
                <AgentEditorDiagram />
                <SidebarsCombiner />
              </StyledFlowEditorBody>
            </StyledFlowEditor>
          )}
        </DataProvider>
      </DndProvider>
    </ReactFlowProvider>
  );
};

export default AgentEditor;
