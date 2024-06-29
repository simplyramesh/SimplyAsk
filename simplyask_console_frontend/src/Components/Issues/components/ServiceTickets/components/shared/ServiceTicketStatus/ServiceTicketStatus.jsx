import { STATUSES_COLORS_OPTIONS } from '../../../../../../Settings/Components/FrontOffice/constants/iconConstants';
import { StyledStatus } from '../../../../../../shared/styles/styled';

const ServiceTicketStatus = ({
  width, minWidth = 'max-content', color, children, ...props
}) => {
  const statusColor = STATUSES_COLORS_OPTIONS[color];

  return (
    <StyledStatus
      textColor={statusColor?.primary}
      bgColor={statusColor?.secondary}
      width={width}
      minWidth={minWidth}
      {...props}
    >
      {children}
    </StyledStatus>
  );
};

export default ServiceTicketStatus;
