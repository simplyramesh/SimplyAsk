import { useTheme } from '@mui/material/styles';
import { forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { StyledFlex } from '../../../styles/styled';
import { StyledButton } from '../Button/StyledButton';
import { StyledSignatureWrapper } from './StyledSignature';
import ViewOnlySignature from './ViewOnlySignature';
import useEditableSignatureCanvas from './hooks/useEditableSignatureCanvas';
import useSignatureCanvas from './hooks/useSignatureCanvas';

const EditableSignature = forwardRef(({ onChange, error, value }, ref) => {
  const { colors } = useTheme();

  const { signatureRef, handleRemovePlaceholder, handleSaveSignature, handleClearSignature } = useSignatureCanvas({
    value,
    onChange,
    imperativeRef: ref,
  });

  const { isEditing, signatureWrapperRef, handleFocusEdit, handleEditBlur } = useEditableSignatureCanvas({
    value,
    signatureRef,
  });

  return (
    <StyledFlex flex="auto" minHeight="35px" justifyContent={isEditing ? 'flex-start' : 'center'}>
      {!isEditing ? (
        <StyledButton variant="text" alignSelf="flex-start" transparent onClick={handleFocusEdit} fullWidth>
          <ViewOnlySignature src={value} alt="Signature" />
        </StyledButton>
      ) : (
        <StyledSignatureWrapper
          error={error}
          editable={isEditing}
          tabIndex="0"
          onBlur={handleEditBlur}
          ref={signatureWrapperRef}
        >
          <SignatureCanvas
            clearOnResize={false}
            penColor={colors.black}
            canvasProps={{ className: 'signatureCanvas' }}
            ref={signatureRef}
            onBegin={handleRemovePlaceholder}
            onEnd={handleSaveSignature}
          />
          <StyledButton variant="text" size="medium" alignSelf="flex-start" onClick={handleClearSignature}>
            Clear Signature
          </StyledButton>
        </StyledSignatureWrapper>
      )}
    </StyledFlex>
  );
});

export default EditableSignature;
