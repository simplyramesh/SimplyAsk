import { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';

import Spinner from '../../../../../../../../shared/Spinner/Spinner';
import {
  StyledDocumentContainer, StyledTextContainer,
} from '../StyledAttachmentComponents';

const PreviewJson = ({ singleAttachmentFile }) => {
  const [jsonObject, setJsonObject] = useState(null);

  useEffect(() => {
    if (singleAttachmentFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const textData = reader.result;
        try {
          const parsedJson = JSON.parse(textData);
          setJsonObject(parsedJson);
        } catch (error) {
          setJsonObject(false);
        }
      };

      reader.readAsText(singleAttachmentFile);
    }
  }, [singleAttachmentFile]);

  return jsonObject
    ? (
      <StyledDocumentContainer>
        <StyledTextContainer>
          <ReactJson src={jsonObject} />
        </StyledTextContainer>
      </StyledDocumentContainer>
    ) : <Spinner parent />;
};

export default PreviewJson;
