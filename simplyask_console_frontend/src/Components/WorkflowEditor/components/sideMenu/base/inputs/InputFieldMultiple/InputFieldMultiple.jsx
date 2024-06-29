import PropTypes from 'prop-types';
import React, { useState } from 'react';

import AddedInputItem from '../../AddedInputItem/AddedInputItem';

const InputFieldMultiple = ({
  value, onChange, children,
}) => {
  const [state, setState] = useState('');

  const handleAdd = () => {
    if (!state) return;

    if (!value) onChange([{ value: state }]);
    if (value) onChange([...value, { value: state }]);

    setState('');
  };

  const handleRemove = (val) => {
    onChange(value?.filter((item) => item.value !== val));
  };

  return (
    <div>
      {children({
        handleAdd,
        state,
        setState,
      })}

      {Array.isArray(value) && value?.map((item, index) => (
        <AddedInputItem
          key={index}
          title={item.title}
          value={item.value}
          onRemove={() => handleRemove(item.value)}
        />
      ))}
    </div>
  );
};

InputFieldMultiple.propTypes = {
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string, PropTypes.object]),
  children: PropTypes.func,
  onChange: PropTypes.func,
};

export default InputFieldMultiple;
