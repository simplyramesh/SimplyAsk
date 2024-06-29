import { useCallback, useEffect, useRef } from 'react';

const useScrollToBottom = (data, isEditMode, config = { block: 'end', behavior: 'smooth' }) => {
  const ref = useRef(null);

  const scrollToBottom = useCallback(() => {
    !isEditMode && ref.current?.scrollIntoView(config);
  }, [config, isEditMode]);

  useEffect(scrollToBottom, [data, isEditMode]);

  return ref;
};

export default useScrollToBottom;
