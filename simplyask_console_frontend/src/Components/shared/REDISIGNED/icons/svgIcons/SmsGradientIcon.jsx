/* eslint-disable max-len */
import SvgIcon from '@mui/material/SvgIcon';
import PropTypes from 'prop-types';

const SmsGradientIcon = ({ gradientProps, ...props }) => {
  const { gradientLightColor, gradientDarkColor } = gradientProps || {};

  return (
    <SvgIcon {...props}>
      <path fill="url(#emailGradient)" d="M12 4.125c-4.971 0-9 3.273-9 7.313 0 1.743.752 3.34 2.004 4.594-.44 1.772-1.91 3.35-1.927 3.368a.28.28 0 0 0-.052.306.275.275 0 0 0 .256.169c2.331 0 4.078-1.118 4.943-1.807 1.15.432 2.426.682 3.776.682 4.971 0 9-3.273 9-7.312 0-4.04-4.029-7.313-9-7.313zm-4.493 9.563h-.429a.282.282 0 0 1-.281-.282v-.562c0-.155.126-.281.281-.281h.433c.21 0 .365-.124.365-.233 0-.045-.028-.094-.074-.133l-.77-.661a1.3 1.3 0 0 1-.467-.988c0-.749.668-1.357 1.49-1.357h.43c.154 0 .28.127.28.281v.563a.282.282 0 0 1-.28.281h-.433c-.211 0-.366.123-.366.232 0 .046.028.095.074.134l.77.66a1.3 1.3 0 0 1 .468.989c.003.748-.668 1.357-1.491 1.357zm6.743-.282a.282.282 0 0 1-.281.282h-.563a.282.282 0 0 1-.281-.282V11.01l-.872 1.961a.28.28 0 0 1-.503 0l-.875-1.961v2.397a.282.282 0 0 1-.281.282h-.563a.282.282 0 0 1-.281-.282V9.75c0-.31.253-.563.562-.563h.563a.56.56 0 0 1 .503.31L12 10.74l.622-1.244a.564.564 0 0 1 .503-.31h.562c.31 0 .563.254.563.563zm1.698.282h-.432a.282.282 0 0 1-.282-.282v-.562c0-.155.127-.281.282-.281h.432c.211 0 .366-.124.366-.233 0-.045-.028-.094-.074-.133l-.77-.661a1.3 1.3 0 0 1-.468-.988c0-.749.668-1.357 1.491-1.357h.429c.155 0 .281.127.281.281v.563a.282.282 0 0 1-.281.281h-.433c-.21 0-.365.123-.365.232 0 .046.028.095.074.134l.77.66a1.3 1.3 0 0 1 .467.989c.004.748-.664 1.357-1.487 1.357z" />
      <defs>
        <linearGradient id="emailGradient" x1="15" x2="22.05" y1="0" y2="32.55" gradientTransform="matrix(.6 0 0 .6 3 4.125)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={gradientLightColor} />
          <stop offset="1" stopColor={gradientDarkColor} />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};

export default SmsGradientIcon;

SmsGradientIcon.defaultProps = {
  gradientProps: {
    gradientLightColor: '#F57B20',
    gradientDarkColor: '#FFA827',
  },
};

SmsGradientIcon.propTypes = {
  ...SvgIcon.propTypes,
  gradientProps: PropTypes.shape({
    gradientLightColor: PropTypes.string,
    gradientDarkColor: PropTypes.string,
  }),
};
