import PropTypes from 'prop-types';
import { useLocation, useSearchParams } from 'react-router-dom';

import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const findGroupName = (location) => {
  const groupNameArray = ['users', 'userGroups', 'permissionGroups'];

  const name = groupNameArray.find((group) => location.pathname.includes(group));

  return name;
};

const singularize = (string) => {
  if (!string || typeof string !== 'string') return '';

  const pluralOptionsRegEx = /s$|es$/;

  return string.replace(pluralOptionsRegEx, '');
};

const toSentenceCase = (string) => {
  if (!string || typeof string !== 'string') return '';

  const separatedAndLowerCased = string.replace(/([A-Z])/g, ' $1').toLowerCase();

  return separatedAndLowerCased;
};
// TODO: implement filter message once API is updated
// eslint-disable-next-line no-unused-vars

const view = (title) => {
  const isUsers = title.toLowerCase() === 'user';

  return `There are currently no ${title.toLowerCase()}s. Add a new ${title.toLowerCase()} by using the “${isUsers ? 'Add' : 'Create'} ${title}” button in the top right`;
};

const permissions = (groupName) => {
  const sentenceCased = toSentenceCase(singularize(groupName));

  return `The ${sentenceCased} currently has no permissions. At the top of the page, you can add new permissions ${sentenceCased !== 'permission group' ? ', or permission groups' : ''}.`;
};

const userAndUserGroups = (title, groupName) => {
  const sentenceCased = toSentenceCase(singularize(groupName));

  return `There are currently no ${title.toLowerCase()}s. At the top of the table, you can add an existing ${title.toLowerCase()} to the ${sentenceCased}`;
};

const addPermissionGroups =
  'There are currently no permission groups. At the top of the page, you can add existing permission groups.';

const details = (currentTab, title, groupName) => {
  const assigned = {
    message: '',
  };

  const addANew = {
    message: '',
  };

  if ((currentTab === 'profile' || currentTab === 'general') && title.toLowerCase() === 'user group') {
    assigned.message =
      currentTab === 'profile'
        ? 'The user is currently not part of any user groups'
        : 'There are currently no user groups this permission group is assigned to';

    addANew.message = 'Add a new user group by using the “Manage User Groups” button in the top right';
  }

  if (currentTab === 'general' && title.toLowerCase() === 'user') {
    assigned.message =
      groupName === 'userGroups'
        ? 'There are currently no users assigned to this user group'
        : 'There are currently no users this permission group is assigned to';
    addANew.message = 'Add a new user by using the “Manage Users” button in the top right';
  }

  return `${assigned.message}. ${addANew.message}`;
};

const selectOptionsKey = (currentTab, tableName) => {
  if (tableName.toLowerCase() === 'permission') return tableName.toLowerCase();
  if (currentTab === 'view') return currentTab;
  if (currentTab === 'managePermissions' && tableName.toLowerCase() === 'permission group')
    return tableName.toLowerCase();
  if (currentTab === 'manageUsers') return `${tableName.toLowerCase()}s`;
  if (currentTab === 'profile' || currentTab === 'general') return 'details';
  if (currentTab === 'manageUserGroups') return 'user groups';

  return 'empty';
};

const tableSelector = (currentTab, title, groupName, tableName) => {
  const options = {
    view: view(title),
    permission: permissions(groupName),
    'user groups': userAndUserGroups(title, groupName),
    users: userAndUserGroups(title, groupName),
    'permission group': addPermissionGroups,
    details: details(currentTab, title, groupName),
    empty: '',
  };

  const selector = selectOptionsKey(currentTab, tableName);

  return options[selector];
};

const EmptyTable = ({ table }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const currentTab = searchParams.get('tab') || 'view';

  const tableName = table.getAllColumns()[0].columnDef.header;
  const title = singularize(tableName); // in case it already is plural, 's' is added in jsx
  const groupName = findGroupName(location);

  const message = tableSelector(currentTab, title, groupName, tableName);

  const columnSpan = table.getAllColumns().length;

  const Empty = () => (
    <tbody>
      <tr>
        <td colSpan={columnSpan}>
          <StyledFlex gap="18px" flex="1" alignItems="center" justifyContent="center" mt="10vh" mb="10vh">
            <CustomTableIcons icon="EMPTY" width={88} />
            <StyledFlex width="408px" alignItems="center" justifyContent="center">
              <StyledText as="h3" size={18} weight={600} mb={10}>{`No ${title}s Found`}</StyledText>
              <StyledText as="p" size={16} weight={400} lh={21} textAlign="center">
                {message}
              </StyledText>
            </StyledFlex>
          </StyledFlex>
        </td>
      </tr>
    </tbody>
  );

  if (table.getSortedRowModel().rows.length === 0) {
    return {
      component: Empty,
    };
  }
};

export default EmptyTable;

EmptyTable.propTypes = {
  table: PropTypes.shape({
    getAllColumns: PropTypes.func,
    getSortedRowModel: PropTypes.func,
  }),
};
