import moment from 'moment';
import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../shared/styles/styled';

const TableCellTimeRange = ({
  startTime,
  endTime,
}) => {
  return (
    <StyledFlex textAlign="left" display="inline-block">
      <StyledText>{`${moment(startTime).format('ll')} - ${moment(startTime).format('LT')}`}</StyledText>
      <StyledText as="b" weight={600}>to</StyledText>
      <StyledText>{endTime ? `${moment(endTime).format('ll')} - ${moment(endTime).format('LT')}` : 'TBD'}</StyledText>
    </StyledFlex>
  );
};

export default TableCellTimeRange;

TableCellTimeRange.propTypes = {
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};
