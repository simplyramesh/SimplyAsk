import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import {
  StyledContentContainer,
  StyledContentMain,
  StyledContentSide,
  StyledPaddedScrollbar,
} from './StyledContentLayout';

export const CustomScrollbar = ({ grayBgThumbVertical, children, onScroll, ...rest }) => {
  const { colors, boxShadows } = useTheme();

  const handleScroll = (values) => {
    if (onScroll) {
      onScroll(values);
    }
  };

  const renderThumbVertical = ({ style, ...props }) => (
    <div
      {...props}
      style={{
        ...style,
        width: '10px',
        left: '5px',
        borderRadius: '5px',
        backgroundColor: colors.tableScrollThumb,
        opacity: 1,
        zIndex: 1501,
      }}
    />
  );

  const renderTrackVertical = ({ style, ...props }) => (
    <div
      {...props}
      style={{
        ...style,
        backgroundColor: 'white',
        right: 0,
        bottom: 0,
        top: 0,
        borderRadius: '3px',
        width: '20px',
        boxShadow: boxShadows.box,
        padding: '15px 0',
      }}
    />
  );

  return grayBgThumbVertical ? (
    <StyledPaddedScrollbar>{children}</StyledPaddedScrollbar>
  ) : (
    <Scrollbars
      autoHide
      style={{}}
      renderTrackVertical={renderTrackVertical}
      renderThumbVertical={renderThumbVertical}
      onScroll={onScroll}
      onScrollFrame={handleScroll}
      {...rest}
    >
      {children}
    </Scrollbars>
  );
};

const ContentLayout = ({
  side,
  children,
  noPadding,
  fullHeight,
  sideWidth,
  containerDirection,
  grayBgThumbVertical,
  disableScroll,
}) => (
  <StyledContentContainer containerDirection={containerDirection}>
    {side && <StyledContentSide sideWidth={sideWidth}>{side}</StyledContentSide>}
    <CustomScrollbar grayBgThumbVertical={grayBgThumbVertical}>
      <StyledContentMain {...{ noPadding }} {...{ fullHeight }} disableScroll={disableScroll}>
        {children}
      </StyledContentMain>
    </CustomScrollbar>
  </StyledContentContainer>
);

ContentLayout.propTypes = {
  side: PropTypes.element,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  noPadding: PropTypes.bool,
  fullHeight: PropTypes.bool,
};

export default ContentLayout;
