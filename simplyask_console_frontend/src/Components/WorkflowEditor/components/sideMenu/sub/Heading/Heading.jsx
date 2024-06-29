import classnames from 'classnames';
import PropTypes from 'prop-types';

import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import InfoIcon from '../../../../Assets/Icons/infoIcon.svg?component';
import { Typography } from '../../base';
import css from './Heading.module.css';

const sizeMap = {
  small: 'small', // 14px
  default: 'default', // 16px
  medium: 'medium', // 18px
  large: 'large', // 20px
};

const Heading = ({ as, size, children, noWrap, promptText }) => {
  return (
    <>
      <Typography as={as} variant={sizeMap[size]} weight="bold">
        <span
          className={classnames({
            [css.withIcon]: true,
            [css.nowrap]: noWrap,
          })}
        >
          {children}
          {promptText && (
            <StyledTooltip title={promptText} arrow placement="top" p="10px 15px" maxWidth="auto">
              <span className={css.icon}>
                <InfoIcon />
              </span>
            </StyledTooltip>
          )}
        </span>
      </Typography>
    </>
  );
};

export default Heading;

Heading.defaultProps = {
  as: 'h2',
  size: 'default',
};

Heading.propTypes = {
  as: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'medium', 'large']),
  children: PropTypes.string,
  noWrap: PropTypes.bool,
  promptText: PropTypes.string,
};
