import { InfoOutlined } from '@mui/icons-material';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import { FALLOUT_TICKET_STATUS_TOOLTIPS, STATUS_CONSTANTS } from '../../../../constants/constants';

const FalloutTicketStatusOptions = ({ label }) => {
  const renderEndIcon = () => (
    <StyledTooltip
      title={
        label === STATUS_CONSTANTS.UNRESOLVED
          ? FALLOUT_TICKET_STATUS_TOOLTIPS[STATUS_CONSTANTS.FORCE_RESOLVED]
          : FALLOUT_TICKET_STATUS_TOOLTIPS[STATUS_CONSTANTS.UNRESOLVED]
      }
      arrow
      placement="bottom"
      p="10px 15px"
      maxWidth="450px"
    >
      <InfoOutlined sx={{ marginLeft: '6px' }} />
    </StyledTooltip>
  );

  return (
    <StyledFlex direction="row" alignItems="center" gap="6px" cursor="pointer">
      <StyledText as="p" lh={20} wrap="nowrap">
        Set ticket to
        <StyledText display="inline" lh={20} weight={700}>
          {' '}
          {label}
        </StyledText>
      </StyledText>

      {renderEndIcon()}
    </StyledFlex>
  );
};

export default FalloutTicketStatusOptions;
