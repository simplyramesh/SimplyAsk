import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const TestRunInfo = ({ date, count, text }) => {
  const { colors } = useTheme();

  const humanizedDate = moment(date).format('MMMM D, YYYY - h:mm a');

  return (
    <StyledFlex
      direction="row"
      flex="1 1 auto"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor={colors.bgColorOptionTwo}
      borderRadius="10px"
      p="12px 18px"
    >
      <StyledText size={14} weight={500} wrap="nowrap">{text}</StyledText>
      <StyledText size={14} weight={600} wrap="nowrap">{count || humanizedDate}</StyledText>
    </StyledFlex>
  );
};

export default TestRunInfo;

TestRunInfo.propTypes = {
  date: PropTypes.string,
  count: PropTypes.number,
  text: PropTypes.string,
};
