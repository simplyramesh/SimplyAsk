import StandingPeopleIcon from '../../shared/REDISIGNED/icons/StandingPeopleIcon';
import { StyledFlex, StyledText } from '../../shared/styles/styled';

const FormNotFound = ({ accentColour }) => (
  <StyledFlex
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    position="relative"
    height="100%"
  >
    <StyledFlex as="span" mb="63px" fontSize="450px">
      <StandingPeopleIcon fontSize="inherit" accentColour={accentColour} />
    </StyledFlex>
    <StyledFlex display="flex" justifyContent="center" alignItems="center" gap="17px" width="456px">
      <StyledText size={24} weight={700} lh={36} textAlign="center">
        404 - Form Not Found
      </StyledText>
      <StyledText size={19} weight={400} lh={28.5} textAlign="center">
        This form does not exist or has been disabled by the form owner. Please check your URL to make sure it has been
        entered correctly.
      </StyledText>
    </StyledFlex>
  </StyledFlex>
);

export default FormNotFound;
