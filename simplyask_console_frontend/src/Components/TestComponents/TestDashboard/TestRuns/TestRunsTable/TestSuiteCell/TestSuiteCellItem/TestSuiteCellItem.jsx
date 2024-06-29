import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const BOLD_TEXT = {
  NUM_OF_CASES: 'Number of Test Cases:',
  EXECUTED_AT: 'Executed At:',
  PASSED_ALL_ENV: 'Passed (All Env):',
};

const TestSuiteCellItem = ({
  statSelector, stat, percentage, percentageColor,
}) => {
  const showPercentage = percentage || percentage === 0;

  return (
    <StyledFlex as="p" direction="row" gap="0 8px">
      <StyledText as="span" weight={500} wrap="nowrap">{`${BOLD_TEXT[statSelector]}`}</StyledText>
      <StyledText as="span" weight={400} wrap="nowrap">{stat}</StyledText>
      {showPercentage && <StyledText as="span" weight={700} color={percentageColor}>{`(${percentage}%)`}</StyledText>}
    </StyledFlex>
  );
};

export default TestSuiteCellItem;

TestSuiteCellItem.propTypes = {
  statSelector: PropTypes.oneOf(Object.keys(BOLD_TEXT)).isRequired,
  stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  percentageColor: PropTypes.string,
};
