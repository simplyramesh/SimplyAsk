import { useCustomDrop } from './useCustomDrop';
import { useRef } from 'react';
import { useReactFlow } from 'reactflow';

export const useEditorDrop = ({
  accept,
  onDrop,
  deps = []
}) => {
  const reactFlowInstance = useReactFlow();
  const editorWrapperRef = useRef(null);

  const { dropRef: editorDropRef } = useCustomDrop({
    accept,
    onDrop: (stepDelegate, coordinates) => {
      const reactFlowBounds = editorWrapperRef.current.getBoundingClientRect();

      const position = reactFlowInstance.project({
        x: coordinates.x - reactFlowBounds.left,
        y: coordinates.y - reactFlowBounds.top,
      })

      onDrop({ position, stepDelegate })
    }
  }, [reactFlowInstance, ...deps]);

  return {
    editorDropRef,
    editorWrapperRef
  }
}
