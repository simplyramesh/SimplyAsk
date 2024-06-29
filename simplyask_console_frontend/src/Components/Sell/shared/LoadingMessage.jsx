import Spinner from '../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../shared/styles/styled';

const LoadingMessage = () => (
  <StyledFlex height="240px" alignItems="center" justifyContent="center" p="24px 0">
    <Spinner small />
    <StyledText mt={2}>Loading Results</StyledText>
  </StyledFlex>
);

export default LoadingMessage;
