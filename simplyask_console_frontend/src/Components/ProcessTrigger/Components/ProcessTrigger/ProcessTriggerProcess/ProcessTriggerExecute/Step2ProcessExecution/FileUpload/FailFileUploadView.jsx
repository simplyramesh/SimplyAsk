import React from 'react';
import { DragAndDrop } from 'simplexiar_react_components';

import CustomTableIcons from '../../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import { ACCEPTED_FILE_TYPES } from '../../../../../../utils/constants';

const FailFileUploadView = ({
  handleDragAndDrop, colors, uploadFileState, retryUploadOnClick, handleFileInputChange,
}) => (
  <DragAndDrop handleDrop={handleDragAndDrop}>
    <StyledFlex
      textAlign="center"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="336px"
      border={`3px dotted ${colors.statusOverdue}`}
      borderRadius="15px"
    >
      <CustomTableIcons
        icon="BANG_CIRCLE"
        width="60px"
        color={colors.statusOverdue}
        margin="0 0 12px 0"
      />
      <StyledFlex alignItems="center">
        <StyledText>
          There was an error when uploading
          {` ${uploadFileState[0]?.name ?? 'File'}. `}
          {' '}
          You
        </StyledText>

        <StyledFlex display="flex" flexDirection="row">
          can
          <StyledText
            as="span"
            lh="20px"
            weight={600}
            color={colors.blueLink}
            cursor="pointer"
            onClick={retryUploadOnClick}
          >
            &nbsp;
            Retry
            &nbsp;
          </StyledText>
          uploading the file, or
          <label htmlFor="file-upload" style={{ cursor: 'pointer', color: colors.blueLink, fontWeight: 600 }}>
            &nbsp;
            Upload a new File
          </label>
        </StyledFlex>

      </StyledFlex>
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

export default FailFileUploadView;
