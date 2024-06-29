import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isAtNodeEnd } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { $getSelection, SELECTION_CHANGE_COMMAND } from 'lexical';
import {
  memo,
  useCallback, useEffect, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';

import { StyledFlex } from '../../../../styles/styled';

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.right = '-1000px';
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.right = '73px';
  }
}

export function getSelectedNode(selection) {
  const { anchor } = selection;
  const { focus } = selection;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  }
  return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
}

const FloatingComponent = ({ children }) => {
  const [editor] = useLexicalComposerContext();
  const editorRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [isSelectionActive, setIsSelectionActive] = useState(false);

  const updateEditor = useCallback(() => {
    const selection = $getSelection();
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null
      && !nativeSelection.isCollapsed
      && rootElement !== null
      && rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
        setIsSelectionActive(true);
      }
    } else {
      positionEditorElement(editorElem, null);
      setIsSelectionActive(false);
    }

    return true;
  }, [editor]);

  useEffect(() => {
    mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateEditor();
          return true;
        },
        1,
      ),
    );

    () => {
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
        });
      });
    };
  }, [editor, updateEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateEditor();
    });
  }, [editor, updateEditor]);

  const closeEditor = useCallback(() => {
    const editorElem = editorRef.current;
    positionEditorElement(editorElem, null);
    setIsSelectionActive(false);
  }, [editor]);

  return (
    createPortal(
      <StyledFlex
        style={{
          position: 'fixed', zIndex: '9999', top: '0', left: '0', width: '100vw', height: '100vh',
        }}
        onClick={closeEditor}
        display={isSelectionActive ? 'block' : 'none'}
      >
        <StyledFlex ref={editorRef} style={{ position: 'absolute', zIndex: '9999' }}>
          {children}
        </StyledFlex>
      </StyledFlex>,
      document.body,
    )
  );
};

const OnSelectionPlugin = ({ children }) => (<FloatingComponent children={children} />);

export default memo(OnSelectionPlugin);
