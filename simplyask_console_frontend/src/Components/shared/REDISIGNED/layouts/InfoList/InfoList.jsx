import PropTypes from 'prop-types';
import React from 'react';

import { StyledInfoList } from './StyledInfoList';

const InfoList = ({ children, ...rest }) => {
  return (
    <StyledInfoList {...rest}>{children}</StyledInfoList>
  );
};

InfoList.propTypes = {
  children: PropTypes.node,
};

export default InfoList;
