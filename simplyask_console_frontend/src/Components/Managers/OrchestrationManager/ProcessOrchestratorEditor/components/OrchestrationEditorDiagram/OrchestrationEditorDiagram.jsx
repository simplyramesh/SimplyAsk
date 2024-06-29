import 'reactflow/dist/style.css';
import { useTheme } from '@emotion/react';
import { useCallback, useRef, useState } from 'react';
import {
  Controls, Background, Panel, MiniMap, useOnSelectionChange,
} from 'reactflow';
import { useRecoilState, useSetRecoilState } from 'recoil';

import StepDelegates from '../../../../shared/components/StepDelegates/StepDelegates';
import { StyledFlowEditorDiagram, StyledFlowEditorDiagramWrap } from '../../../../shared/components/StyledFlowEditor';
import { STEP_TYPES } from '../../../../shared/constants/steps';
import { useEditorDrop } from '../../../../shared/hooks/useEditorDrop';
import { useSharedEditorHandlers } from '../../../../shared/hooks/useSharedEditorHandlers';
import { config, MODES } from '../../constants/config';
import { CONTEXT_MENU_TYPES } from '../../constants/contextMenu';
import { STEP_ITEM_TYPES, stepDelegates } from '../../constants/stepDelegates';
import { useUpdateSteps } from '../../hooks/useUpdateSteps';
import {
  orchestratorContextMenu,
  orchestratorEdgesAdd,
  orchestratorEdgesUpdate,
  orchestratorStepDetailsOpened,
  orchestratorStepId,
  orchestratorStepsUpdate,
  orchestratorEdgesRemoveById,
  orchestratorEdgesUpdateTargetNode,
} from '../../store';
import { getNewlyAddedProcess } from '../../utils/defaultTemplates';
import { SIDEBAR_TYPES } from '../../utils/sidebar';
import EdgeContextMenu from '../ContextMenus/EdgeContextMenu/EdgeContextMenu';
import NodeContextMenu from '../ContextMenus/NodeContextMenu/NodeContextMenu';
import PaneContextMenu from '../ContextMenus/PaneContextMenu/PaneContextMenu';

