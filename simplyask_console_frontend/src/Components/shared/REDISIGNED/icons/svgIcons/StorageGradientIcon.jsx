/* eslint-disable max-len */
import SvgIcon from '@mui/material/SvgIcon';
import PropTypes from 'prop-types';

const StorageGradientIcon = ({ gradientProps, ...props }) => {
  const { gradientLightColor, gradientDarkColor } = gradientProps || {};

  return (
    <SvgIcon {...props}>
      <path
        fill="url(#storageGradient)"
        d="M12.9 9.3h4.95L12.9 4.35zM6.6 3h7.2l5.4 5.4v10.8a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8V4.8c0-.999.801-1.8 1.8-1.8zm8.712 11.7a3.383 3.383 0 0 0-6.3-.9A2.725 2.725 0 0 0 6.6 16.5a2.7 2.7 0 0 0 2.7 2.7h5.85a2.25 2.25 0 0 0 2.25-2.25c0-1.188-.927-2.151-2.088-2.25z"
      />
      <defs>
        <linearGradient
          id="storageGradient"
          x1="12"
          x2="21"
          y1="0"
          y2="35.4"
          gradientTransform="matrix(.6 0 0 .6 4.8 3)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={gradientLightColor} />
          <stop offset="1" stopColor={gradientDarkColor} />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};

export default StorageGradientIcon;

StorageGradientIcon.defaultProps = {
  gradientProps: {
    gradientLightColor: '#21A9F6',
    gradientDarkColor: '#305CFA',
  },
};

StorageGradientIcon.propTypes = {
  ...SvgIcon.propTypes,
  gradientProps: PropTypes.shape({
    gradientLightColor: PropTypes.string,
    gradientDarkColor: PropTypes.string,
  }),
};
