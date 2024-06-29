import NavTabs from '../../shared/NavTabs/NavTabs';
import TabPanel from '../../shared/NavTabs/TabPanel';
import ContentLayout from '../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import useTabNavigation from './hooks/useTabNavigation';
import APIKeysView from './views/APIKeys/APIKeysView';
import PermissionGroupsView from './views/PermissionGroups/PermissionGroupsView';
import UserGroupsView from './views/UserGroups/UserGroupsView';
import UsersView from './views/Users/UsersView';

const NAVIGATION_LABELS = [
  { title: 'Users' },
  { title: 'User Groups' },
  { title: 'Permission Groups' },
  { title: 'API Keys' },
];

const AccessManagement = () => {
  const { tabIndex, onTabChange } = useTabNavigation(NAVIGATION_LABELS);

  return (
    <PageLayout
      top={(
        <NavTabs
          onChange={onTabChange}
          value={tabIndex}
          labels={NAVIGATION_LABELS}
        />
      )}
    >
      <TabPanel value={tabIndex} index={0}>
        <ContentLayout>
          <UsersView />
        </ContentLayout>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <ContentLayout>
          <UserGroupsView />
        </ContentLayout>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ContentLayout>
          <PermissionGroupsView />
        </ContentLayout>
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <ContentLayout>
          <APIKeysView />
        </ContentLayout>
      </TabPanel>
    </PageLayout>
  );
};

export default AccessManagement;
