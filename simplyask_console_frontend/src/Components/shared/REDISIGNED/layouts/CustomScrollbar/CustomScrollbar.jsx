import { useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import {
  StyledHorizontalThumb,
  StyledHorizontalTrack,
  StyledVerticalThumb,
  StyledVerticalTrack,
  StyledView,
} from './StyledCustomScrollbar';

const CustomScrollbar = (props) => {
  const {
    radius,
    thumbColor,
    thumbWidth,
    trackBorder,
    trackWidth,
    trackColor,
    children,
    ...rest
  } = props;

  const showTrack = useRef({
    vertical: true,
    horizontal: true,
  });

  const styleProps = {
    radius,
    thumbColor,
    thumbWidth,
    trackBorder,
    trackWidth,
    trackColor,
    showTrack: showTrack.current,
  };

  return (
    <Scrollbars
      {...rest}
      onUpdate={(values) => {
        showTrack.current = {
          vertical: values.scrollHeight > values.clientHeight,
          horizontal: values.scrollWidth > values.clientWidth,
        };
      }}
      renderTrackHorizontal={({ style, ...props }) => <StyledHorizontalTrack styles={style} {...props} {...styleProps} />}
      renderThumbHorizontal={({ style, ...props }) => <StyledHorizontalThumb styles={style} {...props} {...styleProps} />}
      renderThumbVertical={({ style, ...props }) => <StyledVerticalThumb styles={style} {...props} {...styleProps} />}
      renderTrackVertical={({ style, ...props }) => <StyledVerticalTrack styles={style} {...props} {...styleProps} />}
      renderView={({ style, ...props }) => <StyledView styles={style} {...props} {...styleProps} />}
    >
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbar;

CustomScrollbar.propTypes = Scrollbars.propTypes;
