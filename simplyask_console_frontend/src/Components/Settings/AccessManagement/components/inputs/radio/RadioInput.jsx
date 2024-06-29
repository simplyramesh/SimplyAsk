import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';

import RadioIcon from './RadioIcon';
import css from './RadioInput.module.css';

const labelStyles = {
  start: css.label_start,
  top: css.label_top,
  bottom: css.label_bottom,
  column: css.column_label,
};

const RadioInput = ({
  label, align, name, withButton, id, ...props
}) => {
  return (
    <label
      className={classnames({
        [css.label]: !align,
        [labelStyles[align]]: !!align,
        [css.disabled]: { ...props }?.disabled,
      })}
      htmlFor={id}
    >
      <span className={css.container}>
        <input
          {...props}
          id={name}
          name={name}
          className={css.radio_input}
          type="radio"
          autoComplete="off"
        />
        {withButton && <RadioIcon />}
      </span>
      <p className={css.label_text}>{label}</p>
    </label>
  );
};

export default memo(RadioInput);

RadioInput.defaultProps = {
  label: '',
};

RadioInput.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  id: PropTypes.string,
  align: PropTypes.oneOfType([PropTypes.oneOf(['top', 'bottom', 'start', 'column']), PropTypes.bool]),
  name: PropTypes.string,
  withButton: PropTypes.bool,
};
