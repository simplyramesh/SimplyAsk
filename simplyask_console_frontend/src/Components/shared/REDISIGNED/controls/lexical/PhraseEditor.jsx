import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import React, { memo, useMemo, useState } from 'react';

import FocusPlugin from './plugins/FocusPlugin';
import {
  expressionBuilderInput, StyledExpressionBuilder, StyledExpressionBuilderPlaceholder,
} from './StyledExpressionBuilder';
import { BUILDER_ID } from './utils/helpers';
import { EXPRESSION_BUILDER_DEFAULT_VALUE } from './ExpressionBuilder';
import { ColoredParamTextNode } from './nodes/ColoredParamTextNode';
import OnSelectionPlugin from './plugins/OnSelectionPlugin';
import InsertParameter from '../../../../Managers/AgentManager/AgentEditor/components/sideForms/Intents/IntentsCreateOrEdit/IntentsCreateOrEditInputs/InsertParameter';
import NodeHoverPlugin from './plugins/NodeHoverPlugin';
import ParameterCard from '../../../../Managers/AgentManager/AgentEditor/components/sideForms/Intents/IntentsCreateOrEdit/IntentsCreateOrEditInputs/ParameterCard';
import ParamsUpdatePlugin from './plugins/ParamsUpdatePlugin';

const PhraseEditor = ({
  id = BUILDER_ID,
  placeholder = '',
  editorState,
  error,
  onChange,
  onBlur,
  onFocus,
  minHeight,
  textarea,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const editorConfig = useMemo(() => ({
    editorState: editorState || EXPRESSION_BUILDER_DEFAULT_VALUE,
    theme: {
      ltr: 'ltr',
      rtl: 'rtl',
    },
    onError(error) {
      throw error;
    },
    nodes: [ColoredParamTextNode],
  }), [editorState]);

  const minH = minHeight || (textarea ? '250px' : 0); // 250 is the default height of the textarea

  const handleChange = (value) => {
    onChange?.(value);
  };
  const handleFocus = () => {
    onFocus?.();

    setIsFocused(true);
  };

  const handleBlur = () => {
    onBlur?.();

    setIsFocused(false);
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <StyledExpressionBuilder id={id} error={error} minHeight={minH} isFocused={isFocused}>
        <PlainTextPlugin
          contentEditable={<ContentEditable className={expressionBuilderInput} />}
          placeholder={() => <StyledExpressionBuilderPlaceholder>{placeholder}</StyledExpressionBuilderPlaceholder>}
          ErrorBoundary={React.Fragment}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <FocusPlugin onBlur={handleBlur} onFocus={handleFocus} />
        <OnSelectionPlugin>
          <InsertParameter />
        </OnSelectionPlugin>
        <NodeHoverPlugin nodeType={ColoredParamTextNode}>
          {(props) => <ParameterCard {...props} />}
        </NodeHoverPlugin>
        <ParamsUpdatePlugin />
      </StyledExpressionBuilder>
    </LexicalComposer>
  );
};

export default memo(PhraseEditor);
