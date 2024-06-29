import PropTypes from 'prop-types';

import AccessManagementIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { StyledGeneralTabButton } from '../GeneralTab/StyledGeneralTab';

const HEADER_OPTIONS = {
  SUMMARY: {
    icon: 'PERM_SUMMARY',
    title: 'Permission Summary',
    subtitle: 'A snapshot of the user\'s current permissions',
    btnText: 'Manage Permissions',
  },
  PROFILE_GROUPS: {
    icon: 'PERM_GROUPS',
    title: 'Associated User Groups',
    subtitle: 'View all assigned User Groups',
    btnText: 'Manage User Groups',
  },
  GROUPS_USERS: {
    icon: 'PERM_USERS',
    title: 'Associated Users',
    subtitle: 'View Users assigned to this User Group',
    btnText: 'Manage Users',
  },
  PERM_USERS_PERM: {
    icon: 'PERM_USERS',
    title: 'Associated Users',
    subtitle: 'View Users the permission group is assigned to',
    btnText: 'Manage Users',
  },
  PERM_GROUPS: {
    icon: 'PERM_GROUPS',
    title: 'Associated User Groups',
    subtitle: 'View User Groups the permission group is assigned to',
    btnText: 'Manage User Groups',
  },
};

const CardGroupsHeader = ({ association, onManage }) => (
  <StyledFlex
    as="header"
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    mb="20px"
  >
    <StyledFlex>
      <StyledFlex direction="row" gap="14px">
        <AccessManagementIcons icon={HEADER_OPTIONS[association].icon} width={24} />
        <StyledText size={20} weight={600}>{HEADER_OPTIONS[association].title}</StyledText>
      </StyledFlex>
      <StyledText size={16} weight={400}>{HEADER_OPTIONS[association].subtitle}</StyledText>
    </StyledFlex>
    {onManage
    && <StyledGeneralTabButton onClick={onManage}>{HEADER_OPTIONS[association].btnText}</StyledGeneralTabButton>}
  </StyledFlex>
);

export default CardGroupsHeader;

CardGroupsHeader.defaultProps = {
  association: 'SUMMARY',
};

CardGroupsHeader.propTypes = {
  association: PropTypes.oneOf(['SUMMARY', 'PROFILE_GROUPS', 'GROUPS_USERS', 'PERM_USERS', 'PERM_GROUPS']),
  onManage: PropTypes.func,
};
