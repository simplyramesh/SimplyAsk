import { StyledFlex, StyledText } from '../../../styles/styled';
import CustomTableIcons from '../../icons/CustomTableIcons';

const NoOptionsMessage = () => (
  <StyledFlex height="240px" alignItems="center" justifyContent="center">
    <CustomTableIcons icon="EMPTY" width={88} />
    <StyledText weight={600}>No Results Found</StyledText>
  </StyledFlex>
);

export default NoOptionsMessage;
