import { useEffect, useImperativeHandle, useRef } from 'react';
import { drawPlaceholder } from '../helpers';

const useSignatureCanvas = ({ value, onChange, imperativeRef }) => {
  const signatureRef = useRef(null);

  useEffect(() => {
    if (!signatureRef.current) return;

    if (!value) drawPlaceholder(signatureRef);
  }, [value]);

  const handleRemovePlaceholder = () => {
    if (!value) drawPlaceholder(signatureRef, true);
  };

  const handleSaveSignature = () => {
    const canvasDataURL = signatureRef.current.toDataURL('image/png');
    onChange?.(canvasDataURL);
  };

  const handleClearSignature = () => {
    drawPlaceholder(signatureRef);
    onChange?.('');
    signatureRef.current.clear();
  };

  useImperativeHandle(imperativeRef, () => ({
    clearSignature: () => {
      signatureRef.current.clear();
      drawPlaceholder(signatureRef);
    },
  }));

  return {
    signatureRef,
    handleRemovePlaceholder,
    handleSaveSignature,
    handleClearSignature,
  };
};

export default useSignatureCanvas;
