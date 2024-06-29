import PropTypes from 'prop-types';
import { Children, memo } from 'react';

import RadioInput from './RadioInput';
import css from './RadioInput.module.css';

const styles = {
  row: css.radio_groupRow,
  column: css.radio_group,
};

const RadioGroup = ({ orientation, name, children }) => {
  const childrenArray = Children.toArray(children);

  return (
    <div className={styles[orientation]}>
      {childrenArray.map((child) => (
        <RadioInput key={child?.key} name={name} {...child.props} align={orientation === 'column' && 'column'} withButton />
      ))}
      {/* {children} */}
    </div>
  );
};

export default memo(RadioGroup);

RadioGroup.defaultProps = {
  orientation: 'column',
};

RadioGroup.propTypes = {
  orientation: PropTypes.oneOf(['row', 'column']),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
  name: PropTypes.string,
};
