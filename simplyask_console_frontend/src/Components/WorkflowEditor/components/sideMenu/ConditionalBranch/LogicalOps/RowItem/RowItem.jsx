import classnames from 'classnames';
import PropTypes from 'prop-types';

import { Typography } from '../../../base';
import { Heading } from '../../../sub';
import css from './RowItem.module.css';

const RowItem = ({
  isHeading, left, right, isShaded, withBorder, fixedHeight,
}) => {
  return (
    <div className={css.container}>
      <div className={classnames({
        [css.left]: true,
        [css.withShade]: isShaded,
        [css.withLeftBorder]: withBorder,
        [css.fixedHeight]: fixedHeight,
      })}
      >
        {isHeading && <Heading as="h4" size="default">{left}</Heading>}
        {!isHeading && <Typography as="p" variant="default" weight="regular">{left}</Typography>}
      </div>
      <div className={classnames({
        [css.right]: true,
        [css.withShade]: isShaded,
        [css.withRightBorder]: withBorder,
        [css.fixedHeight]: fixedHeight,
      })}
      >
        {isHeading && <Heading as="h4" size="default">{right}</Heading>}
        {!isHeading && <Typography as="p" variant="default" weight="regular">{right}</Typography>}
      </div>
    </div>
  );
};

export default RowItem;

RowItem.propTypes = {
  isHeading: PropTypes.bool,
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  right: PropTypes.string,
  isShaded: PropTypes.bool,
  withBorder: PropTypes.bool,
  fixedHeight: PropTypes.bool,
};
