import { Drawer } from '@mui/material';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const BaseSidebar = forwardRef(({
  width, children, sx, ...props
}, ref) => (
  <Drawer
    anchor="right"
    sx={{
      '& .MuiDrawer-paperAnchorRight': {
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
        width: width ? `${width}px` : 'auto',
        maxWidth: width ? `${width}px` : '456px',
        backgroundColor: '#ffffff',
        fontStyle: 'normal',
        color: '#2d3a47',
      },
      ...sx,
    }}
    ModalProps={{
      keepMounted: false,
    }}
    ref={ref}
    {...props}
  >
    {children}
  </Drawer>

));

BaseSidebar.propTypes = {
  width: PropTypes.number,
  isOverlay: PropTypes.bool,
  children: PropTypes.node,
};

export default BaseSidebar;
