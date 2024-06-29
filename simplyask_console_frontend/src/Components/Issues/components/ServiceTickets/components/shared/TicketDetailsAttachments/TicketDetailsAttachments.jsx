import AttachFileIcon from '@mui/icons-material/AttachFile';
import { SvgIcon } from '@mui/material';
import { useTheme } from '@mui/system';
import { useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import DownloadIcon from '../../../../../../../Assets/icons/issues/attachments/downloadAttachments.svg?component';
import { useCreateActivity } from '../../../../../../../hooks/activities/useCreateActivitiy';
import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';
import { DATA_TYPES, getFileInfo } from '../../../../../../../Services/axios/filesAxios';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { ISSUES_QUERY_KEYS } from '../../../../../constants/core';
import useIssueDeleteAttachments from '../../../../../hooks/useIssueDeleteAttachments';
import useIssueGetDownloadAllAttachments from '../../../../../hooks/useIssueGetDownloadAllAttachments';
import useIssueGetDownloadSingleAttachment from '../../../../../hooks/useIssueGetDownloadSingleAttachment';
import useIssueUploadAttachments from '../../../../../hooks/useIssueUploadAttachments';
import { StyledDummyInput } from './StyledTicketDetailsAttachments';
import TicketDetailsAttachedFile from './TicketDetailsAttachedFile/TicketDetailsAttachedFile';
import TicketDetailsAttachmentCarousel from './TicketDetailsAttachmentCarousel/TicketDetailsAttachmentCarousel';
import TicketDetailsAttachmentsPreview from './TicketDetailsAttachmentsPreview/TicketDetailsAttachmentsPreview';

const TicketDetailsAttachments = ({
  ticketDetails,
  isTicketDetailFullView = false,
  getAllAttachedFiles,
  showSuccesToast = true,
}) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const inputFileRef = useRef(null);
  const [isDeleteFileModalOpen, setIsDeleteFileModalOpen] = useState({ isOpen: false, fileId: null });
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState({ isOpen: false, fileData: null });
  const { createActionPerformedActivity } = useCreateActivity();
  const { currentUser: user } = useGetCurrentUser();
  const attachedFilesLength = getAllAttachedFiles?.length;

  const { downloadAllAttachments, isDownloadAllAttachmentsLoading } = useIssueGetDownloadAllAttachments({
    onSuccess: () => {
      toast.info('Downloading all files. This may take a while, please wait…');
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const onFileAttachSuccess = () => {
    createActionPerformedActivity({
      issueId: ticketDetails?.id,
      newValue: 'Attachments Updated',
      userId: user.id,
    });
  };

  const { uploadFileToIssue, isUploadFileToIssueLoading } = useIssueUploadAttachments({
    onSuccess: () => {
      const FOUR_SECONDS = 4000;
      {
        showSuccesToast && toast.success('File upload successful', { autoClose: FOUR_SECONDS });
      }
      inputFileRef.current.value = null;
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_ATTACHMENTS],
      });
      onFileAttachSuccess();
    },
    onError: () => {
      const SIX_SECONDS = 6000;
      toast.error('Upload Error - File could not be attached to this Service Ticket', { autoClose: SIX_SECONDS });
    },
  });

  const { deleteAttachment, isDeleteAttachmentLoading } = useIssueDeleteAttachments({
    onSuccess: () => {
      setIsDeleteFileModalOpen({ isOpen: false, fileId: null });
      showSuccesToast && toast.success('File has been deleted successfully');

      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_ATTACHMENTS],
      });
      setIsFilePreviewOpen({ isOpen: false });
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { downloadSingleAttachment, isDownloadSingleAttachmentLoading } = useIssueGetDownloadSingleAttachment({
    onSuccess: () => {
      toast.info('Downloading file. This may take a while, please wait…');
      queryClient.invalidateQueries({
        queryKey: [ISSUES_QUERY_KEYS.GET_SERVICE_TICKET_ATTACHMENTS],
      });
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    const data = new FormData();
    const fileInfo = getFileInfo(null, null, false, file?.name);

    data.append(DATA_TYPES.FILE, file);
    data.append(DATA_TYPES.FILE_INFO, JSON.stringify([fileInfo]));
    data.append(DATA_TYPES.FILE_PFP, false);
    data.append('issueId', ticketDetails?.id);

    uploadFileToIssue(data);
  };

  const getSectionTitle = () => `Attachments (${attachedFilesLength || 0})`;

  const isLoading = isDownloadAllAttachmentsLoading || isDownloadSingleAttachmentLoading;

  return (
    <StyledFlex
      marginTop={isTicketDetailFullView ? '0' : '25px'}
      height={attachedFilesLength > 0 ? '270px' : 'auto'}
      position="relative"
    >
      {isLoading && <Spinner fadeBgParent />}
      <StyledFlex direction="row" justifyContent="space-between" alignItems="center">
        <StyledText size={19} weight={600}>
          {getSectionTitle()}
        </StyledText>
        <StyledFlex direction="row" gap="10px" alignItems="center">
          <StyledTooltip title="Download All Files" arrow placement="top" p="10px" maxWidth="auto">
            <StyledFlex as="span">
              <SvgIcon
                component={DownloadIcon}
                sx={{
                  fontSize: '40px',
                  padding: '8px 8px 8px 10px',
                  cursor: 'pointer',
                  borderRadius: '7px',
                  '&:hover': {
                    backgroundColor: colors.graySilver,
                  },
                }}
                onClick={() =>
                  attachedFilesLength > 0 ? downloadAllAttachments({ issueId: ticketDetails?.id }) : null
                }
              />
            </StyledFlex>
          </StyledTooltip>
          <StyledButton
            variant="contained"
            tertiary
            startIcon={<AttachFileIcon sx={{ transform: 'rotate(45deg)' }} />}
            onClick={() => inputFileRef?.current?.click()}
          >
            Attach File
          </StyledButton>
          <StyledDummyInput type="file" hidden ref={inputFileRef} onChange={handleFileUpload} />
        </StyledFlex>
      </StyledFlex>

      <TicketDetailsAttachmentCarousel
        getAllAttachedFiles={getAllAttachedFiles}
        isTicketDetailFullView={isTicketDetailFullView}
        isUploadFileToIssueLoading={isUploadFileToIssueLoading}
      >
        <StyledFlex marginTop="23px" direction="row" gap="12px" width="fit-content">
          {isUploadFileToIssueLoading && (
            <TicketDetailsAttachedFile isUploadFileToIssueLoading={isUploadFileToIssueLoading} />
          )}
          {getAllAttachedFiles?.map((file) => (
            <TicketDetailsAttachedFile
              file={file}
              key={file.id}
              setIsDeleteFileModalOpen={setIsDeleteFileModalOpen}
              downloadSingleAttachment={downloadSingleAttachment}
              setIsFilePreviewOpen={setIsFilePreviewOpen}
              isDownloadAble
            />
          ))}
        </StyledFlex>
      </TicketDetailsAttachmentCarousel>

      <ConfirmationModal
        isOpen={isDeleteFileModalOpen?.isOpen}
        onCloseModal={() => setIsDeleteFileModalOpen({ isOpen: false, fileId: null })}
        cancelBtnText="Cancel"
        onSuccessClick={() => deleteAttachment({ fileId: isDeleteFileModalOpen?.fileId })}
        successBtnText="Delete"
        alertType="WARNING"
        title="Are You Sure?"
        text="You are about to delete this attachment. Once deleted, it cannot be recovered."
        isLoading={isDeleteAttachmentLoading}
        zIndexRoot={5004}
      />

      {isFilePreviewOpen.isOpen && (
        <TicketDetailsAttachmentsPreview
          setIsFilePreviewOpen={setIsFilePreviewOpen}
          setIsDeleteFileModalOpen={setIsDeleteFileModalOpen}
          downloadSingleAttachment={downloadSingleAttachment}
          isLoading={isDownloadSingleAttachmentLoading}
          getAllAttachedFiles={getAllAttachedFiles}
          isFilePreviewOpen={isFilePreviewOpen}
          isDownloadable
        />
      )}
    </StyledFlex>
  );
};

export default TicketDetailsAttachments;
