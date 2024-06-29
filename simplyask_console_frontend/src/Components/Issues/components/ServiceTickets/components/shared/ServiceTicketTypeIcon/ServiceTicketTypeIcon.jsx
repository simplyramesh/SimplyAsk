import ServiceTypeIconPreview from '../../../../../../Settings/Components/FrontOffice/components/shared/ServiceTypeIconPreview';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import { StyledIssueTypeIcon } from '../../../../../StyledIssues';

const ServiceTicketTypeIcon = ({ type, wrapperWidth = 40, wrapperHeight = 40, iconWidth = 20, iconHeight = 20 }) => {
  return (
    <StyledIssueTypeIcon>
      <StyledTooltip title={type?.name || 'Service Ticket'} arrow placement="top" p="10px 15px" maxWidth="auto">
        <StyledFlex>
          <ServiceTypeIconPreview
            icon={type?.icon}
            iconColour={type?.iconColour}
            wrapperWidth={wrapperWidth}
            wrapperHeight={wrapperHeight}
            iconWidth={iconWidth}
            iconHeight={iconHeight}
          />
        </StyledFlex>
      </StyledTooltip>
    </StyledIssueTypeIcon>
  );
};

export default ServiceTicketTypeIcon;
