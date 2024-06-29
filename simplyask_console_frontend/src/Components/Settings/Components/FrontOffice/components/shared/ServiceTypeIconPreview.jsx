import { useTheme } from '@mui/material/styles';

import { StyledFlex } from '../../../../../shared/styles/styled';
import { serviceTypeIconColors, serviceTypeIconNames } from '../../constants/iconConstants';

import ServiceTicketTypeIcon from './ServiceTicketTypeIcon/ServiceTicketTypeIcon';
import { StyledIconWrapper } from './StyledServiceTicketTypes';

const ServiceTypeIconPreview = ({
  iconColour = serviceTypeIconColors[0],
  icon = serviceTypeIconNames[0],
  wrapperWidth = 40,
  wrapperHeight = 40,
  iconWidth = 20,
  iconHeight = 20,
}) => {
  const { iconColors } = useTheme();

  return (
    <StyledFlex
      width={`${wrapperWidth}px`}
      height={`${wrapperHeight}px`}
      alignItems="center"
      justifyContent="center"
      borderRadius="50%"
      bgcolor={iconColors?.[iconColour]?.bg}
      color={iconColors?.[iconColour]?.color}
    >
      <StyledIconWrapper iconWidth={`${iconWidth}px`} iconHeight={`${iconHeight}px`}>
        <ServiceTicketTypeIcon icon={icon} />
      </StyledIconWrapper>
    </StyledFlex>
  );
};

export default ServiceTypeIconPreview;
