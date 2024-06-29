import PropTypes from 'prop-types';
import { StyledDefaultMenuContainer } from '../StyledSideMenuModule';

const DefaultMenu = ({ children }) => {
  return (
    <StyledDefaultMenuContainer>
      {children}
    </StyledDefaultMenuContainer>
  );
};

export default DefaultMenu;

DefaultMenu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};
