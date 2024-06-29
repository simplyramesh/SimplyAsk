import PropTypes from 'prop-types';

import { StyledPrimaryButton } from './StyledViewFiltersButton';

const ViewFiltersButton = ({ onClick }) => {
  return (
    <StyledPrimaryButton onClick={onClick} type="button">
      View All Filters
    </StyledPrimaryButton>
  );
};

export default ViewFiltersButton;

ViewFiltersButton.propTypes = {
  onClick: PropTypes.func,
};
