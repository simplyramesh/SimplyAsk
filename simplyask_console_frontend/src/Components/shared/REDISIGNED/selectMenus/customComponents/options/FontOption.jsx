import { components } from 'react-select';
import { StyledFlex, StyledText } from "../../../../styles/styled";

export const FontOption = ({ children, data, ...props }) => {
  const { label, value } = data;
  return (
    <components.Option {...props}>
      <StyledFlex>
        <StyledText ff={value}>{label}</StyledText>
      </StyledFlex>
    </components.Option>
  );
};
