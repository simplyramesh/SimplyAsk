import PropTypes from 'prop-types';
import React from 'react';
import { RecoilRoot } from 'recoil';

const RecoilProvider = ({ children }) => {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );
};

RecoilProvider.propTypes = {
  children: PropTypes.node,
};

export default RecoilProvider;
