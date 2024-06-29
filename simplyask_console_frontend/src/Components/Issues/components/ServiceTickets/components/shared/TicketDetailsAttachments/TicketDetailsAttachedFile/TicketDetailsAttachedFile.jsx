import styled from '@emotion/styled';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, SvgIcon } from '@mui/material';
import { useTheme } from '@mui/system';

import { Draggable } from 'simplexiar_react_components';
import RenameIcon from '../../../../../../../../Assets/icons/cursor.svg?component';
import DownloadIcon from '../../../../../../../../Assets/icons/issues/attachments/downloadAttachments.svg?component';
import preview from '../../../../../../../../Assets/icons/issues/attachments/preview.svg?component';
import { usePopoverToggle } from '../../../../../../../../hooks/usePopoverToggle';
import { modifyDateTimeToDescriptive } from '../../../../../../../../utils/helperFunctions';
import TrashBinIcon from '../../../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledPopover, StyledText } from '../../../../../../../shared/styles/styled';
import { ALL_ATTACHMENT_FORMATS, FALLBACK_DOC_ICON, FOLDER_ICON } from '../../../../constants/attachments';

export const StyledPopoverActionsBtn = styled(Button)`
  padding: 0;
  min-width: 25px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.altoGray};
  }
`;

const StyledMoreVertBtn = styled(Button)`
  border-radius: 5px;
  padding: 2px;
  color: ${({ theme }) => theme.colors.primary};
  transform: rotate(90deg);
  width: fit-content;
  min-width: 20px;
  height: 33px;
  width: 20px;
  right: 9px;
  top: -4px;
  position: absolute;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tableEditableCellBg};
  }
`;

