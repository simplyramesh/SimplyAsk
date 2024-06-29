import classnames from 'classnames';
import PropTypes from 'prop-types';

import css from './Divider.module.css';

const orientations = {
  horizontal: css.horizontal_height,
  vertical: css.vertical,
};

const variants = {
  center: {
    horizontal: css.centerH,
    vertical: css.centerV,
  },
};

const align = {
  default: {
    horizontal: '',
    vertical: css.withChildrenV,
  },
  left: {
    horizontal: css.textLeftH,
    vertical: '',
  },
  right: {
    horizontal: css.textRightH,
    vertical: '',
  },
};

const colorMap = {
  default: css.color_default,
  orange: css.color_lightOrange,
  gray: css.color_gray,
};

const Divider = (props) => {
  const {
    orientation, variant, children, textAlign, absolute, color, flexItem,
  } = props;

  const styles = {
    [css.container]: true,
    [orientations[orientation]]: !!orientation,
    [colorMap[color]]: !!color,
    [css.absolute]: absolute,
    [css.flexItem]: flexItem,
    [variants.center[orientation]]: variant === 'center',
    [css.inset]: variant === 'inset',
    [css.withChildren]: textAlign === 'default',
  };

  return (
    <div className={classnames(styles, textAlign && align[textAlign][orientation])}>
      <span className={css.wrapper}>{children}</span>
    </div>
  );
};

export default Divider;

Divider.defaultProps = {
  orientation: 'horizontal',
  absolute: false,
  color: 'default',
  flexItem: false,
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['center', 'inset']),
  children: PropTypes.element,
  textAlign: PropTypes.oneOf(['left', 'right']),
  absolute: PropTypes.bool,
  color: PropTypes.oneOf(['default', 'orange', 'gray']),
  flexItem: PropTypes.bool,
};
