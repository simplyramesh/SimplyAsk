import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import AccessManagementIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const STATUS_TEXT = {
  DEACTIVATED: 'Deactivated',
  ACTIVATED: 'Activated',
};

const StatusBadge = ({ icon, align, ...props }) => {
  const { colors } = useTheme();

  const status = icon || props.getValue();

  const statusTextColor = {
    DEACTIVATED: colors.primary,
    ACTIVATED: colors.statusResolved,
  };

  const statusBgColor = {
    DEACTIVATED: colors.statusDeactivatedBg,
    ACTIVATED: colors.statusResolvedBackground,
  };

  return (
    <StyledFlex
      as="p"
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap="6px"
      p="8px 0px"
      bgcolor={statusBgColor[status]}
      borderRadius="10px"
      m="0 auto"
      minWidth="136px"
      maxWidth="136px"
      {...align}
    >
      <AccessManagementIcons icon={status} width={16} color={statusTextColor[status]} />
      <StyledText
        as="span"
        size={12}
        weight={600}
        color={statusTextColor[status]}
      >
        {STATUS_TEXT[status]}
      </StyledText>
    </StyledFlex>
  );
};

export default StatusBadge;

StatusBadge.propTypes = {
  icon: PropTypes.oneOf(Object.keys(STATUS_TEXT)),
  getValue: PropTypes.func,
  align: PropTypes.object,
};