const OrchestrationEditorDiagram = ({ mode }) => {
  const theme = useTheme();
  const [nodes, setNodes] = useRecoilState(orchestratorStepsUpdate);
  const [edges, setEdges] = useRecoilState(orchestratorEdgesUpdate);
  const addEdge = useSetRecoilState(orchestratorEdgesAdd);
  const [lastStepId, setLastStepId] = useRecoilState(orchestratorStepId);
  const [contextMenu, setContextMenu] = useRecoilState(orchestratorContextMenu);
  const setStepOpened = useSetRecoilState(orchestratorStepDetailsOpened);
  const removeEdgeId = useSetRecoilState(orchestratorEdgesRemoveById);
  const updateEdgeTarget = useSetRecoilState(orchestratorEdgesUpdateTargetNode);
  const [hoveredEdge, setHoveredEdge] = useState(null);

  const { addStep } = useUpdateSteps();
  const edgeUpdateSuccessful = useRef(true);

  const isEditMode = mode === MODES.DESIGN;

  const {
    onConnectStart,
    onConnectEnd,
    onDragOver,
    onNodeMouseEnter,
    onNodeMouseLeave,
  } = useSharedEditorHandlers();

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      const [selectedNode] = nodes;

      if (selectedNode) {
        const type = mode === MODES.HISTORY ? SIDEBAR_TYPES.PROCESS_EXECUTION_DETAILS : SIDEBAR_TYPES.PROCESS_EDIT;
        const node = nodes.find((node) => node.id === selectedNode.id);
        setStepOpened({ type, payload: node });
      } else {
        setStepOpened(null);
      }
    },
  });

  const { editorDropRef, editorWrapperRef } = useEditorDrop({
    accept: Object.values(STEP_ITEM_TYPES),
    deps: [lastStepId, addStep],
    onDrop: ({ position }) => {
      const id = lastStepId + 1;
      const stringifiedId = id.toString();

      const newProcess = getNewlyAddedProcess({ id: stringifiedId, position });

      addStep(newProcess);

      setLastStepId(id);
    },
  });

  const onConnect = useCallback((params) => {
    addEdge(params);
  }, [edges, addEdge]);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();

      if (node.type === STEP_TYPES.START) return;

      const pane = editorWrapperRef.current.getBoundingClientRect();

      setContextMenu(() => ({
        type: CONTEXT_MENU_TYPES.NODE,
        id: node.id,
        top: event.clientY < pane.height - 200 ? event.clientY : event.clientY - 200,
        left: event.clientX < pane.width - 250 ? event.clientX : event.clientX - 250,
      }));
    },
    [],
  );

  const onPaneContextMenu = useCallback(
    (event) => {
      event.preventDefault();

      const pane = editorWrapperRef.current.getBoundingClientRect();

      setContextMenu(() => ({
        type: CONTEXT_MENU_TYPES.PANE,
        top: event.clientY < pane.height - 250 ? event.clientY : event.clientY - 250,
        left: event.clientX < pane.width - 250 ? event.clientX : event.clientX - 250,
      }));
    },
    [],
  );

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  const onEdgeUpdateStart = useCallback((_, edge) => {
    setHoveredEdge(edge);

    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((selectedEdge, newConnection) => {
    // This fn only fires when an edge is dragged and dropped
    // onto a target node.
    // NOTE THAT when an edge is dropped on non-node area, then this fn isn't triggered

    updateEdgeTarget({
      selectedEdgeId: selectedEdge.id,
      newConnection,
    });

    edgeUpdateSuccessful.current = true;
  }, []);

  const onEdgeUpdateEnd = useCallback((_, selectedEdge) => {
    if (!edgeUpdateSuccessful.current) {
      removeEdgeId(selectedEdge.id);
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const onEdgeClick = useCallback((event, selectedEdge) => {
    setContextMenu(() => ({
      type: CONTEXT_MENU_TYPES.EDGE,
      id: selectedEdge?.id,
      top: event.clientY,
      left: event.clientX,
    }));
  }, []);

  const onContextMenu = useCallback((event) => {
    // Prevent the default browser's context menu
    event.preventDefault();

    onEdgeClick(event, hoveredEdge);
  }, [hoveredEdge]);

  const onEdgeMouseEnter = useCallback((_, selectedEdge) => {
    setHoveredEdge(selectedEdge);
  }, []);

  return (
    <StyledFlowEditorDiagramWrap ref={editorWrapperRef}>
      <StyledFlowEditorDiagram
        ref={editorDropRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onConnectStart={onConnectStart}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onDragOver={onDragOver}
        {...(isEditMode && {
          onEdgeUpdate,
          onEdgeUpdateStart,
          onEdgeUpdateEnd,
          onEdgeClick,
          onContextMenu,
          onEdgeMouseEnter,
          onEdgeMouseLeave: () => setHoveredEdge(null),
        })}
        {...config(mode, theme)}
      >
        <Panel position="top-left">
          {![MODES.VIEW, MODES.HISTORY].includes(mode) && <StepDelegates stepDelegates={stepDelegates} />}
        </Panel>
        <Background />
        {mode !== MODES.HISTORY && <Controls />}
        <MiniMap />
      </StyledFlowEditorDiagram>
      {contextMenu?.type === CONTEXT_MENU_TYPES.NODE && <NodeContextMenu {...contextMenu} editorRef={editorWrapperRef} />}
      {contextMenu?.type === CONTEXT_MENU_TYPES.PANE && <PaneContextMenu {...contextMenu} editorRef={editorWrapperRef} />}
      {contextMenu?.type === CONTEXT_MENU_TYPES.EDGE && <EdgeContextMenu {...contextMenu} editorRef={editorWrapperRef} />}
    </StyledFlowEditorDiagramWrap>
  );
};

export default OrchestrationEditorDiagram;
