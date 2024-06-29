import { useEffect, useRef, useState } from 'react';

const useEditableSignatureCanvas = ({ value, signatureRef }) => {
  const [isEditing, setIsEditing] = useState(false);

  const signatureWrapperRef = useRef(null);

  const handleFocusEdit = () => setIsEditing(true);

  const handleEditBlur = (e) => {
    if (signatureWrapperRef.current.contains(e.relatedTarget)) return;

    setIsEditing(false);
  };

  useEffect(() => {
    if (value && signatureRef.current) signatureRef.current.fromDataURL(value);
  }, [isEditing, signatureRef, value]);

  useEffect(() => {
    if (isEditing) signatureWrapperRef.current.focus();
  }, [signatureWrapperRef, isEditing]);

  return {
    isEditing,
    signatureWrapperRef,
    handleFocusEdit,
    handleEditBlur,
  };
};

export default useEditableSignatureCanvas;
