import { AutoLinkNode, LinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

const LinkAttributePlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor) return;
    const removeLinkNodeListener = editor.registerNodeTransform(
      LinkNode,
      (node) => {
        if (!node) return;

        const dom = editor.getElementByKey(node.__key);

        if (!dom) return;

        dom.setAttribute('target', '_blank');
        dom.setAttribute('rel', 'noopener noreferrer');
      },
    );

    const removeAutoLinkNodeListener = editor.registerNodeTransform(
      AutoLinkNode,
      (node) => {
        if (!node) return;

        const dom = editor.getElementByKey(node.__key);

        if (!dom) return;

        dom.setAttribute('target', '_blank');
        dom.setAttribute('rel', 'noopener noreferrer');
      },
    );
    return () => {
      removeLinkNodeListener();
      removeAutoLinkNodeListener();
    };
  }, [editor]);

  return null;
};

export default LinkAttributePlugin;
