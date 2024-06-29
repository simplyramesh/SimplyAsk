import React from 'react';
import { DragAndDrop } from 'simplexiar_react_components';

import DragAndDropIcon from '../../../../../../../../Assets/icons/dragAndDropIcon.svg?component';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import { ACCEPTED_FILE_TYPES } from '../../../../../../utils/constants';

const DefaultFileUploadView = ({ handleDragAndDrop, handleFileInputChange, colors }) => (
  <DragAndDrop handleDrop={handleDragAndDrop}>
    <StyledFlex
      textAlign="center"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="336px"
      border={`3px dotted ${colors.dragAndDropGreyBorder}`}
      borderRadius="15px"
    >
      <DragAndDropIcon width={64} height={61} mb="12px" />
      <StyledFlex display="flex" flexDirection="row" alignItems="center">
        <StyledText as="p" weight={600}>
          {'Drag and Drop '}
          <StyledText display="inline" weight={400}>
            an .xls / .xlsx / .csv file or
          </StyledText>
        </StyledText>
      </StyledFlex>
      <label htmlFor="file-upload" style={{ cursor: 'pointer', color: colors.blueLink, fontWeight: 600 }}>
        Browse Files
      </label>
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        accept={ACCEPTED_FILE_TYPES}
        onChange={handleFileInputChange}
      />
    </StyledFlex>
  </DragAndDrop>
);

export default DefaultFileUploadView;
