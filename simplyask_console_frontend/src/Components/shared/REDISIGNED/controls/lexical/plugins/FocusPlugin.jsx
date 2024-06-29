import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from 'lexical';
import {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';

const useIsMounted = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

const FocusPlugin = ({ onBlur, onFocus }) => {
  const [editor] = useLexicalComposerContext();
  const isMounted = useIsMounted();

  const [hasFocus, setHasFocus] = useState(() => {
    return editor.getRootElement() === document.activeElement;
  });

  useLayoutEffect(() => {
    setHasFocus(editor.getRootElement() === document.activeElement);
    return mergeRegister(
      editor.registerCommand(FOCUS_COMMAND, () => {
        setHasFocus(true);
        return true;
      }, COMMAND_PRIORITY_LOW),
      editor.registerCommand(BLUR_COMMAND, () => {
        setHasFocus(false);
        return false;
      }, COMMAND_PRIORITY_LOW),
    );
  }, [editor]);

  useEffect(() => {
    const state = editor.getEditorState().toJSON();

    if (!isMounted) {
      if (hasFocus) {
        onFocus?.(state);
      } else {
        onBlur?.(state);
      }
    }
  }, [hasFocus]);

  return null;
};

export default FocusPlugin;
