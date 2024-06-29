import PropTypes from 'prop-types';
import { useState } from 'react';

import { StyledFlex } from '../../styles/styled';

import { StyledBaseTextInput } from './StyledBaseTextInput';

const BaseTextInput = ({
  borderColor, inputRef, inputHeight, textAlign, onChange = () => {}, ...props
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    onChange(e);
  };

  return (
    <StyledFlex direction="row" flex="auto" width="100%" height={inputHeight}>
      <StyledBaseTextInput
        value={inputValue}
        onChange={handleInputChange}
        {...props}
        borderColor={borderColor}
        height={inputHeight}
        textAlign={textAlign}
        ref={inputRef}
      />
    </StyledFlex>
  );
};

export default BaseTextInput;

BaseTextInput.propTypes = {
  borderColor: PropTypes.string,
  inputHeight: PropTypes.string,
  textAlign: PropTypes.string,
  inputRef: PropTypes.object,
  onChange: PropTypes.func,
};
