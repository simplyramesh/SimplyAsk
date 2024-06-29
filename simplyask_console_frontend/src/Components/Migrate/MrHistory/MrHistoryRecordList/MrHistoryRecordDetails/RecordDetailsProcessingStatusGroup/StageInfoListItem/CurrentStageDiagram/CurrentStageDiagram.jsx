import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { StyledDivider, StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import FatArrowUpIcon from '../../../../../FatArrowUpIcon/FatArrowUpIcon';
import { StyledAdornmentIcons } from './StyledStageDiagram';

const isFunction = (value) => typeof value === 'function';

const getValue = (value, arg) => (isFunction(value) ? value(arg) : value);

const CurrentStageDiagram = (props) => {
  const {
    positions = [],
    StepStartIcon = ArrowForwardRoundedIcon,
    StepEndIcon = DoneRoundedIcon,
    IndicatorIcon = FatArrowUpIcon,
  } = props;

  const { colors } = useTheme();

  return (
    <>
      <StyledFlex direction="row" mb="-15px">
        {positions.map((position) => (
          <StyledFlex key={position.title} rowGap="6px" alignItems="center" flex="1 1 auto">
            <StyledFlex
              key={position.title}
              borderRadius={getValue(position.borderRadius, position)}
              alignItems="center"
              width="100%"
              p="12px"
              bgcolor={getValue(position.bgColor, position)}
            >
              <StyledText
                size={13}
                weight={600}
                color={getValue(position.color, position)}
              >
                {position.title}
              </StyledText>
            </StyledFlex>
            <StyledFlex visibility={getValue(position.visibility, position)}>
              <StyledFlex as="span" color={colors.information}>
                <IndicatorIcon fontSize="17px" />
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        ))}
      </StyledFlex>
      <StyledFlex direction="row" alignItems="center">
        <StyledAdornmentIcons>
          <StepStartIcon />
        </StyledAdornmentIcons>
        <StyledFlex flex="1 1 auto">
          <StyledDivider borderWidth={2} />
        </StyledFlex>
        <StyledAdornmentIcons>
          <StepEndIcon />
        </StyledAdornmentIcons>
      </StyledFlex>
    </>
  );
};

export default CurrentStageDiagram;

CurrentStageDiagram.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    color: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    bgColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    visibility: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  })),
  StepStartIcon: PropTypes.elementType,
  StepEndIcon: PropTypes.elementType,
  IndicatorIcon: PropTypes.elementType,
};
