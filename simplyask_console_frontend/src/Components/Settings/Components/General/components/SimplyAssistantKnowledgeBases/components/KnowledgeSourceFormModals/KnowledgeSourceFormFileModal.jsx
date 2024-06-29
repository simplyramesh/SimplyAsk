import { InfoOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { getFileInfo } from '../../../../../../../../Services/axios/filesAxios';
import TicketDetailsAttachedFile from '../../../../../../../Issues/components/ServiceTickets/components/shared/TicketDetailsAttachments/TicketDetailsAttachedFile/TicketDetailsAttachedFile';
import TicketDetailsAttachmentCarousel from '../../../../../../../Issues/components/ServiceTickets/components/shared/TicketDetailsAttachments/TicketDetailsAttachmentCarousel/TicketDetailsAttachmentCarousel';
import TicketDetailsAttachmentsPreview from '../../../../../../../Issues/components/ServiceTickets/components/shared/TicketDetailsAttachments/TicketDetailsAttachmentsPreview/TicketDetailsAttachmentsPreview';
import useIssueUploadAttachments from '../../../../../../../Issues/hooks/useIssueUploadAttachments';
import DragAndDrop from '../../../../../../../shared/REDISIGNED/controls/DragAndDrop/DragAndDrop';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../../../../../../shared/styles/styled';
import FormErrorMessage from '../../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import {
  ALLOWED_FILE_TYPES_KB,
  ALLOWED_FILE_TYPES_STRING_KB,
  DATA_TYPES,
} from '../../../../../FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetPreview/ChatWidgetView/utils/constants/common';

const KnowledgeSourceFormFileModal = ({ values, setFieldValue, errors, touched }) => {
  const fileId = values.source?.fileId?.[0];
  const idAndUrlSplit = values.source?.url.split(',');
  const url = idAndUrlSplit?.[0]?.trim();
  const timeStamp = idAndUrlSplit?.[1]?.trim();
  const textFiles = fileId?.name ? [{ name: fileId.name, id: url, timeStamp: timeStamp }] : [];
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState({ isOpen: false, fileData: null });
  const { uploadFileToIssue, isUploadFileToIssueLoading } = useIssueUploadAttachments({
    onSuccess: (data, variables) => {
      const latestAttachment = { ...data[0], fileSize: variables.get(DATA_TYPES.FILE_SIZE) };
      setFieldValue('source.fileId', [latestAttachment, ...textFiles]);
      setFieldValue('source.fileName', latestAttachment.name);
      setFieldValue('source.url', `${latestAttachment.id}, ${latestAttachment.timeStamp}`);
    },
    onError: () => {
      toast.error('Upload Error - File could not be attached');
    },
  });

  const triggerFileUpload = (file) => {
    if (textFiles.length) {
      toast.warning('you cannot upload more than one file');
    } else {
      const fileExtension = file?.name?.split('.')?.pop()?.toLowerCase();

      if (!ALLOWED_FILE_TYPES_KB.includes(fileExtension)) {
        toast.error('File type not allowed. Please upload an allowed file type.');
        return;
      }
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

  const handleDragAndDrop = (files) => {
    const currentFile = files[0];
    triggerFileUpload(currentFile);
  };

  const handleFileDelete = (id) =>
    setFieldValue(
      'source.fileId',
      textFiles.filter((file) => file.id !== id)
    );

  return (
    <StyledFlex>
      <StyledFlex flexDirection="row" gap="10px" alignItems="center" mb={2}>
        <InputLabel label="Upload File" size={16} mb={0} />
        <StyledTooltip
          title="Some examples of text file types that can be uploaded include: JSON, HTML, XML, DOC, PAGES, DOCX, MD, EML, RTF, TXT, LOG, ASC, MSG, WPS, and IPYNB"
          arrow
          placement="top"
          p="10px 15px"
          maxWidth="auto"
        >
          <InfoOutlined fontSize="inherit" />
        </StyledTooltip>
      </StyledFlex>
      <DragAndDrop
        handleDragAndDrop={handleDragAndDrop}
        onBrowseFileClick={onBrowseFileClick}
        attachFileText="a PDF, Word, Excel, Text-Based (TXT, CSV, XML, etc.) File or"
        acceptFileType={ALLOWED_FILE_TYPES_STRING_KB}
      >
        {errors?.source?.fileId && touched?.source?.fileId && (
          <FormErrorMessage>{errors?.source?.fileId}</FormErrorMessage>
        )}
        <StyledFlex height={textFiles?.length > 0 ? '225px' : 'auto'} width="100%">
          <TicketDetailsAttachmentCarousel
            getAllAttachedFiles={textFiles}
            isCreateTicketView
            isUploadFileToIssueLoading={isUploadFileToIssueLoading}
          >
            <StyledFlex marginTop="23px" direction="row" gap="12px" width="fit-content">
              {isUploadFileToIssueLoading && (
                <TicketDetailsAttachedFile isUploadFileToIssueLoading={isUploadFileToIssueLoading} />
              )}
              {textFiles?.map((file) => (
                <TicketDetailsAttachedFile
                  file={file}
                  key={file.id}
                  isCreateTicketView
                  handleDeleteFileOnIssueCreation={handleFileDelete}
                  setIsFilePreviewOpen={setIsFilePreviewOpen}
                />
              ))}
            </StyledFlex>
          </TicketDetailsAttachmentCarousel>

          {isFilePreviewOpen.isOpen && (
            <TicketDetailsAttachmentsPreview
              setIsFilePreviewOpen={setIsFilePreviewOpen}
              getAllAttachedFiles={textFiles}
              isFilePreviewOpen={isFilePreviewOpen}
              isCreateTicketView
              isDownloadable
              handleDeleteFileOnIssueCreation={handleFileDelete}
            />
          )}
        </StyledFlex>
      </DragAndDrop>
    </StyledFlex>
  );
};

export default KnowledgeSourceFormFileModal;
