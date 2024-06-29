import PropTypes from 'prop-types';
import { useRef } from 'react';

import { StyledText } from '../../../../../shared/styles/styled';
import { StyledTestCasesTooltip, StyledTruncateTextWrapper } from '../../TestRuns.styled';

const TestCasesCell = ({ cell }) => {
  const testCaseCellRef = useRef(null);

  const isTruncated = testCaseCellRef?.current?.offsetHeight < testCaseCellRef?.current?.scrollHeight;

  return (
    <>
      <StyledTestCasesTooltip
        title={(<StyledText>{cell.getValue()}</StyledText>)}
        arrow
        placement="top"
        disableHoverListener={!isTruncated}
        disableFocusListener={!isTruncated}
        disableInteractive
      >
        <StyledTruncateTextWrapper
          maxHeight="48px"
          maxLines={2}
        >
          <StyledText lh={22.4} ref={testCaseCellRef}>{cell.getValue()}</StyledText>
        </StyledTruncateTextWrapper>
      </StyledTestCasesTooltip>
    </>
  );
};

export default TestCasesCell;

TestCasesCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func,
  }),
};
