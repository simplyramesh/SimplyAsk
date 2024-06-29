import 'reactflow/dist/style.css';
import { Controls, Background, Panel, MiniMap } from 'reactflow';
import {
  StyledFlowEditorDiagram,
  StyledFlowEditorDiagramWrap,
  StyledFlowEditorDroppable,
} from '../../../../shared/components/StyledFlowEditor';
import React, { useCallback } from 'react';
import { config } from '../../constants/config';
import { useTheme } from '@emotion/react';
import StepDelegates from '../../../../shared/components/StepDelegates/StepDelegates';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  agentEditorContextMenu,
  agentEditorEdgesAdd,
  agentEditorEdgesUpdate,
  agentEditorStepId,
  agentEditorStepItem,
  agentEditorStepsUpdate,
} from '../../store';
import { useEditorDrop } from '../../../../shared/hooks/useEditorDrop';
import StepContextMenu from '../ContextMenus/StepContextMenu';
import { useCompetitiveStateUpdate } from '../../hooks/useСompetitiveStateUpdate';
import BlockContextMenu from '../ContextMenus/BlockContextMenu/BlockContextMenu';
import { STEP_TYPES } from '../../../../shared/constants/steps';
import { useUpdateSteps } from '../../hooks/useUpdateSteps';
import { stepDelegates } from '../../constants/stepDelegates';
import { STEP_ITEM_TYPES } from '../../constants/steps';
import { getNewlyAddedStep } from '../../utils/defaultTemplates';
import { useSharedEditorHandlers } from '../../../../shared/hooks/useSharedEditorHandlers';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useStepItemsReorder } from '../../hooks/useStepItemsReorder';

const AgentEditorDiagram = () => {
  const theme = useTheme();
  const [nodes, setNodes] = useRecoilState(agentEditorStepsUpdate);
  const [edges, setEdges] = useRecoilState(agentEditorEdgesUpdate);
  const addEdge = useSetRecoilState(agentEditorEdgesAdd);
  const [lastStepId, setLastStepId] = useRecoilState(agentEditorStepId);
  const [contextMenu, setContextMenu] = useRecoilState(agentEditorContextMenu);
  const setStepItemOpened = useSetRecoilState(agentEditorStepItem);
  const { addStep, deleteEdges } = useUpdateSteps();
  const onDragEnd = useStepItemsReorder();

  const { onConnectStart, onConnectEnd, onDragOver, onNodeMouseEnter, onNodeMouseLeave } = useSharedEditorHandlers();

  const { editorDropRef, editorWrapperRef } = useEditorDrop({
    accept: Object.values(STEP_ITEM_TYPES),
    deps: [lastStepId, addStep],
    onDrop: ({ position, stepDelegate }) => {
      const id = lastStepId + 1;
      const stringifiedId = id.toString();

      const newStep = getNewlyAddedStep({ id: stringifiedId, stepDelegate, position });

      addStep(newStep);
      setLastStepId(id);
    },
  });

  const onConnect = useCallback(
    (params) => {
      const existingEdgeId = edges.find((edge) => edge.sourceHandle === params.sourceHandle)?.id;

      if (existingEdgeId) {
        deleteEdges([{ id: existingEdgeId }]);
      }

      addEdge(params);
    },
    [edges, addEdge, deleteEdges]
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();

    if (node.type === STEP_TYPES.START) return;

    const pane = editorWrapperRef.current.getBoundingClientRect();

    setContextMenu((prev) => ({
      ...prev,
      step: {
        id: node.id,
        top: event.clientY < pane.height - 400 ? event.clientY : event.clientY - 400,
        left: event.clientX < pane.width - 250 ? event.clientX : event.clientX - 250,
      },
    }));
  }, []);

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();

    const pane = editorWrapperRef.current.getBoundingClientRect();

    setContextMenu((prev) => ({
      ...prev,
      step: {
        top: event.clientY < pane.height - 250 ? event.clientY : event.clientY - 250,
        left: event.clientX < pane.width - 250 ? event.clientX : event.clientX - 250,
      },
    }));
  }, []);

  const onPaneClick = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, step: null }));
    setStepItemOpened(null);
  }, []);

  useCompetitiveStateUpdate({ nodes });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable type={Object.values(STEP_ITEM_TYPES)} droppableId="global">
        {(provided) => (
          <StyledFlowEditorDroppable ref={provided.innerRef} {...provided.droppableProps}>
            <StyledFlowEditorDiagramWrap ref={editorWrapperRef}>
              <StyledFlowEditorDiagram
                ref={editorDropRef}
                nodes={nodes}
                edges={edges}
                onNodesChange={setNodes}
                onEdgesChange={setEdges}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onDragOver={onDragOver}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
                onNodeContextMenu={onNodeContextMenu}
                onPaneContextMenu={onPaneContextMenu}
                onPaneClick={onPaneClick}
                {...config(theme)}
              >
                <Panel position="top-left">
                  <StepDelegates stepDelegates={stepDelegates} />
                </Panel>
                <Background />
                <Controls />
                <MiniMap />
              </StyledFlowEditorDiagram>
              {!!contextMenu.step && <StepContextMenu {...contextMenu.step} editorRef={editorWrapperRef} />}
              {!!contextMenu.block && <BlockContextMenu {...contextMenu.block} editorRef={editorWrapperRef} />}
            </StyledFlowEditorDiagramWrap>
          </StyledFlowEditorDroppable>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default AgentEditorDiagram;
