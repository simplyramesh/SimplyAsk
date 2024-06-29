import PropTypes from 'prop-types';
import React from 'react';

import { StyledPageLayout, StyledPageMain, StyledPageTop, StyledPageWrapper } from './StyledPageLayout';

const PageLayout = ({ top, fullPage, width, children }) => {
  return (
    <StyledPageLayout fullPage={fullPage} width={width}>
      {top && <StyledPageTop>{top}</StyledPageTop>}
      <StyledPageWrapper>
        <StyledPageMain>{children}</StyledPageMain>
      </StyledPageWrapper>
    </StyledPageLayout>
  );
};

PageLayout.propTypes = {
  top: PropTypes.element,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default PageLayout;
