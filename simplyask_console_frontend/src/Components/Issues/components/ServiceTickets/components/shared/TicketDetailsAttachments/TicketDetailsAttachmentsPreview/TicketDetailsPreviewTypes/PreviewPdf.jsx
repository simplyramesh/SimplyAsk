import { useState } from 'react';
import { Page, pdfjs } from 'react-pdf';

import { StyledDivider, StyledFlex } from '../../../../../../../../shared/styles/styled';
import { StyledDocument, StyledDocumentContainer } from '../StyledAttachmentComponents';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdf.worker.min.js', window.location.origin).href;

const PreviewPdf = ({ singleAttachmentFile, zoomScale }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  return (
    <StyledDocumentContainer>
      <StyledDocument file={singleAttachmentFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <StyledFlex key={`page_${index + 1}`}>
            <Page pageNumber={index + 1} scale={zoomScale} width={600} />
            {index < numPages - 1 && <StyledDivider m="0 0 10px 0" />}
          </StyledFlex>
        ))}
      </StyledDocument>
    </StyledDocumentContainer>
  );
};

export default PreviewPdf;
