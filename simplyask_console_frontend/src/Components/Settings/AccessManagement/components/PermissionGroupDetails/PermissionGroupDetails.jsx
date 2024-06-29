import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import routes from '../../../../../config/routes';
import { editPermissionGroup, getPermissionGroup } from '../../../../../Services/axios/permissions';
import { modifiedCurrentPageDetails } from '../../../../../store';
import NavTabs from '../../../../shared/NavTabs/NavTabs';
import TabPanel from '../../../../shared/NavTabs/TabPanel';
import ContentLayout from '../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { useEntityCreateDelete } from '../../hooks/useGroupsCreateDelete';
import useTabNavigation from '../../hooks/useTabNavigation';
import PermissionGroupsForm from '../forms/PermissionGroupsForm';
import GeneralTabSide from '../GeneralTab/GeneralTabSide/GeneralTabSide';
import ManagePermissionsTab from '../ManagePermissionsTab/ManagePermissionsTab';
import ManageUserGroupsTab from '../ManageUserGroupsTab/ManageUserGroupsTab';
import ManageUsersTab from '../ManageUsersTab/ManageUsersTab';

import { PermissionGroupGeneralTab } from './PermissionGroupGeneralTab/PermissionGroupGeneralTab';

const NAV_TAB_LABELS = [
  { title: 'General' },
  { title: 'Manage Permissions' },
  { title: 'Manage Users' },
  { title: 'Manage User Groups' },
];

const PermissionGroupDetails = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { tabIndex, onTabChange, id: groupId } = useTabNavigation(NAV_TAB_LABELS);

  const [isOpened, setIsOpened] = useState(false);

  // const { id: groupId } = useParams();

  const { data: groupData } = useQuery({
    queryKey: ['getPermissionGroup', groupId],
    queryFn: () => getPermissionGroup(groupId),
    enabled: !!groupId,
  });

  useEffect(() => {
    if (groupData) {
      setCurrentPageDetailsState({
        pageUrlPath: routes.SETTINGS_ACCESS_MANAGER_PERMISSION_GROUP_DETAILS,
        breadCrumbLabel: groupData.name,
      });
    }
  }, [groupData]);

  const { editEntity } = useEntityCreateDelete({
    editFn: editPermissionGroup,
    invalidateQueryKey: 'getPermissionGroup',
    successEditMessage: ({ variables }) => `Permission group "${variables.body.name}" was successfully updated!`,
    onEditSuccess: () => setIsOpened(false),
  });

  useEffect(() => {
    if (groupData) {
      setCurrentPageDetailsState({
        pageUrlPath: routes.SETTINGS_ACCESS_MANAGER_PERMISSION_GROUP_DETAILS,
        breadCrumbLabel: groupData.name,
      });
    }
  }, [groupData]);

  const { name, description } = groupData || {};

  const handleEdit = async (formik) => {
    editEntity({ id: groupId, body: formik.values });
  };

  return groupData ? (
    <>
      <PageLayout top={<NavTabs onChange={onTabChange} value={tabIndex} labels={NAV_TAB_LABELS} />}>
        <TabPanel value={tabIndex} index={0}>
          <ContentLayout side={<GeneralTabSide onEdit={() => setIsOpened(true)} {...groupData} />}>
            <PermissionGroupGeneralTab
              onTabChange={onTabChange}
              userGroupIds={groupData?.userGroupIds}
              userIds={groupData?.userIds}
            />
          </ContentLayout>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <ContentLayout>
            <ManagePermissionsTab groupType="permissionGroup" />
          </ContentLayout>
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <ContentLayout>
            <ManageUsersTab groupType="permissionGroup" />
          </ContentLayout>
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <ContentLayout>
            <ManageUserGroupsTab currentView="permissionGroup" />
          </ContentLayout>
        </TabPanel>
      </PageLayout>
      <PermissionGroupsForm
        open={isOpened}
        onClose={() => setIsOpened(false)}
        onSubmit={handleEdit}
        initialValues={{ name, description }}
      />
    </>
  ) : null;
};

export default PermissionGroupDetails;
