import { useState } from 'react';
import Files from '../../../../../../../../Files/Files';
import { StyledButton } from '../../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex } from '../../../../../../../../shared/styles/styled';

const FileManagerUploadModal = ({ open, onClose, handleOpenFileManagerFile }) => {
  const [selectedFile, setSelectedFile] = useState();

  const handleCloseModal = () => {
    setSelectedFile();
    onClose();
  };

  const handleOpenFileManagerClick = () => {
    handleOpenFileManagerFile(selectedFile);
    handleCloseModal();
  };

  return (
    <CenterModalFixed
      open={open}
      onClose={handleCloseModal}
      bodyPadding="0"
      maxWidth="1295px"
      enableScrollbar={false}
      title={
        <StyledFlex p="20px 0 10px">
          <StyledFlex>Select File From File Manager</StyledFlex>
        </StyledFlex>
      }
      actions={
        <StyledFlex mt="12px" direction="row" justifyContent="flex-end" width="100%" gap="20px">
          <StyledButton primary variant="outlined" onClick={handleCloseModal}>
            Cancel
          </StyledButton>
          <StyledButton primary variant="contained" onClick={handleOpenFileManagerClick} disabled={!selectedFile}>
            Open
          </StyledButton>
        </StyledFlex>
      }
    >
      <StyledFlex overflow="hidden">
        <StyledFlex direction="row" overflow="hidden">
          <Files isFileUploadMode setSelectedFile={setSelectedFile} selectedFile={selectedFile} />
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default FileManagerUploadModal;
