import React from 'react';

import SettingsPagePermissions from '../../../../Assets/icons/SettingsPagePermissions.svg?component';
import SettingsUserAccounts from '../../../../Assets/icons/SettingsUserAccounts.svg?component';
import SettingsUserGroup from '../../../../Assets/icons/SettingsUserGroup.svg?component';
import SettingsRouteRow, { SETTINGS_ROUTES_KEYS } from '../../../shared/Settings/SettingsRouteRow/SettingsRouteRow';
import AgentGroupsTab from '../../Components/AgentGroupsTab/AgentGroupsTab';
// import AgentSkillsTab from '../../Components/AgentSkillsTab/AgentSkillsTab';
import PagePermissionsTab from '../../Components/PagePermissionsTab/PagePermissionsTab';
import UserManagementTab from '../../Components/UserManagementTab/UserManagementTab';

const UsersRoutesData = [
  {
    title: 'User Accounts',
    body: 'Manage user accounts associated to your organization',
    icon: SettingsUserAccounts,
    component: UserManagementTab,
    [SETTINGS_ROUTES_KEYS.showComponent]: false,
  },
  {
    title: 'Page Permissions',
    body: 'Configure page permissions associated to user account roles',
    icon: SettingsPagePermissions,
    component: PagePermissionsTab,
    [SETTINGS_ROUTES_KEYS.showComponent]: false,
  },
  {
    title: 'User Groups',
    body: 'Configure user groups to arrange users into easily manageable collections',
    icon: SettingsUserGroup,
    component: AgentGroupsTab,
    [SETTINGS_ROUTES_KEYS.showComponent]: false,
  },
  // {
  //   title: 'User Skills',
  //   body: 'Assign special platform behavior for users and user groups',
  //   icon: SettingsUserSkills,
  //   component: AgentSkillsTab,
  //   [SETTINGS_ROUTES_KEYS.showComponent]: false,
  // },
];

const UsersSettings = () => {
  return (
    <div>
      <SettingsRouteRow data={UsersRoutesData} />
    </div>
  );
};

export default UsersSettings;
