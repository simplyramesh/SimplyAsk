import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { workflowEditorState } from '../store';

export const useHistoricalRecoilState = () => {
  const [{ past, present, future }, setState] = useRecoilState(workflowEditorState);

  const canUndo = past.length !== 0;
  const canRedo = future.length !== 0;

  const undo = useCallback(() => {
    if (canUndo) {
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      setState({
        past: newPast,
        present: previous,
        future: [present, ...future],
      });
    }
  }, [past, present, future, canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      const next = future[0];
      const newFuture = future.slice(1);

      setState({
        past: [...past, present],
        present: next,
        future: newFuture,
      });
    }
  }, [past, present, future, canRedo]);

  const set = useCallback((newPresent) => {
    setState({
      past: [...past, present],
      present: newPresent,
      future: [],
    });
  }, [past, present, future]);

  return {
    state: present, set, setWithoutHistory: setState, undo, redo, canRedo, canUndo, past, future,
  };
};
