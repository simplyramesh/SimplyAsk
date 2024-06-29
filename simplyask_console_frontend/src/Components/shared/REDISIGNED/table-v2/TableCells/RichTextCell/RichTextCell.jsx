import React from 'react';
import { RichTextEditor } from '../../../controls/lexical/RichTextEditor';
import { StyledFlex } from '../../../../styles/styled';

const RichTextCell = ({ cell }) => {
  return (
    <StyledFlex>
      <RichTextEditor
        readOnly
        minHeight={0}
        maxHeight="78px"
        editorState={cell.getValue()}
      />
    </StyledFlex>
  );
};

export default RichTextCell;
