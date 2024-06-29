import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import CustomTableIcons from '../../icons/CustomTableIcons';

import {
  StyledFixedModal,
  StyledFixedModalBody,
  StyledFixedModalFooter,
  StyledFixedModalHead,
} from './StyledCenterModal';
import { useTheme } from '@mui/system';

const CenterModalFixed = ({
  open,
  actions,
  title,
  onClose,
  children,
  maxWidth,
  actionsHeight = 76,
  titleHeight = 54,
  footerShadow = true,
  enableScrollbar = true,
  isDarkTheme = false,
  height,
  width,
  bodyHeight,
  bodyPadding,
  modalFooterHeight,
  zIndexRoot = 5001,
}) => {
  const topBottomMargin = 32;
  const actionsH = actions ? actionsHeight : 0;
  const titleH = title ? titleHeight : 0;
  const contentHeight = `calc(100vh - ${actionsH + titleH + topBottomMargin * 2}px)`;

  const { colors } = useTheme();

  const closeIcon = () => <CustomTableIcons icon="CLOSE" width={20} onClick={onClose} />;

  return (
    <StyledFixedModal
      fullWidth
      maxWidth={maxWidth}
      height={height}
      width={width}
      open={open}
      bgColor={isDarkTheme ? colors.darkerGray : 'white'}
      onClose={onClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      keepMounted={false}
      zindex={zIndexRoot}
    >
      {title ? (
        <StyledFixedModalHead bgColor={isDarkTheme ? colors.darkerGray : colors.lighterColor} id="scroll-dialog-title">
          {title}
          {closeIcon()}
        </StyledFixedModalHead>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1,
          }}
        >
          {closeIcon()}
        </div>
      )}

      {enableScrollbar ? (
        <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={contentHeight}>
          <StyledFixedModalBody bodyHeight={bodyHeight} bodyPadding={bodyPadding} enableScrollbar={enableScrollbar}>
            {children}
          </StyledFixedModalBody>
        </Scrollbars>
      ) : (
        <StyledFixedModalBody bodyHeight={bodyHeight} bodyPadding={bodyPadding}>
          {children}
        </StyledFixedModalBody>
      )}

      {actions && (
        <StyledFixedModalFooter footerShadow={footerShadow} height={modalFooterHeight}>
          {actions}
        </StyledFixedModalFooter>
      )}
    </StyledFixedModal>
  );
};

export default CenterModalFixed;

CenterModalFixed.propTypes = {
  children: PropTypes.node,
  actions: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  actionsHeight: PropTypes.number,
  titleHeight: PropTypes.number,
  maxWidth: PropTypes.string,
  isDarkTheme: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
