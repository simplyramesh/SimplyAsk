import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../styles/styled';
import { StyledButton } from '../../controls/Button/StyledButton';
import CustomTableIcons from '../../icons/CustomTableIcons';

const EmptyTable = ({
  icon, title = 'Records', message, action, hideTitle, compact, customTitle
}) => (
  <StyledFlex gap="18px" flex="1" alignItems="center" justifyContent="center" mt={compact ? '24px' : '10vh'} mb={compact ? '24px' : '10vh'}>
    <CustomTableIcons icon={icon || 'EMPTY'} width={88} />
    <StyledFlex width="390px" alignItems="center" justifyContent="center">
      {(title && !hideTitle) && (
        <StyledText as="h3" size={18} lh={22} weight={600} mb={9}>
          {customTitle ?? `No ${title} Found`}
        </StyledText>
      )}
      {message && (
        <StyledText
          as={hideTitle ? 'h3' : 'p'}
          size={hideTitle ? 18 : 16}
          weight={hideTitle ? 600 : 400}
          lh={21}
          textAlign="center"
          mb={6}
        >
          {message}
        </StyledText>
      )}
      {action && (
        <StyledButton variant="text" onClick={(event) => action.callback(event)}>
          {action.label}
        </StyledButton>
      )}
    </StyledFlex>
  </StyledFlex>
);

export default EmptyTable;

EmptyTable.propTypes = {
  customTitle: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.string,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
  }),
};
