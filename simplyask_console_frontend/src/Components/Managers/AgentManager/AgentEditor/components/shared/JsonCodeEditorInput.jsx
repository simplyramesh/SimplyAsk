import React, { useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useTheme } from '@emotion/react';
import { StyledFlex, StyledTextField } from '../../../../../shared/styles/styled';

import InputVisibilityToggle from '../../../../../shared/REDISIGNED/controls/InputVisibiltyToggle/InputVisibilityToggle';

const JsonCodeEditorInput = ({ value, onChange, error, onBlur, inputRef, borderColor, ...rest }) => {
  const { colors } = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const { isProtected, isTextHidden, onTextHidden, autoFocus, fieldName, id } = rest;

  const focusedBorderColor = borderColor || colors.primary;
  const inputBorderColor = isFocused ? focusedBorderColor : colors.borderNoError;

  const sharedProps = {
    value,
    onChange,
    onFocus: () => setIsFocused(true),
    onBlur: (e) => {
      setIsFocused(false);
      onBlur?.(e);
    },
  };

  return (
    <StyledFlex position="relative">
      {isTextHidden ? (
        <StyledTextField
          {...sharedProps}
          autoFocus={autoFocus}
          name={fieldName}
          id={id}
          invalid={!!error}
          type="password"
          variant="standard"
          inputRef={inputRef}
          borderColor={inputBorderColor}
          InputProps={
            isProtected
              ? {
                  endAdornment: <InputVisibilityToggle isTextHidden={isTextHidden} onTextHidden={onTextHidden} />,
                }
              : {}
          }
          {...rest}
        />
      ) : (
        <>
          <CodeEditor
            {...sharedProps}
            language="json"
            style={{
              fontSize: 15,
              backgroundColor: colors.white,
              fontFamily: 'Montserrat',
              border: `1px solid ${error ? colors.statusOverdue : inputBorderColor}`,
              borderRadius: '10px',
              color: colors.black,
              minHeight: '41px',
            }}
            ref={inputRef}
            {...rest}
          />
          {isProtected && (
            <StyledFlex position="absolute" bottom="21px" right="11px">
              <InputVisibilityToggle isTextHidden={isTextHidden} onTextHidden={onTextHidden} />
            </StyledFlex>
          )}
        </>
      )}
    </StyledFlex>
  );
};

export default JsonCodeEditorInput;
