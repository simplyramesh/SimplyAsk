import { useEffect, useRef, useState } from 'react';

import { StyledEditValueTrigger } from './StyledEditValueTrigger';

const EditValueTrigger = ({
  children,
  editableComponent,
  margin,
  padding,
  minHeight,
  bgTopBotOffset,
  justifyContent = 'flex-end',
  onEdit,
  position = {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const keyRef = useRef(null);
  const key = keyRef.current;

  useEffect(() => {
    if (isEditing) {
      onEdit?.();
    }
  }, [isEditing]);

  return (
    <StyledEditValueTrigger
      isEditing={isEditing}
      direction="row"
      justifyContent={justifyContent}
      minHeight={minHeight}
      margin={margin}
      padding={padding}
      bgTopBotOffset={bgTopBotOffset}
      {...position}
      onClick={() => {
        if (!isEditing) {
          keyRef.current += 1;
          setIsEditing(true);
        }
      }}
    >
      {isEditing
        ? editableComponent((val) => {
            keyRef.current += 1;
            return setIsEditing(val);
          }, key)
        : children}
    </StyledEditValueTrigger>
  );
};

export default EditValueTrigger;
