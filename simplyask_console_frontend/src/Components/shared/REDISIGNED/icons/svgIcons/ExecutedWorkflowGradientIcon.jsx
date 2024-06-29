/* eslint-disable max-len */
import SvgIcon from '@mui/material/SvgIcon';
import PropTypes from 'prop-types';

const ExecutedWorkflowGradientIcon = ({ gradientProps, ...props }) => {
  const { gradientLightColor, gradientDarkColor } = gradientProps || {};

  return (
    <SvgIcon {...props}>
      <path fill="url(#executedWorkflowGradient)" d="M12.231 4.27c0-.702.569-1.27 1.27-1.27h3.46c.702 0 1.27.569 1.27 1.27v5.192h-1.385V4.385h-3.23V7.73A1.27 1.27 0 0 1 12.346 9H9v3.346c0 .702-.568 1.27-1.269 1.27H4.385v3.23h5.077v1.385H4.269A1.27 1.27 0 0 1 3 16.96V13.5c0-.702.569-1.27 1.27-1.27h3.346V8.886c0-.702.568-1.27 1.269-1.27h3.346zm2.77 7.384c0-.702.568-1.27 1.268-1.27h3.462c.701 0 1.27.57 1.27 1.27V18a3 3 0 0 1-3 3h-6.347a1.27 1.27 0 0 1-1.27-1.27v-3.46c0-.702.57-1.27 1.27-1.27H15z" />
      <defs>
        <linearGradient id="executedWorkflowGradient" x1="15" x2="30" y2="39" gradientTransform="matrix(.6 0 0 .6 3 3)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={gradientLightColor} />
          <stop offset="1" stopColor={gradientDarkColor} />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};

export default ExecutedWorkflowGradientIcon;

ExecutedWorkflowGradientIcon.defaultProps = {
  gradientProps: {
    gradientLightColor: '#F67C21',
    gradientDarkColor: '#FFA827',
  },
};

ExecutedWorkflowGradientIcon.propTypes = {
  ...SvgIcon.propTypes,
  gradientProps: PropTypes.shape({
    gradientLightColor: PropTypes.string,
    gradientDarkColor: PropTypes.string,
  }),
};
