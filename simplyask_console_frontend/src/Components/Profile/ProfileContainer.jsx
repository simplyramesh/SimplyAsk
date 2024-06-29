import { useNavigate } from 'react-router-dom';

import routes from '../../config/routes';
import { useUser } from '../../contexts/UserContext';
import { useGetCurrentUser } from '../../hooks/useGetCurrentUser';
import { useGetUserById } from '../../hooks/useUserById';
import { getUserGroupsWithFilters } from '../../Services/axios/permissionsUserGroups';
import CardGroupsHeader from '../Settings/AccessManagement/components/CardGroupsHeader/CardGroupsHeader';
import ManageUserGroupsTab from '../Settings/AccessManagement/components/ManageUserGroupsTab/ManageUserGroupsTab';
import ProfileTabSide from '../Settings/AccessManagement/components/ProfileTab/ProfileTabSide/ProfileTabSide';
import useTabNavigation from '../Settings/AccessManagement/hooks/useTabNavigation';
import NavTabs from '../shared/NavTabs/NavTabs';
import TabPanel from '../shared/NavTabs/TabPanel';
import CardGrid from '../shared/REDISIGNED/cardGrid/CardGrid';
import { StyledButton } from '../shared/REDISIGNED/controls/Button/StyledButton';
import ContentLayout from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import {
  StyledCard, StyledFlex, StyledText,
} from '../shared/styles/styled';

const NAV_TAB_LABELS = [
  { title: 'Profile' },
];

const ProfileContainer = () => {
  const navigate = useNavigate();
  const { currentUser } = useGetCurrentUser();

  const FIVE_MINUTES = 300000;

  const { userInfo: userData } = useGetUserById(currentUser?.id, {
    queryKey: ['getUser', currentUser?.id],
    enabled: !!currentUser?.id,
    staleTime: 0,
    gcTime: FIVE_MINUTES,
    placeholderData: currentUser ? { ...currentUser } : {},
  });

  const {
    tabIndex, onTabChange,
  } = useTabNavigation(NAV_TAB_LABELS);

  const INITIAL_USER_GROUPS_FILTERS = {
    sortOrder: 'modifiedDate',
    userIds: currentUser.id,
  };

  return (
    <PageLayout
      top={(
        <NavTabs
          onChange={onTabChange}
          value={tabIndex}
          labels={NAV_TAB_LABELS}
        />
      )}
    >
      <TabPanel value={tabIndex} index={0}>
        <ContentLayout side={<ProfileTabSide authUserId={currentUser.id} userData={userData} />}>
          <StyledFlex gap="36px">
            <StyledCard>
              <CardGroupsHeader association="PROFILE_GROUPS" />
              <CardGrid
                queryFn={getUserGroupsWithFilters}
                queryKey="getUserUserGroups"
                initFilters={INITIAL_USER_GROUPS_FILTERS}
                displayFn={(item) => item.name}
                tableName="User Groups"
                emptyText="You currently are not assigned to any user groups"
              />
            </StyledCard>

            <StyledCard>
              <StyledFlex px="4px" width="574px">
                <StyledText size={20} weight={600} mb={10}>Security</StyledText>
                <StyledText size={16} weight={600}>Password</StyledText>
                <StyledText size={16} weight={400} mb={10}>Update your current password</StyledText>
                <StyledFlex alignItems="flex-start">
                  <StyledButton variant="text" onClick={() => navigate(routes.PROFILE_CHANGE_PASSWORD)}>
                    Change Password
                  </StyledButton>
                </StyledFlex>
              </StyledFlex>
            </StyledCard>
          </StyledFlex>
        </ContentLayout>
      </TabPanel>
    </PageLayout>
  );
};

export default ProfileContainer;
