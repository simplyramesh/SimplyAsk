import { useEffect, useRef, useState } from 'react';

export const useModalToggle = () => {
  const openId = useRef(1);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      openId.current += 1;
    }
  }, [open]);

  return {
    open,
    setOpen,
    openId: openId.current,
  };
};
