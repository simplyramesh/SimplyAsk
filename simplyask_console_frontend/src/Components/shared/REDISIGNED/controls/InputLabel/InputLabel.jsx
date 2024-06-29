import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';


import { StyledFlex, StyledText } from '../../../styles/styled';
import { StyledTooltip } from '../../tooltip/StyledTooltip';
import { InfoOutlined } from '@mui/icons-material';

const InputLabel = ({ id, name, label, hint, isOptional, isRecommended, children, size, lh, weight, mb, tooltipSize, ...rest }) => {
  const { colors } = useTheme();

  return (
    <StyledText
      as="label"
      size={size || 14}
      lh={lh || 'inherit'}
      weight={weight || 600}
      mb={mb ?? 8}
      htmlFor={id || name}
      {...rest}
    >
      {label}
      {hint && (
        <StyledTooltip title={hint} arrow placement="top" p="10px 15px" maxWidth="auto">
          <StyledFlex
            display="inline-block"
            ml={0.5}
            position="relative"
            top="6px"
            color={colors.disabledBtnText}
            cursor="pointer"
          >
            <InfoOutlined fontSize={tooltipSize || 'small'} />
          </StyledFlex>
        </StyledTooltip>
      )}
      {isOptional && (
        <StyledText as="span" display="inline" size={14} color={colors.optional}>
          {' (Optional)'}
        </StyledText>
      )}
      {isRecommended && (
        <StyledText as="span" display="inline" size={14} color={colors.optional}>
          {' (Recommended)'}
        </StyledText>
      )}
      {children}
    </StyledText>
  );
};

export default InputLabel;

InputLabel.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.number,
  lh: PropTypes.number,
  mb: PropTypes.number,
  isOptional: PropTypes.bool,
  children: PropTypes.node,
};
