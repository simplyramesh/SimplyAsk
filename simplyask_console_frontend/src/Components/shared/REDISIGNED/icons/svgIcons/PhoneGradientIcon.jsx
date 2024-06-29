/* eslint-disable max-len */
import SvgIcon from '@mui/material/SvgIcon';
import PropTypes from 'prop-types';

const PhoneGradientIcon = ({ gradientProps, ...props }) => {
  const { gradientLightColor, gradientDarkColor } = gradientProps || {};

  return (
    <SvgIcon {...props}>
      <path fill="url(#phoneGradient)" d="M16.563 13.364a1.012 1.012 0 0 0-1.405.043l-2.418 2.487c-.582-.111-1.752-.476-2.957-1.677-1.204-1.206-1.569-2.379-1.677-2.957l2.484-2.419a1.01 1.01 0 0 0 .044-1.405L6.9 3.331a1.01 1.01 0 0 0-1.405-.088l-2.193 1.88a1.01 1.01 0 0 0-.293.656c-.015.253-.304 6.236 4.336 10.878C11.393 20.704 16.463 21 17.859 21c.204 0 .33-.006.363-.008a.999.999 0 0 0 .654-.295l1.88-2.193a1.01 1.01 0 0 0-.087-1.406z" />
      <defs>
        <linearGradient id="phoneGradient" x1="15" x2="30.002" y2="39.603" gradientTransform="matrix(.6 0 0 .6 3 3)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={gradientLightColor} />
          <stop offset="1" stopColor={gradientDarkColor} />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};

export default PhoneGradientIcon;

PhoneGradientIcon.defaultProps = {
  gradientProps: {
    gradientLightColor: '#21A9F6',
    gradientDarkColor: '#305CFA',
  },
};

PhoneGradientIcon.propTypes = {
  ...SvgIcon.propTypes,
  gradientProps: PropTypes.shape({
    gradientLightColor: PropTypes.string,
    gradientDarkColor: PropTypes.string,
  }),
};
