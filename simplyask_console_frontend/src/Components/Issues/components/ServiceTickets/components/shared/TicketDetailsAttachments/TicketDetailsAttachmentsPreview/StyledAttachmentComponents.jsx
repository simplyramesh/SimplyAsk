import styled from '@emotion/styled';
import { Document } from 'react-pdf';

export const StyledDocumentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: auto;
`;

export const StyledDocument = styled(Document)`
  height: 90vh;
`;

export const StyledImage = styled.img`
  transform: scale(${(props) => props.scale || 1});
  max-height: 100%;
  max-width: 100%;
`;

export const StyledTextContainer = styled.div`
  background: white;
  padding: 20px;
  width: 600px;
  overflow: auto;
  height: 90vh;
  transform: scale(${props => props.scale});
  max-width: 100%;
`;

export const StyledTextContent = styled.pre`
  white-space: pre-wrap;
`;