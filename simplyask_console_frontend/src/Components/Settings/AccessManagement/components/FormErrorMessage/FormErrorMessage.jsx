import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import AccessManagementIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const FormErrorMessage = ({ size = 12, children }) => {
  const theme = useTheme();

  return (
    <StyledFlex direction="row" gap="4px" alignItems="flex-start" m="2px 0 0 0">
      <StyledFlex mt={0.25}>
        <AccessManagementIcons icon="ERROR" width={18} color={theme.colors.validationError} />
      </StyledFlex>
      <StyledText size={size} weight={500} color={theme.colors.validationError}>{children}</StyledText>
    </StyledFlex>
  );
};

export default FormErrorMessage;

FormErrorMessage.propTypes = {
  children: PropTypes.node,
};
