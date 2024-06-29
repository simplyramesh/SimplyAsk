import PropTypes from 'prop-types';

import { StyledTimeline } from './StyledStatusTimeline';

const StatusTimeline = ({ children, ...props }) => {
  return (
    <StyledTimeline {...props}>
      {children}
    </StyledTimeline>
  );
};

export default StatusTimeline;

StatusTimeline.propTypes = {
  children: PropTypes.node,
};
