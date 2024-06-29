import PropTypes from 'prop-types';

import InfoListGroup from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import StatusTimeline from '../../../../../shared/REDISIGNED/layouts/StatusTimeline/StatusTimeline';
import { StyledFlex } from '../../../../../shared/styles/styled';

const RecordDetailsLogGroup = ({ children }) => {
  return (
    <InfoListGroup title="Record Log">
      <StatusTimeline>
        <StyledFlex mt="45px">
          {children}
        </StyledFlex>
      </StatusTimeline>
    </InfoListGroup>
  );
};

export default RecordDetailsLogGroup;

RecordDetailsLogGroup.propTypes = {
  children: PropTypes.node,
};
