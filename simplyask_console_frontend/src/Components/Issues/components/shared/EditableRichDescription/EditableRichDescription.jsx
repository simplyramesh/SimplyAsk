import React, { useState } from 'react';

import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { RichTextEditor } from '../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import { StyledFlex } from '../../../../shared/styles/styled';

const EditableRichDescription = ({
  key, description, onCancel, onSave, onBlur, placeholder,
}) => {
  const [value, setValue] = useState(description);

  return (
    <StyledFlex width="100%" gap="32px">
      <RichTextEditor
        placeholder={placeholder}
        key={key}
        minHeight={0}
        editorState={value}
        onBlur={onBlur}
        autofocus
        onChange={(v) => setValue(JSON.stringify(v))}
        addToolbarPlugin
      />
      <StyledFlex direction="row" justifyContent="flex-end" gap="20px">
        <StyledButton variant="contained" tertiary onClick={onCancel}>Cancel</StyledButton>
        <StyledButton variant="contained" secondary onClick={() => onSave(value)}>Save</StyledButton>
      </StyledFlex>
    </StyledFlex>
  );
};

export default EditableRichDescription;
