import { useTheme } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import Scrollbars from 'react-custom-scrollbars-2';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import routes from '../../../../../../config/routes';
import { usePopoverToggle } from '../../../../../../hooks/usePopoverToggle';
import { GET_USER_BY_ID } from '../../../../../../hooks/useUserById';
import useUserPfp from '../../../../../../hooks/useUserPfp';
import { patchEditUser } from '../../../../../../Services/axios/permissionsUsers';
import { getNameInitials } from '../../../../../../utils/helperFunctions';
import AccessManagementIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { USER_FIND_BY_ID_RESPONSE } from '../../../constants/apiConstants';
import { formatDateMonthDayYear, textColor } from '../../../utils/formatters';
import AvatarLockBadge from '../../Avatar/AvatarLockBadge/AvatarLockBadge';
import StyledAvatar from '../../Avatar/StyledAvatar';
import {
  StyledProfileAvatarBadge,
  StyledProfileTabButton,
  StyledProfileTabSide,
  StyledProfileTabSideHeader,
} from '../StyledProfileTab';
import ProfileTabActionMenu from './ProfileTabActionMenu/ProfileTabActionMenu';

const userLocation = (userData) => {
  const city = userData?.[USER_FIND_BY_ID_RESPONSE.CITY];
  const province =
    userData?.[USER_FIND_BY_ID_RESPONSE.BILLING_PROVINCE]?.[USER_FIND_BY_ID_RESPONSE.BILLING_PROVINCE_NAME];
  const country = userData?.[USER_FIND_BY_ID_RESPONSE.BILLING_COUNTRY]?.[USER_FIND_BY_ID_RESPONSE.BILLING_COUNTRY_NAME];

  if (!city && !province && !country) return undefined;

  const location = [city, province, country].filter((i) => i).join(', ');

  return location;
};

