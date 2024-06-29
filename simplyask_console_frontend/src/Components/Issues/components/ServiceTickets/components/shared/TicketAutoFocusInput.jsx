import { useTheme } from '@emotion/react';
import { useEffect, useRef } from 'react';

import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';

const TicketAutoFocusInput = ({
  placeholder, value, onChange, onBlur, onConfirm,
}) => {
  const { colors } = useTheme();

  const ticketNameRef = useRef(null);

  useEffect(() => {
    ticketNameRef?.current?.focus();
  }, []);

  return (
    <BaseTextInput
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ticketNameRef}
      borderColor={colors.linkColor}
      fontSize="24px"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();

          onConfirm?.();

          ticketNameRef.current.blur();
        }
      }}
    />
  );
};

export default TicketAutoFocusInput;
