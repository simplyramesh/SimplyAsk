import { useDrop } from 'react-dnd';

export const useCustomDrop = ({ accept, onDrop, onCanDrop, onHover }, deps = []) => {
  const [{ canDrop, isOver, isOverCurrent, didDrop }, dropRef ] = useDrop(
    () => ({
      accept,
      canDrop: onCanDrop,
      hover: onHover,
      drop(item, monitor) {
        const didDrop = monitor.didDrop();

        if (didDrop) {
          return undefined;
        }

        const offset = monitor.getClientOffset();

        if (offset) {
          onDrop(item, {
            x: offset.x,
            y: offset.y,
          });
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        didDrop: monitor.didDrop(),
      }),
    }),
    deps);

  return {
    canDrop,
    isOver,
    isOverCurrent,
    didDrop,
    dropRef
  };
};
