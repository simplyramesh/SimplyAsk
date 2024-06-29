import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../styles/styled';

const BaseTicketStatus = ({
  children, bgColor, color, textProps, bgProps,
}) => {
  const text = typeof children === 'string'
    ? (
      <StyledText
        size={15}
        weight={600}
        lh={18}
        color={color}
        {...textProps}
      >
        {children}
      </StyledText>
    )
    : children;

  return (
    <StyledFlex
      alignItems="center"
      justifyContent="center"
      width="128px"
      height="34px"
      backgroundColor={bgColor}
      borderRadius="10px"
      {...bgProps}
    >
      {text}
    </StyledFlex>
  );
};

export default BaseTicketStatus;

BaseTicketStatus.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  bgColor: PropTypes.string,
  color: PropTypes.string,
  textProps: PropTypes.shape({
    size: PropTypes.number,
    weight: PropTypes.number,
    lh: PropTypes.number,
    color: PropTypes.string,
  }),
  bgProps: PropTypes.object,
};
