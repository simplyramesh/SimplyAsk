import { StyledFlex } from '../../../../../../../../shared/styles/styled';
import {
  StyledImage,
} from '../StyledAttachmentComponents';

const PreviewImage = ({ singleAttachmentFile, zoomScale }) => (
  <StyledFlex
    overflow="auto"
    display="flex"
    justifyContent="center"
    alignItems="center"
    width="100vw"
    height="90vh"
  >
    <StyledImage
      src={URL.createObjectURL(singleAttachmentFile)}
      alt="Attachment"
      scale={zoomScale}
    />
  </StyledFlex>
);

export default PreviewImage;
