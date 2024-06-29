/* eslint-disable max-len */
import SvgIcon from '@mui/material/SvgIcon';
import PropTypes from 'prop-types';

const UserGradientIcon = ({ gradientProps, ...props }) => {
  const { gradientLightColor, gradientDarkColor } = gradientProps || {};

  return (
    <SvgIcon {...props}>
      <path fill="url(#userGradientA)" d="M12 13.001a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
      <path fill="url(#userGradientB)" d="M12 12.999a8 8 0 0 0-7.799 6.216C3.979 20.184 4.805 21 5.8 21h12.4c.995 0 1.82-.816 1.599-1.785A8.001 8.001 0 0 0 12 12.999z" />
      <defs>
        <linearGradient id="userGradientA" x1="13.333" x2="13.333" y1=".333" y2="17" gradientTransform="matrix(.6 0 0 .6 4 2.8)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={gradientLightColor} />
          <stop offset="1" stopColor={gradientDarkColor} />
        </linearGradient>
        <linearGradient id="userGradientB" x1="13.333" x2="13.333" y1="16.997" y2="30.331" gradientTransform="matrix(.6 0 0 .6 4 2.8)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={gradientLightColor} />
          <stop offset="1" stopColor={gradientDarkColor} />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};

UserGradientIcon.defaultProps = {
  gradientProps: {
    gradientLightColor: '#21A9F6',
    gradientDarkColor: '#305CFA',
  },
};

UserGradientIcon.propTypes = {
  ...SvgIcon.propTypes,
  gradientProps: PropTypes.shape({
    gradientLightColor: PropTypes.string,
    gradientDarkColor: PropTypes.string,
  }),
};

export default UserGradientIcon;
