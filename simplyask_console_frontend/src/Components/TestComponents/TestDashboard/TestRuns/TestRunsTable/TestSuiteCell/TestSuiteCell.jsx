import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import PropTypes from 'prop-types';

import HoverOpenIcon from '../../../../../../Assets/icons/open_boxWithArrow.svg?component';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { StyledIconWrapper } from '../../TestRuns.styled';
import { TEST_RUN_COLUMN_KEYS } from '../../utils/helpers';
import TestSuiteCellItem from './TestSuiteCellItem/TestSuiteCellItem';

const TestSuiteCell = ({ cell }) => {
  const { colors } = useTheme();

  const cellValues = cell.getValue();

  const passPercentage =
    Math.round(
      (cellValues[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_PASSED] /
        cellValues[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_TOTAL]) *
        100
    ) || 0;

  const percentageColor = (percentage) => {
    switch (percentage) {
      case 100:
        return colors.statusResolved;
      case 0:
        return colors.validationError;
      default:
        return colors.statusAssigned;
    }
  };

  return (
    <>
      {Object.values(cellValues) && (
        <StyledFlex>
          <StyledText weight={600} mb={18}>
            {cellValues[TEST_RUN_COLUMN_KEYS.TEST_SUITE_NAME]}
          </StyledText>
          <StyledFlex gap="16px 0px">
            <TestSuiteCellItem
              stat={cellValues[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_TOTAL]}
              statSelector="NUM_OF_CASES"
            />
            <TestSuiteCellItem
              statSelector="EXECUTED_AT"
              stat={moment(cellValues[TEST_RUN_COLUMN_KEYS.TEST_SUITE_EXECUTED_AT]).format('MMM D, YYYY - h:mm a')}
            />
            <TestSuiteCellItem
              statSelector="PASSED_ALL_ENV"
              stat={`${cellValues[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_PASSED]} / ${cellValues[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_TOTAL]} Cases`}
              percentage={passPercentage}
              percentageColor={percentageColor(passPercentage)}
            />
          </StyledFlex>
          <StyledIconWrapper
            as="span"
            position="absolute"
            top={0}
            right={0}
            mt="8px"
            mr="8px"
            iconWidth={18}
            color={colors.linkColor}
            cursor="pointer"
            zIndex={2}
          >
            <HoverOpenIcon />
          </StyledIconWrapper>
        </StyledFlex>
      )}
    </>
  );
};

export default TestSuiteCell;

TestSuiteCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func,
  }),
};
