import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';

import css from './Typography.module.css';

const elementMap = {
  title: 'h2',
  heading: 'h4',
  subheading: 'h6',
  body: 'p',
};

const variantMap = {
  xsmall: css.xsmall, // 12px
  small: css.small, // 14px
  default: css.defaultSize, // 16px
  medium: css.mid, // 18px
  large: css.large, // 20px
};

const weightMap = {
  regular: css.regular, // 400
  medium: css.medium, // 500
  bold: css.bold, // 600
  xbold: css.xbold, // 700
};

const colorMap = {
  default: css.defaultColor,
  red: css.red,
  green: css.green,
  yellow: css.yellow,
  gray: css.gray,
};

const Typography = ({
  as, children, color, variant, weight, noWrap, section, ...restProps
}) => {
  const styles = [
    css.default, variantMap[variant], weightMap[weight], colorMap[color], noWrap && css.noWrap,
  ];
  const Component = as || elementMap[section] || 'span';

  return (
    <Component {...restProps} className={classnames(...styles)}>{children}</Component>
  );
};

export default memo(Typography);

Typography.defaultProps = {
  children: 'Workflow Name',
  color: 'default',
  variant: 'default',
  weight: 'regular',
  noWrap: false,
};

Typography.propTypes = {
  as: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element, PropTypes.string]),
  color: PropTypes.oneOf(['default', 'red', 'green', 'yellow', 'gray']),
  variant: PropTypes.oneOf(['xsmall', 'small', 'default', 'medium', 'large']),
  weight: PropTypes.oneOf(['regular', 'medium', 'bold', 'xbold']),
  section: PropTypes.oneOf(['title', 'heading', 'subheading', 'body']),
  noWrap: PropTypes.bool,
};
