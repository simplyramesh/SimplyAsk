import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import routes from '../../../../../config/routes';
import { getUserGroupsWithFilters } from '../../../../../Services/axios/permissionsUserGroups';
import { modifiedCurrentPageDetails } from '../../../../../store';
import NavTabs from '../../../../shared/NavTabs/NavTabs';
import TabPanel from '../../../../shared/NavTabs/TabPanel';
import ContentLayout from '../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import useTabNavigation from '../../hooks/useTabNavigation';
import { constructUrlSearchString } from '../../utils/formatters';
import ManagePermissionsTab from '../ManagePermissionsTab/ManagePermissionsTab';
import ManageUsersTab from '../ManageUsersTab/ManageUsersTab';

import UserGroupGeneralTab from './UserGroupGeneralTab/UserGroupGeneralTab';

const NAVIGATION_LABELS = [
  { title: 'General' },
  { title: 'Manage Permissions' },
  { title: 'Manage Users' },
];

export const UserGroupTab = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { tabIndex, onTabChange, id: userGroupId } = useTabNavigation(NAVIGATION_LABELS);

  const userGroupIdUrl = constructUrlSearchString({ userGroupIds: [userGroupId] });

  const { data: userGroupData } = useQuery({
    queryKey: ['getUserGroups', userGroupIdUrl],
    queryFn: () => getUserGroupsWithFilters(userGroupIdUrl),
    enabled: !!userGroupId && !!userGroupIdUrl,
    select: (data) => data?.content[0],
  });

  useEffect(() => {
    if (userGroupData) {
      setCurrentPageDetailsState({
        pageUrlPath: routes.SETTINGS_USER_GROUPS_SINGLE_ITEM,
        breadCrumbLabel: userGroupData.name,
      });
    }
  }, [userGroupData]);

  return (
    <PageLayout
      top={(
        <NavTabs
          value={tabIndex}
          labels={NAVIGATION_LABELS}
          onChange={onTabChange}
        />
      )}
    >
      <TabPanel
        index={0}
        value={tabIndex}
      >
        <UserGroupGeneralTab
          userGroupId={userGroupId}
          tabChangeHandler={onTabChange}
          userGroupData={userGroupData}
        />
      </TabPanel>
      <TabPanel
        index={1}
        value={tabIndex}
      >
        <ManagePermissionsTab groupType="userGroup" />
      </TabPanel>
      <TabPanel
        index={2}
        value={tabIndex}
      >
        <ContentLayout>
          <ManageUsersTab groupType="userGroup" />
        </ContentLayout>
      </TabPanel>
    </PageLayout>
  );
};

export default UserGroupTab;
