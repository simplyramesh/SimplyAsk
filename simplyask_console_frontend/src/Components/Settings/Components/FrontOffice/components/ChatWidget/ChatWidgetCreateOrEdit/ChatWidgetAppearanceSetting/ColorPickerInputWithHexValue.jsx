import { useTheme } from '@emotion/react';
import { useRef } from 'react';

import {
  StyledIconButton,
  StyledColorSquare, StyledColorSquareContainer, StyledFlex,
} from '../../../../../../../shared/styles/styled';

import { StyledColorTextInput, StyledColorPickerRoot, StyledColorInput } from './StyledColorPickerHexInput';

const ColorPickerInputWithHexValue = ({
  squareColor,
  onPickerChange,
  onTextChange,
  id,
  name,
}) => {
  const { colors } = useTheme();
  const colorPicketRef = useRef();

  return (
    <StyledColorPickerRoot position="relative" height="41px">
      <StyledFlex position="absolute" top="8px" left="9px" zIndex="1">
        <StyledIconButton
          onClick={() => colorPicketRef?.current?.click()}
          iconColor="transparent"
          bgColor="transparent"
          hoverBgColor="transparent"
          size="25px"
        >
          <StyledColorSquareContainer>
            <StyledColorSquare
              backgroundColor={squareColor}
              mr="0px"
              ml="0px"
            >
            </StyledColorSquare>
          </StyledColorSquareContainer>
        </StyledIconButton>

      </StyledFlex>

      <StyledColorTextInput
        value={squareColor}
        onChange={onTextChange}
        name={name}
        id={id}
      />

      <StyledColorInput
        type="color"
        ref={colorPicketRef}
        name={name}
        value={squareColor || colors.white}
        onChange={onPickerChange}
      />

    </StyledColorPickerRoot>
  );
};

export default ColorPickerInputWithHexValue;
