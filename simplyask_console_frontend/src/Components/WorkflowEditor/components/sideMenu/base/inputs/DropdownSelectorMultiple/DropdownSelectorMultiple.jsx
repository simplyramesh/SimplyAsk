import PropTypes from 'prop-types';
import { useState } from 'react';

import AddedInputItem from '../../AddedInputItem/AddedInputItem';

const DropdownSelectorMultiple = ({
  value, onChange, children, displayDynamicParamValues,
}) => {
  const [state, setState] = useState('');

  const handleAdd = () => {
    if (!state) return;

    if (displayDynamicParamValues) {
      onChange([...value, { value: { value: state.value.value || state.value.validationType, label: state.value.paramName } }]);
    }
    if (!displayDynamicParamValues) onChange([...value, { value: state }]);

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
          title={item.value.label}
          value={item.value.value}
          onRemove={() => handleRemove(item.value)}
        />
      ))}
    </div>
  );
};

export default DropdownSelectorMultiple;

DropdownSelectorMultiple.propTypes = {
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]),
  children: PropTypes.func,
  onChange: PropTypes.func,
  displayDynamicParamValues: PropTypes.bool,
};
