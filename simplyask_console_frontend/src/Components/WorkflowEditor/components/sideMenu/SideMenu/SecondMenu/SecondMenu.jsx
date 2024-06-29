import PropTypes from 'prop-types';

import ChevronLeftIcon from '../../../../Assets/Icons/chevronLeft.svg?component';
import { StyledSecondMenuContainer, StyledSecondMenuWrapper, StyledToggleIconWrapper, StyledToggleWrapper } from '../StyledSideMenuModule';

const SecondMenu = ({ menuState, onClick, children }) => {
  return (
    <StyledSecondMenuContainer isSecondMenuOpen={menuState.isSecondMenuOpen}>
      <StyledToggleWrapper isDefaultMenuOpen={menuState.isDefaultMenuOpen} onClick={onClick}>
        <StyledToggleIconWrapper isDefaultMenuOpen={menuState.isDefaultMenuOpen}>
          <ChevronLeftIcon />
        </StyledToggleIconWrapper>
      </StyledToggleWrapper>
      <StyledSecondMenuWrapper>{children}</StyledSecondMenuWrapper>
    </StyledSecondMenuContainer>
  );
};

export default SecondMenu;

SecondMenu.propTypes = {
  menuState: PropTypes.shape({
    isDefaultMenuOpen: PropTypes.bool,
    isSecondMenuOpen: PropTypes.bool,
  }),
  onClick: PropTypes.func,
  children: PropTypes.node,
};
