import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './styles.css';

import { validateYupSchemaAsync } from '../../../../Managers/shared/utils/validation';

import { EXPRESSION_BUILDER_DEFAULT_VALUE, getExpressionBuilderValueWithStr } from './ExpressionBuilder';
import { StyledExpressionBuilder } from './StyledExpressionBuilder';
import { AutoFocusPlugin } from './plugins/AutoFocusPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import FocusPlugin from './plugins/FocusPlugin';
import LinkAttributePlugin from './plugins/LinkAttributePlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { RichTextTheme } from './themes/RichTextTheme';
import { richTextExpressionSchema } from './utils/validationSchema';

function Placeholder({ placeholder }) {
  return <div className="editor-placeholder">{placeholder || 'Enter a description...'}</div>;
}

const editorConfig = (params = {}) => ({
  editorState: params.editorState || EXPRESSION_BUILDER_DEFAULT_VALUE,
  theme: RichTextTheme,
  onError(error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ...params.customNode,
  ],
  ...params,
  editable: !params.readOnly,
});

export const RichTextEditor = ({
  onFocus,
  onBlur,
  error,
  readOnly,
  autofocus,
  minHeight = '150px',
  maxHeight,
  width,
  borderColor,
  editorState = '',
  onChange,
  placeholder,
  addToolbarPlugin,
  customNode = [],
  maxLines,
  richTextEditorRef,
}) => {
  const [state, setState] = useState('');

  const stateValueSetter = async () => {
    try {
      const parsedObj = JSON.parse(editorState);

      const isValidRichTextSchema = await validateYupSchemaAsync(richTextExpressionSchema, parsedObj);

      if (isValidRichTextSchema) {
        setState(editorState);
      } else {
        // Handle JSON objects which are not in rich editor format
        const serializedObject = JSON.stringify(parsedObj);
        const escapedSerializedObject = serializedObject.replace(/"/g, '\\"');

        const expression = getExpressionBuilderValueWithStr(escapedSerializedObject);

        setState(expression);
      }
    } catch {
      const expression = getExpressionBuilderValueWithStr(editorState);
      setState(expression);
    }
  };

  useEffect(() => {
    stateValueSetter();
  }, [editorState]);

  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    onFocus?.();

    setIsFocused(true);
  };

  const handleBlur = () => {
    onBlur?.();

    setIsFocused(false);
  };

  if (!state) return <Skeleton variant="rounded" width="100%" height={24} />;

  return (
    <LexicalComposer initialConfig={editorConfig({ readOnly, editorState: state, customNode })}>
      <StyledExpressionBuilder
        error={error}
        isFocused={isFocused}
        readOnly={readOnly}
        overflow="hidden"
        minHeight={minHeight}
        maxHeight={maxHeight}
        width={width}
        borderColor={borderColor}
        maxLines={maxLines}
      >
        {!readOnly && addToolbarPlugin && <ToolbarPlugin />}

        <div className="editor-inner" ref={richTextEditorRef}>
          {autofocus && <AutoFocusPlugin />}

          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={!!placeholder && <Placeholder placeholder={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <FocusPlugin onBlur={handleBlur} onFocus={handleFocus} />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <LinkAttributePlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </StyledExpressionBuilder>
    </LexicalComposer>
  );
};
