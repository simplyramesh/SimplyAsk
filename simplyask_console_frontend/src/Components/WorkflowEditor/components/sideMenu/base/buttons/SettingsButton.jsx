import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';

import { ERROR_TYPES } from '../../../../utils/validation';
import css from './SettingsButton.module.css';

const variants = {
  filled: css.filled,
  outline: css.outline,
  disabled: css.disabled,
};

const rounded = {
  five: css.roundedFive,
  ten: css.roundedTen,
};

const SettingsButton = ({
  text, variant, flexWidth, radius, error, filledHover, ...props
}) => {
  return (
    <div className={classnames({
      [css.container]: true,
      [css.defaultWidth]: !flexWidth,
      [css.error]: error?.type === ERROR_TYPES.ERROR,
      [css.warning]: error?.type === ERROR_TYPES.WARNING,
    })}
    >
      <button onClick={props?.onClick} {...props} className={classnames(variants[variant], rounded[radius], filledHover && css.filled_hover)}>{text}</button>
    </div>
  );
};

export default memo(SettingsButton);

SettingsButton.defaultProps = {
  text: 'Confirm',
  variant: 'outline',
  flexWidth: false,
  radius: 'five',
};

SettingsButton.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.oneOf(['filled', 'outline', 'disabled']),
  flexWidth: PropTypes.bool,
  radius: PropTypes.oneOf(['five', 'ten']),
  onClick: PropTypes.func,
  filledHover: PropTypes.bool,
  error: PropTypes.shape({
    type: PropTypes.oneOf([ERROR_TYPES.ERROR, ERROR_TYPES.WARNING]),
    message: PropTypes.string,
  }),
};
