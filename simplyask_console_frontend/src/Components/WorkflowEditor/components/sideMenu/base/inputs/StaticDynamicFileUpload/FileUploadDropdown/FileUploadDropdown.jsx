import { useTheme } from '@emotion/react';
import { ArrowForwardIosRounded } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import SuccessIcon from '../../../../../../../../Assets/icons/processTriggerCheckIcon.svg?component';
import { getFileInfo } from '../../../../../../../../Services/axios/filesAxios';
import useIssueUploadAttachments from '../../../../../../../Issues/hooks/useIssueUploadAttachments';
import { ContextMenuItem } from '../../../../../../../Managers/shared/components/ContextMenus/StyledContextMenus';
import { StyledButtonWrapper } from '../../../../../../../Managers/shared/components/SidebarGenerateVariant/SidebarGenerateVariant';
import { DATA_TYPES } from '../../../../../../../Settings/Components/FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetPreview/ChatWidgetView/utils/constants/common';
import { StyledDummyInput } from '../../../../../../../shared/REDISIGNED/controls/DragAndDrop/StyledDragAndDrop';
import CustomTableIcons from '../../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledIconButton, StyledText } from '../../../../../../../shared/styles/styled';
import { formattedWorkflowFileUpload } from '../../../../../../utils/helperFunctions';
import FileManagerUploadModal from './FileManagerUploadModal/FileManagerUploadModal';
import { StyledFileUploadTypeButton } from './StyledFileUploadDropdown';

const FileUploadDropdown = ({ value, onChange }) => {
  const { colors, boxShadows } = useTheme();
  const [showFileManagerUploadModal, setShowFileManagerUploadModal] = useState(false);

  const [showToolTip, setShowToolTip] = useState(false);
  const inputFileRef = useRef(null);

  const getParsedValue = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return '';
    }
  };

  const parsedValue = getParsedValue(value);

  const handleFileOnChange = (id, name) => {
    const fileData = formattedWorkflowFileUpload({
      id,
      name,
    });

    onChange(JSON.stringify(fileData));
  };

  const { uploadFileToIssue, isUploadFileToIssueLoading } = useIssueUploadAttachments({
    onSuccess: (data) => {
      handleFileOnChange(data[0].id, data[0].name);
      inputFileRef.current.value = null;
    },
    onError: (error) => {
      inputFileRef.current.value = null;
      toast.error('Upload Error - File could not be attached');
    },
  });

  const triggerFileUpload = (file) => {
    if (parsedValue) {
      toast.warning('you cannot upload more than one file');
    } else {
      const data = new FormData();
      const fileInfo = getFileInfo(null, null, false, file?.name);

      data.append(DATA_TYPES.FILE, file);
      data.append(DATA_TYPES.FILE_INFO, JSON.stringify([fileInfo]));
      data.append(DATA_TYPES.FILE_PFP, false);
      data.append(DATA_TYPES.FILE_SIZE, file?.size);

      uploadFileToIssue(data);
    }
  };

  const onBrowseFileClick = (e) => {
    const files = e.target?.files;

    if (!files || files?.length < 1) {
      return;
    }

    const currentFile = files[0];
    triggerFileUpload(currentFile);
  };

  const handleOpenFileManagerFile = (selectedFile) => {
    handleFileOnChange(selectedFile?.fileData?.id, selectedFile?.fileData?.name);
  };

  const renderUploadContextItems = () => (
    <StyledFlex>
      <ContextMenuItem onClick={() => inputFileRef?.current?.click()}>
        <StyledText lh={20} size={14}>
          Upload a new file
        </StyledText>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => setShowFileManagerUploadModal(true)}>
        <StyledText lh={20} size={14}>
          Select an existing file from the File Manager{' '}
        </StyledText>
      </ContextMenuItem>
    </StyledFlex>
  );

  const renderUploadButton = () => (
    <StyledFlex as="span" flex="auto">
      <StyledTooltip
        placement="bottom-start"
        open={showToolTip}
        onOpen={() => setShowToolTip(true)}
        onClose={() => setShowToolTip(false)}
        title={renderUploadContextItems()}
        p="0px"
        radius="5px"
        boxShadow={boxShadows.table}
        bgTooltip={colors.white}
        maxWidth="none"
        width="395px"
      >
        <StyledButtonWrapper>
          <StyledFileUploadTypeButton
            secondary
            variant="contained"
            loading={isUploadFileToIssueLoading}
            endIcon={<ArrowForwardIosRounded />}
          >
            Select a Single File
          </StyledFileUploadTypeButton>
        </StyledButtonWrapper>
      </StyledTooltip>
    </StyledFlex>
  );

  const renderUploadedFileCard = () => (
    <StyledFlex
      direction="row"
      alignItems="center"
      gap="15px"
      width="100%"
      justifyContent="space-between"
      padding="15px"
      borderRadius="10px"
      backgroundColor={colors.bgColorOptionTwo}
    >
      <StyledFlex gap="10px" direction="row" alignItems="center">
        <StyledFlex width="20px" height="20px" alignItems="center">
          <SuccessIcon />
        </StyledFlex>

        <StyledText maxLines={1} wordBreak="break-all">
          {parsedValue?.name}
        </StyledText>
      </StyledFlex>

      <StyledTooltip arrow placement="top" title="Remove" p="10px 15px">
        <StyledIconButton size="30px" bgColor={colors.dragAndDropGreyBg} onClick={() => onChange('')?.()}>
          <CustomTableIcons icon="CLOSE" width={18} />
        </StyledIconButton>
      </StyledTooltip>
    </StyledFlex>
  );

  return (
    <StyledFlex>
      {parsedValue ? renderUploadedFileCard() : renderUploadButton()}

      <FileManagerUploadModal
        open={showFileManagerUploadModal}
        onClose={() => setShowFileManagerUploadModal(false)}
        handleOpenFileManagerFile={handleOpenFileManagerFile}
      />

      <StyledDummyInput type="file" onChange={onBrowseFileClick} ref={inputFileRef} hidden />
    </StyledFlex>
  );
};

export default FileUploadDropdown;
