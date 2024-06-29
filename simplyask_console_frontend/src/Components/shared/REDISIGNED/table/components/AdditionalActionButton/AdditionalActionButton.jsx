import PropTypes from 'prop-types';

import { StyledAdditionalActionButton } from './StyledAdditionalActionButton';

const AdditionalActionButton = ({ onClick, bold, text }) => {
  return (
    <StyledAdditionalActionButton
      type="button"
      onClick={onClick}
      bold={bold}
    >
      {text}
    </StyledAdditionalActionButton>
  );
};

export default AdditionalActionButton;

AdditionalActionButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  bold: PropTypes.bool,
};
