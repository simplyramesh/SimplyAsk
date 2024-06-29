import PropTypes from 'prop-types';
import React from 'react';
import { StyledSpinner, StyledSpinnerContainer } from '../styles/styled';

const Spinner = ({
  global,
  parent,
  inline,
  medium,
  small,
  fadeBgParent,
  roundedBg,
  globalFadeBgParent,
  fadeBgParentFixedPosition,
  extraSmall,
  // globalFadeBgParent - acts like global but with Faded BG
  // fadeBgParent - fade parent BG, absolute, centered- vertical + horizontal - choose parent
  // parent - absolute - centered- vertical + horizontal - choose parent
  // inline - relative - start - centered in the horizontal line
}) => {

  return (
    <StyledSpinnerContainer
      global={global}
      parent={parent}
      inline={inline}
      fadeBgParent={fadeBgParent}
      roundedBg={roundedBg}
      globalFadeBgParent={globalFadeBgParent}
      fadeBgParentFixedPosition={fadeBgParentFixedPosition}
    >
      <StyledSpinner medium={medium} small={small} extraSmall={extraSmall} />
    </StyledSpinnerContainer>
  );
};

export default Spinner;

Spinner.propTypes = {
  extraSmall: PropTypes.bool,
  global: PropTypes.bool,
  parent: PropTypes.bool,
  inline: PropTypes.bool,
  medium: PropTypes.bool,
  small: PropTypes.bool,
  fadeBgParent: PropTypes.bool,
  roundedBg: PropTypes.bool,
  globalFadeBgParent: PropTypes.bool,
  fadeBgParentFixedPosition: PropTypes.bool,
};
