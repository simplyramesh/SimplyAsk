import { useState } from 'react';
import { toast } from 'react-toastify';

import { getFileInfo } from '../../../../../../../Services/axios/filesAxios';
import { DATA_TYPES } from '../../../../../../Settings/Components/FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetPreview/ChatWidgetView/utils/constants/common';
import DragAndDrop from '../../../../../../shared/REDISIGNED/controls/DragAndDrop/DragAndDrop';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import useIssueUploadAttachments from '../../../../../hooks/useIssueUploadAttachments';
import TicketDetailsAttachedFile from '../TicketDetailsAttachments/TicketDetailsAttachedFile/TicketDetailsAttachedFile';
import TicketDetailsAttachmentCarousel from '../TicketDetailsAttachments/TicketDetailsAttachmentCarousel/TicketDetailsAttachmentCarousel';
import TicketDetailsAttachmentsPreview from '../TicketDetailsAttachments/TicketDetailsAttachmentsPreview/TicketDetailsAttachmentsPreview';

const TicketDragAndDropFiles = ({ onChange, valueAttachmentFiles }) => {
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState({ isOpen: false, fileData: null });

  const { uploadFileToIssue, isUploadFileToIssueLoading } = useIssueUploadAttachments({
    onSuccess: (data, variables) => {
      const latestAttachment = { ...data[0], fileSize: variables.get(DATA_TYPES.FILE_SIZE) };
      onChange([latestAttachment, ...valueAttachmentFiles]);
    },
    onError: () => {
      toast.error('Upload Error - File could not be attached to this Service Ticket');
    },
  });

  const triggerFileUpload = async (file) => {
    const data = new FormData();
    const fileInfo = getFileInfo(null, null, false, file?.name);

    data.append(DATA_TYPES.FILE, file);
    data.append(DATA_TYPES.FILE_INFO, JSON.stringify([fileInfo]));
    data.append(DATA_TYPES.FILE_PFP, false);
    data.append(DATA_TYPES.FILE_SIZE, file?.size);

    uploadFileToIssue(data);
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

  const handleDeleteFileOnIssueCreation = (id) => {
    setIsFilePreviewOpen({ isOpen: false });

    const filterId = valueAttachmentFiles?.filter((file) => file.id !== id);
    onChange(filterId);
  };

  return (
    <StyledFlex justifyContent="center" alignItems="center">
      <DragAndDrop
        handleDragAndDrop={handleDragAndDrop}
        onBrowseFileClick={onBrowseFileClick}
      >
        <StyledFlex
          height={valueAttachmentFiles?.length > 0 ? '225px' : 'auto'}
          width="100%"
        >
          <TicketDetailsAttachmentCarousel
            getAllAttachedFiles={valueAttachmentFiles}
            isCreateTicketView
            isUploadFileToIssueLoading={isUploadFileToIssueLoading}
          >
            <StyledFlex marginTop="23px" direction="row" gap="12px" width="fit-content">
              {isUploadFileToIssueLoading
          && (
            <TicketDetailsAttachedFile
              isUploadFileToIssueLoading={isUploadFileToIssueLoading}
            />
          )}
              {valueAttachmentFiles?.map((file) => (
                <TicketDetailsAttachedFile
                  file={file}
                  key={file.id}
                  isCreateTicketView
                  handleDeleteFileOnIssueCreation={handleDeleteFileOnIssueCreation}
                  setIsFilePreviewOpen={setIsFilePreviewOpen}
                />
              ))}

            </StyledFlex>
          </TicketDetailsAttachmentCarousel>

          {isFilePreviewOpen.isOpen && (
            <TicketDetailsAttachmentsPreview
              setIsFilePreviewOpen={setIsFilePreviewOpen}
              getAllAttachedFiles={valueAttachmentFiles}
              isFilePreviewOpen={isFilePreviewOpen}
              isCreateTicketView
              handleDeleteFileOnIssueCreation={handleDeleteFileOnIssueCreation}
            />
          )}
        </StyledFlex>
      </DragAndDrop>
    </StyledFlex>

  );
};

export default TicketDragAndDropFiles;
