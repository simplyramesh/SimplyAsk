import React, { useState, useRef, useEffect } from 'react';
import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin';

const NodeHoverPlugin = ({ nodeType, children }) => {
  const interval = useRef(null);
  const [popover, setPopover] = useState(null);

  const handleMouseEnter = (e, editor, nodeKey) => {
    if (interval.current) clearTimeout(interval.current);

    setPopover({ e, editor, nodeKey });
  }

  const handleMouseLeave = () => {
    interval.current = setTimeout(() => {
      setPopover(null)
    }, 500)
  }

  useEffect(() => {
    return () => {
      clearTimeout(interval.current)
    }
  }, []);

  return (
    <>
      <NodeEventPlugin
        nodeType={nodeType}
        eventType={'mouseenter'}
        eventListener={handleMouseEnter}
      />
      <NodeEventPlugin
        nodeType={nodeType}
        eventType={'mouseleave'}
        eventListener={handleMouseLeave}
      />
      {popover && children({ ...popover, setPopover, interval })}
    </>
  );
};

export default NodeHoverPlugin;
