import { useTheme } from '@emotion/react';
import { DragAndDrop as DragAndDropRoot } from 'simplexiar_react_components';

import DragAndDropIcon from '../../../../../Assets/icons/dragAndDropIcon.svg?component';
import SuccessIcon from '../../../../../Assets/icons/processTriggerCheckIcon.svg?component';
import Spinner from '../../../Spinner/Spinner';
import { StyledFlex, StyledIconButton, StyledText } from '../../../styles/styled';
import CustomTableIcons from '../../icons/CustomTableIcons';

import { StyledDummyInput, StyledLinkLabel } from './StyledDragAndDrop';

const DragAndDrop = ({
  handleDragAndDrop,
  onBrowseFileClick,
  rootHeight = '75px',
  attachFileText = 'to attach files or',
  acceptFileType,
  fileValue,
  onRemoveFile,
  isLoading = false,
  isError = false,
  children,
  darkTheme,
}) => {
  const { colors } = useTheme();

  const renderFileUpload = () => (
    <StyledFlex alignItems="center" direction="row" p="0 16px">
      <DragAndDropIcon width="25px" height="21px" />

      <StyledFlex direction="row" alignItems="center" gap="5px" marginLeft="14px">
        <StyledText textAlign="center">
          <StyledText weight={600} display="inline" color={darkTheme && colors.white}>
            Drag and Drop
          </StyledText>
          <StyledText display="inline" color={darkTheme && colors.white}>
            &nbsp;
            {attachFileText}
            &nbsp;
          </StyledText>
          <StyledLinkLabel htmlFor="file-upload">Browse Files</StyledLinkLabel>
        </StyledText>
        <StyledDummyInput
          type="file"
          id="file-upload"
          onChange={onBrowseFileClick}
          hidden
          {...(acceptFileType && { accept: acceptFileType })}
        />
      </StyledFlex>
    </StyledFlex>
  );

  const renderUploadedFileSuccess = () => (
    <StyledFlex
      direction="row"
      alignItems="center"
      gap="15px"
      width="100%"
      justifyContent="space-between"
      padding="0 15px"
    >
      <StyledFlex gap="10px" direction="row" alignItems="center">
        <StyledFlex width="25px" height="25px" alignItems="center">
          <SuccessIcon />
        </StyledFlex>

        <StyledText maxLines={1} wordBreak="break-all">
          {fileValue?.name}
        </StyledText>
      </StyledFlex>

      <StyledIconButton size="30px" bgColor={colors.dragAndDropGreyBg} onClick={() => onRemoveFile?.()}>
        <CustomTableIcons icon="CLOSE" width={18} />
      </StyledIconButton>
    </StyledFlex>
  );

  const renderFileUploadType = () => (fileValue ? renderUploadedFileSuccess() : renderFileUpload());

  const getRootBorder = () => {
    if (isError) return `2px dashed ${colors.statusOverdue}`;

    return fileValue || isLoading
      ? `2px solid ${colors.inputBorder}`
      : `2px dashed ${colors.inputBorder}`;
  };

  return (
    <DragAndDropRoot handleDrop={handleDragAndDrop} darkTheme={darkTheme}>
      <StyledFlex
        justifyContent="center"
        alignItems="center"
        height={rootHeight}
        border={getRootBorder()}
        backgroundColor={darkTheme ? colors.darkerGray : colors.dragAndDropGreyBg}
        borderRadius="10px"
        direction="row"
      >
        {isLoading ? <Spinner inline small /> : renderFileUploadType()}
      </StyledFlex>
      {children}
    </DragAndDropRoot>
  );
};

export default DragAndDrop;
