import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';

import { StyledFlex } from '../../../../../../shared/styles/styled';
import Typography from '../../Typography/Typography';
import RadioIcon from './RadioIcon';
import css from './RadioInput.module.css';

const labelStyles = {
  start: css.label_start,
  top: css.label_top,
  bottom: css.label_bottom,
  column: css.column_label,
};

const RadioInput = ({
  label, align, name, withButton, variant, children, ...props
}) => {
  return (
    <label
      className={classnames({
        [css.label]: !align,
        [labelStyles[align]]: !!align,
      })}
      htmlFor={name}
    >
      <span className={css.container}>
        <input {...props} id={name} name={name} className={css.radio_input} type="radio" autoComplete="off" />
        {withButton && <RadioIcon />}
      </span>
      <StyledFlex marginTop="2px">
        <Typography as="span" variant={variant || 'default'} weight="regular">
          {label}
        </Typography>
        {children && <StyledFlex mt={2}>{children}</StyledFlex>}
      </StyledFlex>
    </label>
  );
};

export default memo(RadioInput);

RadioInput.defaultProps = {
  label: 'Dynamic',
};

RadioInput.propTypes = {
  label: PropTypes.string,
  align: PropTypes.oneOfType([PropTypes.oneOf(['top', 'bottom', 'start', 'column']), PropTypes.bool]),
  name: PropTypes.string,
  variant: PropTypes.string,
  withButton: PropTypes.bool,
};
