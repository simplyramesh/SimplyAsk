import { useEffect, useRef, useState } from 'react';

/*
  * Some Input components (which may have parent div for example), are do not trigger an onBlur event when the child input loses focus.
  * This hook can be used to handle the focus and blur events of the parent div.
  * Example usage:
    * isEditing
      ? <StyledFlex
        ref={wrapperRef}
        tabIndex={0}
        onBlur={handleEditBlur}
      >
        <input/>
      </StyledFlex>
      : <SomeComponent onClick={handleFocusEdit}/>
*/

const useEditableField = () => {
  const [isEditing, setIsEditing] = useState(false);

  const wrapperRef = useRef(null);
  const childRef = useRef(null);

  const handleEditBlur = (e) => {
    if (wrapperRef.current.contains(e.relatedTarget)) return;

    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) wrapperRef.current.focus();
  }, [wrapperRef, isEditing]);

  useEffect(() => {
    if (isEditing && childRef.current) childRef.current.focus();
  }, [childRef, isEditing]);

  return {
    isEditing,
    wrapperRef,
    childRef,
    handleFocusEdit: () => setIsEditing(true),
    handleEditBlur,
  };
};

export default useEditableField;
