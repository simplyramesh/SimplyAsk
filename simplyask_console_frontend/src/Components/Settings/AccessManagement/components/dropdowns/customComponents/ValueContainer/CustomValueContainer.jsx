import PropTypes from 'prop-types';
import { components } from 'react-select';

import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const CustomValueContainer = ({ children, ...props }) => {
  const isMultiValue = Array.isArray(children[0]) && children[0].length > 1;

  const addComma = (index) => children[0].length - 1 !== index || children[1].props.value.length > 0;

  return (
    <components.ValueContainer {...props}>
      {isMultiValue ? (
        <StyledFlex direction="row" flexWrap="nowrap">
          {children[0].map((child, index) => (
            <StyledFlex key={index} direction="row">
              {child}
              {addComma(index) && <StyledText as="span">, </StyledText>}
            </StyledFlex>
          ))}
          {children[1]}
        </StyledFlex>
      ) : (
        <StyledFlex direction="row">
          {children[0]}
          {children[1]}
        </StyledFlex>
      )}
    </components.ValueContainer>
  );
};

export default CustomValueContainer;

CustomValueContainer.propTypes = {
  children: PropTypes.node,
};
