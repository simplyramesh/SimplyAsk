import { useReactFlow } from 'reactflow';

export const useCoordinates = ({ left, top, editorRef }) => {
  const reactFlowInstance = useReactFlow();

  const bounds = editorRef.current.getBoundingClientRect();

  return reactFlowInstance.project({
    x: left - bounds.left,
    y: top - bounds.top
  });
};
