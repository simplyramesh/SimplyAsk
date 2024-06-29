import { useState } from 'react';

import Spinner from '../../../../../../../../shared/Spinner/Spinner';
import {
  StyledDocumentContainer, StyledTextContent, StyledTextContainer,
} from '../StyledAttachmentComponents';

const PreviewText = ({ singleAttachmentFile, zoomScale }) => {
  const [textContent, setTextContent] = useState(null);

  const reader = new FileReader();
  reader.onload = (event) => {
    const textContent = event.target.result;
    setTextContent(textContent);
  };
  reader.readAsText(singleAttachmentFile);
  if (!textContent) return <Spinner parent />;

  return (
    <StyledDocumentContainer>
      <StyledTextContainer scale={zoomScale}>
        <StyledTextContent>{textContent}</StyledTextContent>
      </StyledTextContainer>
    </StyledDocumentContainer>
  );
};

export default PreviewText;
