import { useContext, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, TextNode } from 'lexical';
import { COLORED_PARAM_TEXT_NODE_TYPE } from '../nodes/ColoredParamTextNode';
import { IntentsContext } from '../../../../../Managers/AgentManager/AgentEditor/components/sideForms/Intents/IntentsContex';

const ParamsUpdatePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [colorNodes, setColorNodes] = useState([]);
  const { parameters, paramBlurTrigger } = useContext(IntentsContext);

  useEffect(() => {
    editor.getEditorState().read(() => {
      const root = $getRoot();
      const [paragrahNode] = root.getChildren();

      const nodes = paragrahNode.getChildren();

      setColorNodes(nodes)
    })

  }, [editor.getEditorState()]);

  useEffect(() => {
    const nodes = colorNodes.filter(node => node.getType() === COLORED_PARAM_TEXT_NODE_TYPE);

    editor.update(() => {
      nodes.forEach((node) => {
        const relatedParam = parameters.find(param => param.id === node.getId());

        if (!relatedParam) {
          node.replace(
            new TextNode(node.getTextContent()),
          )
        }
      });
    })}, [parameters.length]);


  useEffect(() => {
    if (paramBlurTrigger) {
      const nodes = colorNodes.filter(node => node.getType() === COLORED_PARAM_TEXT_NODE_TYPE);

      editor.update(() => {
        nodes.forEach((node) => {
          const relatedParam = parameters.find(param => param.id === node.getId());

          if (relatedParam) {
            if (node.getParamName() !== relatedParam.paramName) {
              node.setParamName(relatedParam.paramName);
            }

            if (node.getParamType() !== relatedParam.paramType) {
              node.setParamType(relatedParam.paramType);
            }
          }
        })
      })
    }
  }, [paramBlurTrigger]);

  return null;
};

export default ParamsUpdatePlugin;
