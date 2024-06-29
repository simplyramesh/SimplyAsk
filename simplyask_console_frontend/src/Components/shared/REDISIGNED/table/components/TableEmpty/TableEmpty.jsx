import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../../styles/styled';
import { StyledButton } from '../../../controls/Button/StyledButton';
import CustomTableIcons from '../../../icons/CustomTableIcons';

const TableEmpty = ({ title = 'No Records Found', message, action }) => {
  return (
    <StyledFlex gap="18px" flex="1" alignItems="center" justifyContent="center" mt="10vh" mb="10vh">
      <CustomTableIcons icon="EMPTY" width={88} />
      <StyledFlex width="390px" alignItems="center" justifyContent="center">
        { title && <StyledText as="h3" size={18} lh={22} weight={600} mb={9}>{title}</StyledText> }
        { message && (
          <StyledText
            as="p"
            size={16}
            weight={400}
            lh={21}
            textAlign="center"
            mb={6}
          >
            {message}
          </StyledText>
        )}
        { action && (
          <StyledButton variant="text" onClick={(event) => action.callback(event)}>
            { action.label }
          </StyledButton>
        ) }
      </StyledFlex>
    </StyledFlex>
  );
};

export default TableEmpty;

TableEmpty.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
  }),
};
