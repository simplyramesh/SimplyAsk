import PropTypes from 'prop-types';
import React from 'react';

import RadioIcon from '../../../../../Assets/icons/radioOn.svg?component';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { StyledIconWrapper } from '../TestRuns.styled';

const FIRST_LINE_TEXT = {
  PASS: {
    bold: 'Passed',
    regular: '(Passed In All Environments)',
  },
  PARTIAL: {
    bold: 'Partially Passed',
    regular: '(Passed In 1+ Environment)',
  },
  FAILED: {
    bold: 'Failed',
    regular: '(Failed In All Environments)',
  },
};

const TestCaseTextStats = ({ dotColor, totalTestCases, numOfTestCases, passFailSelector }) => {
  return (
    <StyledFlex direction="row" gap="18px">
      <StyledIconWrapper alignItems="flex-start" justifyContent="flex-start" iconWidth={24} color={dotColor}>
        <RadioIcon />
      </StyledIconWrapper>
      <StyledFlex>
        <StyledFlex as="p" direction="row" gap="0 8px">
          <StyledText as="span" size={14} weight={600} lh={17}>
            {FIRST_LINE_TEXT[passFailSelector].bold}
          </StyledText>
          <StyledText as="span" size={14} weight={400} lh={17}>
            {FIRST_LINE_TEXT[passFailSelector].regular}
          </StyledText>
        </StyledFlex>
        <StyledText size={14}>{`${numOfTestCases} out of ${totalTestCases} Test Cases`}</StyledText>
      </StyledFlex>
    </StyledFlex>
  );
};

export default TestCaseTextStats;

TestCaseTextStats.propTypes = {
  dotColor: PropTypes.string,
  totalTestCases: PropTypes.number,
  numOfTestCases: PropTypes.number,
  passFailSelector: PropTypes.oneOf(Object.keys(FIRST_LINE_TEXT)),
};
