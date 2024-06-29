import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Button, SvgIcon } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/system';
import { useState } from 'react';

import CarouselArrow from '../../../../../../../../Assets/icons/issues/attachments/CarouselArrow.svg?component';
import DownloadIcon from '../../../../../../../../Assets/icons/issues/attachments/downloadAttachments.svg?component';
import ZoomIn from '../../../../../../../../Assets/icons/issues/attachments/whiteZoomInIcon.svg?component';
import ZoomOut from '../../../../../../../../Assets/icons/issues/attachments/whiteZoomOutIcon.svg?component';
import TrashBinIcon from '../../../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import useSingleFileData from '../../../../../../hooks/useSingleFileData';
import { ALL_ATTACHMENT_FORMATS, FALLBACK_DOC_ICON } from '../../../../constants/attachments';
import { getBytesSize } from '../../../../utils/helpers';

import RenderAttachmentPreview from './RenderAttachmentPreview';

const StyledArrowLeft = styled(Button)`
  position: absolute;
  top: 40%;
  z-index: 100;
  transform: rotate(180deg);
  cursor: pointer;
  left: 15px;

  & > svg {
    width: 83px;
    height: 83px;

    & > g {
      transform: translateY(3px);
    }
    & > g > path {
      transition: all 200ms ease;
      fill: ${({ theme }) => theme.colors.primary};
      stroke: ${({ theme }) => theme.colors.white};
    }
    & > g > path:last-child {
      stroke: ${({ theme }) => theme.colors.white};
    }
  }

  & > svg:hover {
    & > g > path {
      fill: ${({ theme }) => theme.colors.white};
    }
    & > g > path:last-child {
      stroke: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const StyledArrowRight = styled(StyledArrowLeft)`
  right: 15px;
  left: auto;
  transform: rotate(0deg);
