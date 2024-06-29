import AccessManagementIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledAvatarLockBadge } from './StyledAvatarLockBadge';

const AvatarLockBadge = () => {
  return (
    <StyledAvatarLockBadge>
      <AccessManagementIcons icon="DEACTIVATED" width={28} />
    </StyledAvatarLockBadge>
  );
};

export default AvatarLockBadge;
