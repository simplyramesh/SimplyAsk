import classnames from 'classnames';
import PropTypes from 'prop-types';

import css from './Content.module.css';

const stylesMapping = {
  default: css.default,
  outer: css.outer,
  inner: css.inner,
  wide: css.wide,
  group: css.group,
};

const Content = ({
  as, centered, row, gap, variant, flex1, children,
}) => {
  const Component = as || 'div';

  return (
    <Component
      className={
        classnames(
          stylesMapping[variant],
          {
            [css.container]: !row,
            [css.row]: row,
            [css.flex1]: flex1,
            [css.centered]: centered,
            [css[`gap${gap}`]]: gap,
          },
        )
      }
    >
      {children}
    </Component>
  );
};

export default Content;

Content.defaultProps = {
  centered: false,
  variant: 'default',
  flex1: false,
};

Content.propTypes = {
  as: PropTypes.elementType,
  centered: PropTypes.bool,
  row: PropTypes.bool,
  gap: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'outer', 'inner', 'wide', 'group']),
  flex1: PropTypes.bool,
  children: PropTypes.node,
};
