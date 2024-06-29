import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import PassIcon from '../../../../../../Assets/icons/checkMark.svg?component';
import FailIcon from '../../../../../../Assets/icons/closeIcon.svg?component';
import HoverOpenIcon from '../../../../../../Assets/icons/open_boxWithArrow.svg?component';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { StyledIconWrapper } from '../../TestRuns.styled';

const EnvironmentCell = ({ cell }) => {
  const { colors } = useTheme();

  const cellValue = cell.getValue();

  const isPass = cellValue === 'PASS';
  const isFail = cellValue === 'FAIL';
  const isNotPassOrFail = !isPass && !isFail;

  return (
    <>
      <StyledFlex alignItems="center" justifyContent="center">
        {!isNotPassOrFail && (
          <StyledIconWrapper
            iconWidth={17}
            color={colors.white}
            borderRadius="50%"
            backgroundColor={isPass ? colors.statusResolved : colors.validationError}
            p="4px"
          >
            {isPass && <PassIcon />}
            {isFail && <FailIcon />}
          </StyledIconWrapper>
        )}
        {isNotPassOrFail && <StyledText color={colors.tableNoCellValue}>n/a</StyledText>}
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
    </>
  );
};

export default EnvironmentCell;

EnvironmentCell.propTypes = {
  cell: PropTypes.object,
};