const TicketDetailsAttachedFile = ({
  file,
  setIsDeleteFileModalOpen,
  downloadSingleAttachment,
  isUploadFileToIssueLoading,
  setIsFilePreviewOpen,
  isCreateTicketView = false,
  handleDeleteFileOnIssueCreation,
  isDraggable = false,
  isFolder = false,
  onOpenFolder,
  isDownloadAble = false,
  onRename,
  onDownload,
  isDeleting,
  disableMoreActions = false,
  isFileHighlighted = false,
}) => {
  const { colors } = useTheme();

  const {
    id: idMoreActionsPopover,
    open: openMoreActionsPopover,
    anchorEl: anchorElMoreActionsPopover,
    handleClick: handleClickMoreActionsPopover,
    handleClose: handleCloseMoreActionsPopover,
  } = usePopoverToggle('attachment-more-actions');

  const getFileName = () => (isCreateTicketView ? file?.name : file?.fileName);

  const getFileUploadedDate = () =>
    isCreateTicketView ? modifyDateTimeToDescriptive(file?.timeStamp) : modifyDateTimeToDescriptive(file?.uploadDate);

  const lastIndexOfDot = getFileName()?.lastIndexOf('.');
  const getFileExtension = getFileName()?.slice(lastIndexOfDot + 1);

  const GetFileFormatIcon = !isFolder
    ? ALL_ATTACHMENT_FORMATS.find((format) => format.FORMAT_TYPE.toLowerCase() === getFileExtension?.toLowerCase())
        ?.ICON || FALLBACK_DOC_ICON
    : FOLDER_ICON;

  const onFilePreviewClick = (e) => {
    if (isUploadFileToIssueLoading) return;

    setIsFilePreviewOpen((prev) => ({
      ...prev,
      isOpen: true,
      fileData: file,
    }));
    handleCloseMoreActionsPopover(e);
  };

  const onDeleteFileClick = () => {
    if (isCreateTicketView) {
      handleDeleteFileOnIssueCreation?.(file?.id);
    } else {
      setIsDeleteFileModalOpen({ isOpen: true, fileId: file?.fileStorage?.referenceFileId || file?.fileId });
    }
  };

  const onMoreActionsClick = (e) => {
    e.stopPropagation();

    handleClickMoreActionsPopover(e);
  };

  const onMoreActionsClose = (e, actionFn) => {
    e.stopPropagation();
    actionFn && actionFn();
    handleCloseMoreActionsPopover(e);
  };

  const getMoreActionsPopover = () => (
    <StyledPopover
      id={idMoreActionsPopover}
      open={openMoreActionsPopover}
      anchorEl={anchorElMoreActionsPopover}
      onClose={(e) => {
        e.stopPropagation();
        handleCloseMoreActionsPopover(e);
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiPopover-paper': {
          overflow: 'hidden',
        },
        '&': {
          zIndex: 5002,
        },
      }}
    >
      <StyledFlex overflow="hidden">
        {!isFolder && (
          <StyledPopoverActionsBtn onClick={onFilePreviewClick}>
            <StyledFlex cursor="pointer" p="7px 16px" direction="row" gap="10px" alignItems="center" width="141px">
              <SvgIcon
                component={preview}
                sx={{
                  position: 'absolute',
                  top: '13px',
                  width: '23px',
                  height: '23px',
                  fill: 'none',
                }}
              />
              <StyledText ml={26}>Preview</StyledText>
            </StyledFlex>
          </StyledPopoverActionsBtn>
        )}
        {isDownloadAble && (
          <StyledPopoverActionsBtn
            onClick={(e) => {
              onMoreActionsClose(
                e,
                isCreateTicketView
                  ? onDownload(file?.id, file?.name)
                  : downloadSingleAttachment({ fileId: file?.fileStorage?.referenceFileId, name: file?.fileName })
              );
            }}
          >
            <StyledFlex cursor="pointer" p="7px 16px" direction="row" gap="10px" alignItems="center" width="141px">
              <SvgIcon
                component={DownloadIcon}
                sx={{
                  position: 'absolute',
                  top: '10px',
                  width: '19px',
                  height: '19px',
                  left: '15px',
                  color: colors.primary,
                }}
              />
              <StyledText ml={26}>Download</StyledText>
            </StyledFlex>
          </StyledPopoverActionsBtn>
        )}
        {onRename && (
          <StyledPopoverActionsBtn
            onClick={(e) => {
              onMoreActionsClose(e, onRename(file?.id, file?.name));
            }}
          >
            <StyledFlex cursor="pointer" p="7px 16px" direction="row" gap="10px" alignItems="center" width="141px">
              <SvgIcon
                component={RenameIcon}
                sx={{
                  position: 'absolute',
                  bottom: '0px',
                  width: '28px',
                  height: '28px',
                  left: '14px',
                  color: colors.primary,
                }}
              />
              <StyledText ml={26}>Rename</StyledText>
            </StyledFlex>
          </StyledPopoverActionsBtn>
        )}

        <StyledPopoverActionsBtn
          onClick={(e) => {
            onMoreActionsClose(e, onDeleteFileClick());
          }}
        >
          <StyledFlex cursor="pointer" p="7px 16px" direction="row" gap="10px" alignItems="center" width="141px">
            <SvgIcon
              component={TrashBinIcon}
              sx={{
                position: 'absolute',
                bottom: '11px',
                width: '19px',
                height: '19px',
                left: '14px',
                color: colors.primary,
              }}
            />
            <StyledText ml={26}>Delete</StyledText>
          </StyledFlex>
        </StyledPopoverActionsBtn>
      </StyledFlex>
    </StyledPopover>
  );

  const getFileIcon = () => (
    <StyledFlex
      width="145px"
      height="100px"
      backgroundColor={colors.white}
      borderRadius="8px"
      marginTop="22px"
      alignItems="center"
      justifyContent="center"
    >
      <GetFileFormatIcon />
    </StyledFlex>
  );

  const getFileInfo = () => (
    <StyledFlex>
      <StyledText size={12} weight={500} textAlign="center" maxLines={1}>
        {getFileName()}
      </StyledText>
      <StyledText size={12} textAlign="center" maxLines={1}>
        {getFileUploadedDate()}
      </StyledText>
    </StyledFlex>
  );

  const getTooltipTitle = () => (
    <StyledFlex>
      <StyledText weight={500} size={12} color={colors.white}>
        FileName: {getFileName()}
      </StyledText>
      <StyledText weight={500} size={12} color={colors.white}>
        Uploaded: {getFileUploadedDate()}
      </StyledText>
    </StyledFlex>
  );
  const handleStart = (e, id, name) => {
    if (window.electron && !isFolder) {
      window.electron.fileToched({
        id,
        fileName: name,
      });
    }
  };
  const handleDrag = (e, id, name) => {
    if (window.electron && !isFolder) {
      e.preventDefault();
      window.electron.startDrag({
        id,
        fileName: name,
      });
    }
  };

  return (
    <Draggable
      isEnabled={isDraggable}
      dragData={{ id: file?.id, name: file?.name }}
      onStart={(e) => handleStart(e, file?.id, file?.name)}
      onDrag={(e) => handleDrag(e, file?.id, file?.name)}
    >
      <StyledTooltip
        title={!isUploadFileToIssueLoading && getTooltipTitle()}
        placement="bottom"
        p="13px"
        maxWidth="auto"
      >
        <StyledFlex
          border={`2px solid ${colors.cardGridItemBorder}`}
          backgroundColor={isFileHighlighted ? colors.cardGridItemBorder : colors.white}
          borderRadius="8px"
          padding="10px 8px"
          width="161px"
          height="186px"
          position="relative"
          cursor="pointer"
          sx={{
            transition: 'all 300ms ease-in',
            '&:hover': {
              backgroundColor: isFileHighlighted ? colors.cardGridItemBorder : colors.bgColorOptionTwo,
            },
          }}
          onClick={!isFolder ? onFilePreviewClick : onOpenFolder}
        >
          {isUploadFileToIssueLoading || isDeleting ? (
            <Spinner inline medium />
          ) : (
            <>
              {!disableMoreActions && (
                <StyledMoreVertBtn onClick={onMoreActionsClick}>
                  <MoreVertIcon
                    sx={{
                      width: '29px',
                      height: '29px',
                    }}
                  />
                </StyledMoreVertBtn>
              )}
              {getMoreActionsPopover()}
              {getFileIcon()}
              {getFileInfo()}
            </>
          )}
        </StyledFlex>
      </StyledTooltip>
    </Draggable>
  );
};

export default TicketDetailsAttachedFile;