const ProfileTabSide = ({ authUserId, userData, invalidateQuery }) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [profileImg] = useUserPfp(userData?.[USER_FIND_BY_ID_RESPONSE.PFP]);

  const { open, anchorEl, handleClick, handleClose } = usePopoverToggle('profile-user-active-toggle');

  const togglePopover = (b, e) => {
    if (b) return b ? handleClick(e) : handleClose(e);

    return open ? handleClose(e) : handleClick(e);
  };

  const createdAt = userData?.[USER_FIND_BY_ID_RESPONSE.CREATED]
    ? formatDateMonthDayYear(userData?.[USER_FIND_BY_ID_RESPONSE.CREATED])
    : null;
  const modifiedAt = userData?.[USER_FIND_BY_ID_RESPONSE.MODIFIED]
    ? formatDateMonthDayYear(userData?.[USER_FIND_BY_ID_RESPONSE.MODIFIED])
    : null;

  // TODO: This function is almost the exact same as in UserView
  const onChangeUserStatus = async (id, payload) => {
    try {
      await patchEditUser(id, payload);

      toast.success(`${userData?.[USER_FIND_BY_ID_RESPONSE.FIRST_NAME]}'s status updated`);
    } catch (error) {
      toast.error(`Error updating ${userData?.[USER_FIND_BY_ID_RESPONSE.FIRST_NAME]}'s status`);
    } finally {
      const qKey = invalidateQuery || [GET_USER_BY_ID];
      queryClient.invalidateQueries({ queryKey: [qKey] });

      togglePopover(false);
    }
  };

  const handleEdit = () => {
    navigate(userId ? `${routes.SETTINGS_ACCESS_MANAGER_USERS}/${userId}/edit` : routes.PROFILE_EDIT);
  };

  const handleChangePassword = () => {
    navigate(
      userId ? `${routes.SETTINGS_ACCESS_MANAGER_USERS}/${userId}/changePassword` : routes.PROFILE_CHANGE_PASSWORD
    );
  };

  const changePhoneFormat = (value) => {
    if (!value || value.length !== 10) {
      return;
    }

    const phoneNumber = value.replace(/\D/g, '');

    const match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (!match || match.length !== 4) {
      return value;
    }

    return `(${match[1]})-${match[2]}-${match[3]}`;
  };

  return (
    <StyledProfileTabSide>
      <Scrollbars>
        <StyledProfileTabSideHeader>
          {/* left */}
          <StyledFlex width="100%" direction="row" gap="60px" alignItems="flex-start" justifyContent="space-between">
            <StyledFlex width="35%">
              <StyledProfileAvatarBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={userData?.[USER_FIND_BY_ID_RESPONSE.IS_LOCKED] && <AvatarLockBadge />}
              >
                <StyledAvatar
                  size={112}
                  src={profileImg}
                  alt={`${userData?.[USER_FIND_BY_ID_RESPONSE.FIRST_NAME]} ${userData?.[USER_FIND_BY_ID_RESPONSE.LAST_NAME]}`}
                >
                  {getNameInitials({
                    firstName: userData?.[USER_FIND_BY_ID_RESPONSE.FIRST_NAME],
                    lastName: userData?.[USER_FIND_BY_ID_RESPONSE.LAST_NAME],
                  })}
                </StyledAvatar>
              </StyledProfileAvatarBadge>
            </StyledFlex>
            {/* right */}
            <StyledFlex direction="row" alignItems="center" justifyContent="flex-end" gap="14px" width="65%">
              <StyledProfileTabButton onClick={handleEdit}>
                <AccessManagementIcons icon="EDIT" width={24} />
                Edit Profile
              </StyledProfileTabButton>
              {!authUserId && (
                <>
                  <AccessManagementIcons
                    icon="MORE_VERT"
                    width={28}
                    onClick={(e) => togglePopover(true, e)}
                    ref={anchorEl}
                  />

                  {anchorEl && (
                    <ProfileTabActionMenu
                      anchorRef={anchorEl}
                      open={open}
                      isLocked={userData?.[USER_FIND_BY_ID_RESPONSE.IS_LOCKED]}
                      onClose={(e) => togglePopover(false, e)}
                      onPassword={handleChangePassword}
                      onActivate={() =>
                        onChangeUserStatus(userData?.id, { isLocked: !userData?.[USER_FIND_BY_ID_RESPONSE.IS_LOCKED] })
                      }
                    />
                  )}
                </>
              )}
            </StyledFlex>
          </StyledFlex>
          {/* user name */}
          <StyledText as="h3" size={24} weight={700}>
            {`${userData?.[USER_FIND_BY_ID_RESPONSE.FIRST_NAME]} ${userData?.[USER_FIND_BY_ID_RESPONSE.LAST_NAME]}`}
          </StyledText>
        </StyledProfileTabSideHeader>
        {/* content section 1 */}
        <StyledFlex p="0 38px" mb="14px">
          <StyledText as="h3" size={20} weight={600} mb={22}>
            About
          </StyledText>
          <StyledFlex direction="row" gap="14px" mb="24px">
            <AccessManagementIcons icon="BUILDING" width={20} />
            <StyledText
              size={16}
              weight={400}
              cursor="inherit"
              color={textColor(userData?.[USER_FIND_BY_ID_RESPONSE.COMPANY_NAME], colors)}
            >
              {userData?.[USER_FIND_BY_ID_RESPONSE.COMPANY_NAME] || 'Company Name'}
            </StyledText>
          </StyledFlex>
          <StyledFlex direction="row" gap="14px" mb="24px">
            <AccessManagementIcons icon="LOCATION" width={20} />
            <StyledText size={16} weight={400} cursor="inherit" color={textColor(userLocation(userData), colors)}>
              {userLocation(userData) || 'Location'}
            </StyledText>
          </StyledFlex>
          <StyledFlex direction="row" gap="14px" mb="24px">
            <AccessManagementIcons icon="CLOCK" width={20} />
            <StyledText size={16} weight={400} cursor="inherit">
              {userData?.[USER_FIND_BY_ID_RESPONSE.TIMEZONE]}
            </StyledText>
          </StyledFlex>
        </StyledFlex>
        {/* content section 2 */}
        <StyledFlex p="0 38px">
          <StyledText as="h3" size={20} weight={600} mb={22}>
            Contact Information
          </StyledText>
          <StyledFlex direction="row" gap="14px" mb="24px">
            <AccessManagementIcons icon="EMAIL" width={20} />
            <StyledText size={16} weight={400} cursor="inherit">
              {userData?.[USER_FIND_BY_ID_RESPONSE.EMAIL]}
            </StyledText>
          </StyledFlex>
          <StyledFlex direction="row" gap="14px" mb="24px">
            <AccessManagementIcons icon="PHONE" width={20} />
            <StyledText
              size={16}
              weight={400}
              cursor="inherit"
              color={textColor(userData?.[USER_FIND_BY_ID_RESPONSE.PHONE], colors)}
            >
              {changePhoneFormat(userData?.[USER_FIND_BY_ID_RESPONSE.PHONE]) || 'Phone Number'}
            </StyledText>
          </StyledFlex>
        </StyledFlex>
        {/* content section 3 */}
        <StyledFlex p="0 38px">
          <StyledText as="h3" size={20} weight={600} mb={22}>
            Activity
          </StyledText>
          <StyledFlex direction="row" gap="14px" mb="24px">
            <AccessManagementIcons icon="CALENDAR_CREATED" width={20} />
            <StyledText size={16} weight={600} cursor="inherit">
              Date Added:&nbsp;
              <StyledText as="span" display="inline" size={16} weight={400} cursor="inherit">
                {createdAt}
              </StyledText>
            </StyledText>
          </StyledFlex>
          <StyledFlex direction="row" gap="14px" mb="24px">
            <AccessManagementIcons icon="EDIT_PENCIL" width={20} />
            <StyledText size={16} weight={600} cursor="inherit">
              Last Modified:&nbsp;
              <StyledText as="span" display="inline" size={16} weight={400} cursor="inherit">
                {modifiedAt}
              </StyledText>
            </StyledText>
          </StyledFlex>
        </StyledFlex>
      </Scrollbars>
    </StyledProfileTabSide>
  );
};

export default ProfileTabSide;