`;

const StyledActionButton = styled(Button)`
  width: 44px;
  border-radius: 50%;
  min-width: 0;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TicketDetailsAttachmentsPreview = ({
  setIsFilePreviewOpen,
  downloadSingleAttachment,
  setIsDeleteFileModalOpen,
  isLoading,
  getAllAttachedFiles,
  isFilePreviewOpen,
  isCreateTicketView = false,
  handleDeleteFileOnIssueCreation,
  renderLocalAttachment = false,
  isProcessHistorySideModalView = false,
  isDownloadable = false,
  onDownload,
}) => {
  const { colors } = useTheme();
  const [currentFile, setCurrentFile] = useState(isFilePreviewOpen.fileData);

  const getFileId = () =>
    (isCreateTicketView ? currentFile?.id : currentFile?.fileStorage?.referenceFileId) || currentFile?.fileId;

  const { fileData, isFileLoading } = useSingleFileData({
    fileId: getFileId(),
  });

  const [zoomScale, setZoomScale] = useState(1);

  const getFileName = () => (isCreateTicketView ? currentFile?.name : currentFile?.fileName);

  const lastIndexOfDot = getFileName()?.lastIndexOf('.');
  const getFileExtension = getFileName()?.slice(lastIndexOfDot + 1);

  const fileSize = getBytesSize(currentFile?.fileSize || currentFile?.fileMetadata?.fileSize || 0);

  const GetFileFormatIcon =
    ALL_ATTACHMENT_FORMATS.find((format) => format.FORMAT_TYPE.toLowerCase() === getFileExtension?.toLowerCase())
      ?.ICON || FALLBACK_DOC_ICON;

  const getCurrentFileIndex = getAllAttachedFiles?.findIndex((data) => data.id === currentFile?.id);
  const showLeftArrow = getCurrentFileIndex !== 0;
  const showRightArrow = getAllAttachedFiles?.length > 0 && getCurrentFileIndex !== getAllAttachedFiles?.length - 1;

  const onLeftFileSelection = () => {
    setCurrentFile(getAllAttachedFiles?.[getCurrentFileIndex - 1]);
  };

  const onRightFileSelection = () => {
    setCurrentFile(getAllAttachedFiles?.[getCurrentFileIndex + 1]);
  };

  const onFileDeletionClick = () => {
    if (isCreateTicketView) {
      handleDeleteFileOnIssueCreation?.(currentFile?.id);
    } else {
      setIsDeleteFileModalOpen({ isOpen: true, fileId: currentFile?.fileStorage?.referenceFileId });
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(currentFile?.id, currentFile?.name);
    } else {
      downloadSingleAttachment({
        fileId: currentFile?.fileStorage?.referenceFileId,
        name: currentFile?.fileName,
      });
    }
  };

  return (
    <Modal
      open={isProcessHistorySideModalView ? !!isFilePreviewOpen : isFilePreviewOpen.isOpen}
      sx={{
        '&': {
          zIndex: 5002,
        },
      }}
    >
      <StyledFlex height="100%" width="100%">
        {isLoading && <Spinner fadeBgParent />}
        <StyledFlex
          height="90px"
          width="100%"
          backgroundColor={colors.lightBlack}
          direction="row"
          padding="0 36px"
          alignItems="center"
          position="relative"
          zIndex="9999"
        >
          <StyledFlex
            display="flex"
            flexDirection="row"
            gap="25"
            justifyContent="center"
            alignItems="center"
            position="absolute"
          >
            <StyledTooltip title="Zoom Out" placement="bottom" p="13px" maxWidth="auto" arrow>
              <StyledActionButton onClick={() => setZoomScale(zoomScale - 0.1 === 0.4 ? 0.5 : zoomScale - 0.1)}>
                <SvgIcon
                  component={ZoomOut}
                  sx={{
                    marginLeft: '2px',
                    width: '26px',
                    height: '25px',
                    fill: colors.lightBlack,
                  }}
                />
              </StyledActionButton>
            </StyledTooltip>
            <StyledTooltip title="Zoom In" placement="bottom" p="13px" maxWidth="auto" arrow>
              <StyledActionButton onClick={() => setZoomScale(zoomScale + 0.1 === 2.6 ? 2.5 : zoomScale + 0.1)}>
                <SvgIcon
                  component={ZoomIn}
                  sx={{
                    marginLeft: '2px',
                    width: '26px',
                    height: '25px',
                    fill: colors.lightBlack,
                  }}
                />
              </StyledActionButton>
            </StyledTooltip>
          </StyledFlex>
          <StyledFlex margin="auto" direction="row" alignItems="center" gap="10px">
            <GetFileFormatIcon width="21px" height="25px" />
            <StyledText weight={600} size={19} color={colors.white}>
              {getFileName()} {!isProcessHistorySideModalView && `- ${fileSize}`}
            </StyledText>
          </StyledFlex>
          <StyledFlex position="absolute" right="28px" direction="row">
            {isDownloadable && (
              <StyledTooltip title="Download" placement="bottom" p="13px" maxWidth="auto" arrow>
                <StyledActionButton onClick={handleDownload}>
                  <SvgIcon
                    component={DownloadIcon}
                    sx={{
                      marginLeft: '2px',
                      width: '26px',
                      height: '25px',
                      color: colors.white,
                      '&>path': {
                        stroke: colors.white,
                      },
                    }}
                  />
                </StyledActionButton>
              </StyledTooltip>
            )}
            {!isProcessHistorySideModalView && (
              <StyledTooltip title="Delete" placement="bottom" p="13px" maxWidth="auto" arrow>
                <StyledActionButton onClick={onFileDeletionClick}>
                  <SvgIcon
                    component={TrashBinIcon}
                    sx={{
                      width: '24px',
                      height: '29px',
                      color: colors.white,
                    }}
                  />
                </StyledActionButton>
              </StyledTooltip>
            )}

            <StyledTooltip title="Close" arrow placement="bottom" p="13px" maxWidth="auto">
              <StyledActionButton
                onClick={() => setIsFilePreviewOpen(isProcessHistorySideModalView ? null : { isOpen: false })}
              >
                <SvgIcon
                  component={CloseRoundedIcon}
                  sx={{
                    width: '33px',
                    height: '33px',
                    color: colors.white,
                  }}
                />
              </StyledActionButton>
            </StyledTooltip>
          </StyledFlex>
        </StyledFlex>

        <StyledFlex height="100%" width="100%" backgroundColor={colors.darkBlackModalBg} position="relative">
          {showLeftArrow && !isProcessHistorySideModalView && (
            <StyledArrowLeft onClick={onLeftFileSelection}>
              <CarouselArrow />
            </StyledArrowLeft>
          )}

          {!isFileLoading && fileData ? (
            <RenderAttachmentPreview
              zoomScale={zoomScale}
              singleAttachmentFile={renderLocalAttachment ? currentFile.url : fileData}
              currentFile={currentFile}
              getFileExtension={getFileExtension}
              downloadSingleAttachment={downloadSingleAttachment}
              isCreateTicketView={isCreateTicketView}
            />
          ) : (
            <Spinner parent />
          )}

          {showRightArrow && !isProcessHistorySideModalView && (
            <StyledArrowRight onClick={onRightFileSelection}>
              <CarouselArrow />
            </StyledArrowRight>
          )}
        </StyledFlex>
      </StyledFlex>
    </Modal>
  );
};

export default TicketDetailsAttachmentsPreview;
