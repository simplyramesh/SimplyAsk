import { Dialog, Slide } from '@mui/material';
import React from 'react';

const Transition = React.forwardRef((
  props,
  ref,
) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenModal = ({ open, onClose, children }) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      {children}
    </Dialog>
  );
};

export default FullScreenModal;
