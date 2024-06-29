import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PropTypes from 'prop-types';
import React from 'react';
import { Input } from 'simplexiar_react_components';

import classes from './InputField.module.css';

const InputField = ({
  placeholder,
  value,
  onChange,
  removable,
  onClickDelete,
  name,
}) => {
  return (
    <div className={classes.profileCardItem}>
      <div className={classes.flex_between}>
        <Input
          className={classes.profileCardItemText}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          required
        />

        {removable && <DeleteForeverIcon className={classes.delete} onClick={onClickDelete} />}
      </div>
    </div>
  );
};

export default InputField;

InputField.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  removable: PropTypes.bool,
  onClickDelete: PropTypes.func,
  name: PropTypes.string,
};
