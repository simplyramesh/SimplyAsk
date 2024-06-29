import { VisibilityOutlined } from '@mui/icons-material';

import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const HiddenValue = ({ showIcon = true, showToolTip = true }) => {
  return (
    <StyledTooltip
      title={showToolTip ? 'Click on the field to appear' : ''}
      arrow
      placement="top"
      p="10px 15px"
      maxWidth="auto"
    >
      <StyledFlex gap="10px" direction="row" display="flex">
        <StyledFlex mt="4px">
          <StyledText>********</StyledText>
        </StyledFlex>

        {showIcon && (
          <StyledFlex as="span">
            <VisibilityOutlined />
          </StyledFlex>
        )}
      </StyledFlex>
    </StyledTooltip>
  );
};

export default HiddenValue;
