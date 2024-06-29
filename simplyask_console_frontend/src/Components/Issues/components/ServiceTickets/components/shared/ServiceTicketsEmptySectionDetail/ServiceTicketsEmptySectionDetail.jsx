import CustomTableIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const ServiceTicketsEmptySectionDetail = ({ title }) => (
  <StyledFlex
    p="20px"
    maxHeight="146px"
    gap="18px"
    flex="1"
    alignItems="center"
    justifyContent="center"
  >
    <CustomTableIcons icon="EMPTY" width={65} />
    <StyledText as="h3" size={16} lh={24} weight={600}>
      {title}
    </StyledText>
  </StyledFlex>
);

export default ServiceTicketsEmptySectionDetail;
