import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';

import DropDownIcon from '../../WorkflowEditor/Assets/Icons/arrowDropDown.svg?component';
import Typography from '../../WorkflowEditor/components/sideMenu/base/Typography/Typography';
import css from './Dropdown.module.css';

const Dropdown = ({ onClick, selectedValue, placeholder, children, divider }) => {
  return (
    <div className={css.container}>
      <button className={css.button} type="button" value={selectedValue} onClick={onClick}>
        <Typography>{selectedValue || placeholder}</Typography>
        {divider && <Divider orientation="vertical" variant="middle" flexItem />}
        <span className={css.select_icon}>
          <DropDownIcon />
        </span>
      </button>
      {children}
    </div>
  );
};

export default Dropdown;

Dropdown.propTypes = {
  placeholder: PropTypes.string,
  selectedValue: PropTypes.string,
  onClick: PropTypes.func,
  divider: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};
