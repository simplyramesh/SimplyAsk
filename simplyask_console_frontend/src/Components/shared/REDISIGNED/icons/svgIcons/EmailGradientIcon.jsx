/* eslint-disable max-len */
import SvgIcon from '@mui/material/SvgIcon';
import PropTypes from 'prop-types';

const EmailGradientIcon = ({ gradientProps, ...props }) => {
  const { gradientLightColor, gradientDarkColor } = gradientProps || {};

  return (
    <SvgIcon {...props}>
      <path fill="url(#emailGradient)" d="M21 16.762V7.238c0-.878-.709-1.587-1.587-1.587H4.588C3.71 5.651 3 6.361 3 7.24v9.523c0 .878.709 1.587 1.587 1.587h14.825c.878 0 1.587-.709 1.587-1.587zm-1.386-9.64c.349.35.159.71-.032.889l-4.296 3.936 4.127 4.297c.127.148.211.38.063.54-.137.169-.455.158-.592.052l-4.625-3.947-2.264 2.064-2.254-2.064-4.624 3.947c-.138.106-.455.117-.593-.053-.148-.159-.063-.391.064-.54l4.127-4.296-4.296-3.936c-.191-.18-.381-.54-.032-.889.349-.35.709-.18 1.005.074l6.603 5.333 6.614-5.333c.296-.254.656-.423 1.005-.074z" />
      <defs>
        <linearGradient id="emailGradient" x1="15" x2="30" y2="31.2" gradientTransform="matrix(.6 0 0 .6 3 5.651)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={gradientLightColor} />
          <stop offset="1" stopColor={gradientDarkColor} />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};

export default EmailGradientIcon;

EmailGradientIcon.defaultProps = {
  gradientProps: {
    gradientLightColor: '#F57B20',
    gradientDarkColor: '#FFA827',
  },
};

EmailGradientIcon.propTypes = {
  ...SvgIcon.propTypes,
  gradientProps: PropTypes.shape({
    gradientLightColor: PropTypes.string,
    gradientDarkColor: PropTypes.string,
  }),
};
