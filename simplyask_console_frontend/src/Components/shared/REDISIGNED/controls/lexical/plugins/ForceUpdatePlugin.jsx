import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection } from 'lexical';
import { useEffect } from 'react';

const ForceUpdatePlugin = ({ text, deps = [] }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection && text && deps.every(Boolean)) {
        selection.insertText(text);
      }
    });
  }, [text, ...deps]);

  return null;
};

export default ForceUpdatePlugin;
