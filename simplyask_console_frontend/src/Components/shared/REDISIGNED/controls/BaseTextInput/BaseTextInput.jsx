import PropTypes from 'prop-types';
import { useState } from 'react';

import { StyledFlex, StyledText } from '../../../styles/styled';

import { StyledBaseTextInput } from './StyledBaseTextInput';

const BaseTextInput = ({
  borderColor, inputRef, inputHeight, textAlign, showLength, maxLength, placeholderFontSize, onChange = () => {}, ...props
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    onChange(e);
  };

  return (
    <StyledFlex position="relative">
      <StyledFlex direction="row" flex="auto" width="100%" height={inputHeight}>
        <StyledBaseTextInput
          value={inputValue}
          onChange={handleInputChange}
          maxLength={maxLength}
          {...props}
          borderColor={borderColor}
          height={inputHeight}
          textAlign={textAlign}
          ref={inputRef}
          placeholderFontSize={placeholderFontSize}
        />
      </StyledFlex>
      { showLength && <StyledFlex position="absolute" bottom={-20} right={0} justifyContent="flex-end" direction="row">
        <StyledText size={12} lh={15}>{props.value?.length || inputValue?.length}{maxLength ? `/${maxLength}`: ''} characters</StyledText>
      </StyledFlex> }
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
