import { useTheme } from '@mui/system';

import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledText, StyledFlex } from '../../../../../../../shared/styles/styled';
import { TICKET_ATTACHMENT_PREVIEW_TYPES } from '../../../../constants/attachments';

import PreviewImage from './TicketDetailsPreviewTypes/PreviewImage';
import PreviewJson from './TicketDetailsPreviewTypes/PreviewJson';
import PreviewPdf from './TicketDetailsPreviewTypes/PreviewPdf';
import PreviewText from './TicketDetailsPreviewTypes/PreviewText';

const FilePreviewFallBack = ({ downloadSingleAttachment, currentFile, isCreateTicketView = false }) => {
  const { colors } = useTheme();
  return (
    <StyledFlex height="100%" alignItems="center" justifyContent="center">
      <CustomTableIcons icon="BANG_CIRCLE" color={colors.white} margin="0 0 18px" width={70} />
      <StyledText size={19} weight={500} color={colors.white} mb={10} textAlign="center">
        Preview Not Available
      </StyledText>
      {isCreateTicketView ? (
        <StyledText size={19} color={colors.white} width="400px" textAlign="center" mb={22}>
          We could not create a preview of this file.
        </StyledText>
      ) : (
        <>
          <StyledText size={19} color={colors.white} width="400px" textAlign="center" mb={22}>
            We could not create a preview of this file. Try downloading the file to view it.
          </StyledText>
          <StyledButton
            variant="contained"
            secondary
            onClick={() => {
              downloadSingleAttachment({
                fileId: currentFile?.fileStorage?.referenceFileId,
                name: currentFile?.fileName,
              });
            }}
          >
            Download File
          </StyledButton>
        </>
      )}
    </StyledFlex>
  );
};

const RenderAttachmentPreview = ({
  zoomScale,
  singleAttachmentFile,
  downloadSingleAttachment,
  currentFile,
  getFileExtension,
  isCreateTicketView,
}) => {
  const isFormatSupported = (supportedFormatArray) =>
    supportedFormatArray.some((element) => element === getFileExtension?.toUpperCase());

  const sharedZoomAndFileProps = { zoomScale, singleAttachmentFile };

  const renderPreviewType = () => {
    switch (true) {
      case isFormatSupported(TICKET_ATTACHMENT_PREVIEW_TYPES.IMAGE_FORMATS):
        return <PreviewImage {...sharedZoomAndFileProps} />;
      case isFormatSupported(TICKET_ATTACHMENT_PREVIEW_TYPES.PDF_FORMAT):
        return <PreviewPdf {...sharedZoomAndFileProps} />;
      case isFormatSupported(TICKET_ATTACHMENT_PREVIEW_TYPES.TEXT_FORMAT):
        return <PreviewText {...sharedZoomAndFileProps} />;
      case isFormatSupported(TICKET_ATTACHMENT_PREVIEW_TYPES.JSON_FORMAT):
        return <PreviewJson singleAttachmentFile={singleAttachmentFile} />;
      default:
        return (
          <FilePreviewFallBack
            downloadSingleAttachment={downloadSingleAttachment}
            currentFile={currentFile}
            isCreateTicketView={isCreateTicketView}
          />
        );
    }
  };

  return renderPreviewType();
};

export default RenderAttachmentPreview;
