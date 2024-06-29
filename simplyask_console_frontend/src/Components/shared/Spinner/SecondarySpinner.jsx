import React from 'react';
import { CircularProgress, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const SecondarySpinner = ({ size }) => {
  const theme = useTheme();

  return (
    <>
      <CircularProgress
        variant="determinate"
        sx={{
          color: theme.colors.iconBgOrange,
          zIndex: 1,
        }}
        size={size}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: theme.colors.secondary,
          position: 'absolute',
          zIndex: 2,
        }}
        size={size}
        thickness={4}
        value={25}
      />
    </>
  );
};

SecondarySpinner.propTypes = {
  size: PropTypes.number,
};

export default SecondarySpinner;
