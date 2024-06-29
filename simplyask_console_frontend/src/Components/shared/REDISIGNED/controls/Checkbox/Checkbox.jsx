import PropTypes from 'prop-types';

import { StyledCheckbox } from '../../../styles/styled';

const Checkbox = ({ onChange, checkValue, ...rest }) => {
  return (
    <StyledCheckbox
      {...rest}
      checked={checkValue}
      onChange={onChange}
      disableRipple
    />
  );
};

export default Checkbox;

Checkbox.propTypes = {
  onChange: PropTypes.func,
  checkValue: PropTypes.bool,
};
