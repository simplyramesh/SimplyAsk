import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../styles/styled';
import CustomTableIcons from '../../icons/CustomTableIcons';

const NoResultsFound = ({
  title, message, width, children,
}) => {
  const renderMessage = () => (
    <>
      {!!message && (
        <StyledText
          as="p"
          size={16}
          weight={400}
          lh={21}
          textAlign="center"
        >
          {message}
        </StyledText>
      )}
    </>
  );

  return (
    <StyledFlex gap="18px" flex="1" alignItems="center" justifyContent="center" mt="10vh" mb="10vh">
      <CustomTableIcons icon="EMPTY" width={88} />
      <StyledFlex width={width || '100%'} alignItems="center" justifyContent="center">
        {title && <StyledText as="h3" size={18} weight={600} mb={10}>{title}</StyledText>}
        {children || renderMessage()}
      </StyledFlex>
    </StyledFlex>
  );
};

export default NoResultsFound;

NoResultsFound.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.node,
  width: PropTypes.string,
};
