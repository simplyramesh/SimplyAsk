import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import React, { useMemo, useState } from 'react';

import ResizableTextField from '../../../ResizableTextComponentWrapper/ResizableTextField';
import OpenIcon from '../../icons/svgIcons/OpenIcon';
import { StyledTooltip } from '../../tooltip/StyledTooltip';

import { ParamNode } from './nodes/ParamNode';
import FocusPlugin from './plugins/FocusPlugin';
import ForceUpdatePlugin from './plugins/ForceUpdatePlugin';
import ParamsAutocompletePlugin from './plugins/ParamsAutocompletePlugin';
import {
  expressionBuilderInput,
  StyledExpressionBuilder,
  StyledExpressionBuilderPlaceholder,
  StyledIconWrapper,
  StyledSearchableButton,
} from './StyledExpressionBuilder';
import { BUILDER_ID } from './utils/helpers';

export const EXPRESSION_BUILDER_DEFAULT_VALUE =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

// eslint-disable-next-line max-len
export const getExpressionBuilderValueWithStr = (str) =>
  `{"root":{"children":[{"children":[{"type": "text", "text": "${str}"}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;

const ExpressionBuilder = ({
  id = BUILDER_ID,
  placeholder = '',
  editorState,
  error,
  onChange,
  onBlur,
  onFocus,
  minHeight,
  textarea,
  enableVerticalResize = false,
  enableHorizontalResize = false,
  autocompleteParams = [],
}) => {
  let state = '';
  const isNumeric = !Number.isNaN(Number(editorState));

  try {
    JSON.parse(editorState);
    state = isNumeric ? getExpressionBuilderValueWithStr(editorState) : editorState;
  } catch {
    state = editorState ? getExpressionBuilderValueWithStr(editorState) : EXPRESSION_BUILDER_DEFAULT_VALUE;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const editorConfig = useMemo(
    () => ({
      editorState: state || EXPRESSION_BUILDER_DEFAULT_VALUE,
      theme: {
        ltr: 'ltr',
        rtl: 'rtl',
      },
      onError(error) {
        throw error;
      },
      nodes: [ParamNode],
    }),
    [state]
  );

  const minH = minHeight || (textarea ? '250px' : 0); // 250 is the default height of the textarea

  const handleOpenAutocomplete = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setIsOpen(true);
  };

  const handleChange = (value) => {
    if (isOpen) setIsOpen(false);

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

  const renderParameterSuggestions = () =>
    isFocused && (
      <StyledTooltip title="Turn on parameter suggestions" arrow placement="top">
        <StyledSearchableButton onMouseDown={handleOpenAutocomplete}>
          <StyledIconWrapper as="span">
            <OpenIcon fontSize="inherit" />
          </StyledIconWrapper>
        </StyledSearchableButton>
      </StyledTooltip>
    );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <StyledExpressionBuilder id={id} error={error} minHeight={minH} isFocused={isFocused}>
        {renderParameterSuggestions()}
        <ResizableTextField
          enableVerticalResize={enableVerticalResize}
          enableHorizontalResize={enableHorizontalResize}
          minHeight={minH}
        >
          <PlainTextPlugin
            contentEditable={<ContentEditable className={expressionBuilderInput} />}
            placeholder={() => <StyledExpressionBuilderPlaceholder>{placeholder}</StyledExpressionBuilderPlaceholder>}
            ErrorBoundary={React.Fragment}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} />
          <ParamsAutocompletePlugin id={id} isOpen={isOpen} params={autocompleteParams} />
          <FocusPlugin onBlur={handleBlur} onFocus={handleFocus} />
          <ForceUpdatePlugin text=" @" deps={[isOpen]} />
        </ResizableTextField>
      </StyledExpressionBuilder>
    </LexicalComposer>
  );
};

export default ExpressionBuilder;
