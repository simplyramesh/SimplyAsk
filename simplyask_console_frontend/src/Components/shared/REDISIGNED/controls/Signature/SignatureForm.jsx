import { useTheme } from '@mui/material/styles';
import { forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { StyledButton } from '../Button/StyledButton';
import { StyledSignatureWrapper } from './StyledSignature';
import useSignatureCanvas from './hooks/useSignatureCanvas';

const SignatureForm = forwardRef(({ value, onChange, error }, ref) => {
  const { colors } = useTheme();

  const { signatureRef, handleRemovePlaceholder, handleSaveSignature, handleClearSignature } = useSignatureCanvas({
    value,
    onChange,
    imperativeRef: ref,
  });

  return (
    <StyledSignatureWrapper error={error}>
      <StyledButton variant="text" size="medium" alignSelf="flex-start" onClick={handleClearSignature}>
        Clear Signature
      </StyledButton>
      <SignatureCanvas
        clearOnResize={false}
        penColor={colors.black}
        canvasProps={{ className: 'signatureCanvas' }}
        ref={signatureRef}
        onBegin={handleRemovePlaceholder}
        onEnd={handleSaveSignature}
      />
    </StyledSignatureWrapper>
  );
});

export default SignatureForm;
