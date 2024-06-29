/* eslint-disable react/prop-types */

import { useQuery } from '@tanstack/react-query';
import { getUserGroups } from '../../../../../Services/axios/permissionsUserGroups';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import HeaderCell from '../../../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import RowCell from '../../../../shared/REDISIGNED/table/components/RowCell/RowCell';
import { StyledText } from '../../../../shared/styles/styled';
import PermissionColumnCell from '../../components/ManagePermissionsTab/PermissionColumnCell/PermissionColumnCell';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ManagePermissionsActions from '../../components/table/ManagePermissionsAction/ManagePermissionsActions';
import SpecialRoles from '../../components/table/SpecialRoles/SpecialRoles';
import { StyledActions, StyledActionsIconWrapper } from '../../components/table/StyledActions';
import UsernameWithAvatar from '../../components/table/UsernameWithAvatar/UsernameWithAvatar';
import UsersActions from '../../components/table/UsersActions/UsersActions';
import { formatDateMonthDayYear } from '../formatters';

const userColumn = (params = {}) => ({
  header: 'User',
  accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  Header: (props) => <HeaderCell {...props} />,
  Cell: (props) => <UsernameWithAvatar {...props} />,
  id: 'lastName', // id set to lastName for sorting (has to be either lastName or firstName but not both)
  enableGlobalFilter: false,
  minSize: 140,
  maxSize: 300,
  ...params,
});

export const dateAddedColumn = (params = {}) => ({
  header: 'Date Added',
  accessorFn: (row) => (row.createdDate ? formatDateMonthDayYear(row.createdDate) : '---'),
  Header: (props) => <HeaderCell {...props} />,
  Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center', m: '0 auto' }} />,
  id: 'createdDate', // id needs to match api sort options
  enableGlobalFilter: false,
  align: 'center',
  maxSize: 124,
  size: 124,
  ...params,
});

const lastModifiedColumn = (params = {}) => ({
  header: 'Last Modified',
  accessorFn: (row) => (row.modifiedDate ? formatDateMonthDayYear(row.modifiedDate) : '---'),
  Header: (props) => <HeaderCell {...props} />,
  Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center', m: '0 auto' }} />,
  id: 'modifiedDate',
  enableGlobalFilter: false,
  align: 'center',
  maxSize: 124,
  size: 124,
  ...params,
});

const statusColumn = (params = {}) => ({
  header: 'Status',
  accessorFn: (row) => (row.isLocked ? 'DEACTIVATED' : 'ACTIVATED'),
  Header: (props) => <HeaderCell {...props} />,
  Cell: ({ cell }) => <StatusBadge icon={cell.getValue()} {...cell} />,
  id: 'isLocked',
  enableGlobalFilter: false,
  align: 'center',
  size: 136,
  maxSize: 136,
  ...params,
});

const userGroupColumn = (params = {}) => ({
  header: 'User Groups',
  accessorFn: (row) => row.userGroups,
  Header: (props) => <HeaderCell {...props} />,
  Cell: ({ cell }) => <SpecialRoles roles={cell.getValue()} {...cell} />,
  id: 'userGroups',
  enableGlobalFilter: false,
  align: 'center',
  maxSize: 112,
  size: 112,
  ...params,
});

export const actionsDeleteColumn = (params = {}) => ({
  header: 'Actions',
  id: 'actions',
  accessorFn: (row) => row.isEditable,
  Header: (props) => <HeaderCell {...props} />,
  Cell: ({ cell, row, table }) =>
    cell.getValue() && (
      <StyledActions>
        <StyledActionsIconWrapper onClick={() => table.options.meta.onDelete(row.original)}>
          <CustomTableIcons icon="BIN" width={24} />
        </StyledActionsIconWrapper>
      </StyledActions>
    ),
  enableGlobalFilter: false,
  enableSorting: false,
  align: 'center',
  maxSize: 60,
  size: 60,
  ...params,
});

export const SHORT_USER_COLUMNS = [
  userColumn({
    align: 'left',
    size: '33%',
  }),
  lastModifiedColumn({
    align: 'center',
    size: '33%',
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center' }} />,
  }),
  statusColumn({
    align: 'right',
    size: '33%',
    Cell: ({ cell }) => (
      <StatusBadge icon={cell.getValue()} {...cell} align={{ display: 'inline-flex', justifyContent: 'center' }} />
    ),
  }),
];

export const USERS_COLUMNS = [
  {
    ...userColumn(),
  },
  {
    ...dateAddedColumn(),
  },
  {
    ...lastModifiedColumn(),
  },
  {
    ...userGroupColumn(),
  },
  statusColumn(),
  {
    header: 'Actions',
    id: 'actions',
    accessorFn: (row) => row.isLocked,
    Header: (props) => <HeaderCell {...props} />,
    // added post action function to the table meta data
    Cell: (props) => <UsersActions {...props} />,
    enableGlobalFilter: false,
    enableSorting: false,
    align: 'center',
    maxSize: 60,
    size: 60,
  },
];

export const USER_GROUP_MANAGE_USERS_COLUMNS = [
  {
    header: 'User',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    Header: (props) => <HeaderCell {...props} />,
    Cell: (props) => <UsernameWithAvatar {...props} />,
    id: 'lastName', // id set to lastName for sorting (has to be either lastName or firstName but not both)
    enableGlobalFilter: false,
    minSize: 140,
    maxSize: 300,
  },
  {
    header: 'Last Modified',
    accessorFn: (row) => (row.modifiedDate ? formatDateMonthDayYear(row.modifiedDate) : '---'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center' }} />,
    id: 'modifiedDate',
    enableGlobalFilter: false,
    align: 'center',
    maxSize: 124,
    size: 124,
  },
  {
    header: 'Status',
    accessorFn: (row) => (row.isLocked ? 'DEACTIVATED' : 'ACTIVATED'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <StatusBadge icon={cell.getValue()} {...cell} />,
    id: 'isLocked',
    enableGlobalFilter: false,
    align: 'center',
    size: 136,
    maxSize: 136,
  },
];

export const MANAGE_PERMISSIONS_COLUMNS = [
  {
    header: 'Permission',
    accessorFn: (row) => row.pagePermission?.permission?.permissionName || row.permission.permissionName,
    Header: (props) => <HeaderCell {...props} />,
    Cell: (props) => <PermissionColumnCell {...props} />,
    id: 'permission.permissionName',
    enableGlobalFilter: false,
    minSize: 140,
    maxSize: 300,
  },
  {
    header: 'Date Added',
    accessorFn: (row) => (row.createdDate ? formatDateMonthDayYear(row.createdDate) : '---'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center' }} />,
    id: 'createdDate', // id needs to match api sort options
    enableGlobalFilter: false,
    align: 'center',
    maxSize: 115,
    size: 115,
  },
  {
    header: 'Category',
    accessorFn: (row) => row.permission.pageCategory,
    Header: (props) => <HeaderCell {...props} />,
    Cell: (props) => <RowCell {...props} align={{ textAlign: 'left' }} />,
    id: 'permission.pageCategory',
    enableGlobalFilter: false,
    align: 'left',
    maxSize: 100,
    size: 100,
  },
  // {
  //   header: 'Access',
  //   accessorFn: (row) => {
  //     const { permissionName } = row.permission;
  //     const isCustom = permissionName.includes('CUSTOM');
  //     const customAccessLevel = isCustom ? 'CUSTOM' : 'WRITE';
  //     const permissionAccessLevel = permissionName.includes('READ') ? 'READ' : customAccessLevel;

  //     return {
  //       accessLevel: permissionAccessLevel || 'Full Access',
  //       isSuperAdmin: row.permission.isSuperAdmin,
  //     };
  //   },
  //   Header: (props) => <HeaderCell {...props} />,
  //   Cell: (props) => <PermissionAccessLevel {...props} />,
  //   id: 'permission.permissionAccessLevel',
  //   enableGlobalFilter: false,
  //   align: 'center',
  //   maxSize: 115,
  //   size: 115,
  // },
  {
    header: 'Actions',
    id: 'permission.actions',
    accessorFn: (row) => row.id,
    Header: (props) => <HeaderCell {...props} />,
    Cell: (props) => <ManagePermissionsActions {...props} />,
    enableGlobalFilter: false,
    enableSorting: false,
    align: 'center',
    maxSize: 60,
    size: 60,
  },
];

export const MANAGE_USER_GROUPS_COLUMNS = [
  {
    header: 'User Groups',
    accessorFn: (row) => row.name,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, table }) => {
      const { meta } = table.options;
      const groupId = meta.getGroupId(cell.row);

      return (
        <StyledText size={16} weight={600} onClick={() => meta.onUserGroupClick(groupId)} cursor="pointer">
          {cell.getValue()}
        </StyledText>
      );
    },
    id: 'name',
    enableGlobalFilter: false,
    size: 300,
    maxSize: 300,
  },
  {
    ...dateAddedColumn({
      header: 'Date Created',
      align: 'center',
      // size: '15%',
    }),
  },
  {
    ...lastModifiedColumn({
      header: 'Last Modified',
      align: 'center',
      // size: '15%',
    }),
  },
  {
    ...userGroupColumn({
      size: 118,
      header: 'Special Role',
    }),
  },
  {
    header: 'Users',
    accessorFn: (row) => row.userCount,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center' }} />,
    id: 'userCount',
    align: 'center',
    enableGlobalFilter: false,
    size: 50,
    maxSize: 50,
  },
  {
    ...actionsDeleteColumn({
      accessorFn: (row) => row.isEditable,
      enableSorting: false,
      Cell: ({ cell, row, table }) => {
        const value = cell.getValue();
        const groupId = row.original?.id;
        const filterParam = {
          userGroupIds: [groupId],
        };
        const searchParams = new URLSearchParams(filterParam).toString();

        const { data: showDeleteBtn } = useQuery({
          queryKey: ['getCellUserGroup', searchParams],
          queryFn: () => getUserGroups(searchParams),
          enabled: !!groupId,
          select: (data) => {
            const hasIsEditable = Object.keys(data?.content[0])?.includes('isEditable');
            const isEditable = hasIsEditable ? data?.content[0]?.isEditable : true;

            return isEditable;
          },
        });

        return (
          (showDeleteBtn || value) && (
            <StyledActions>
              <StyledActionsIconWrapper onClick={() => table.options.meta.onDelete(row.original)}>
                <CustomTableIcons icon="BIN" width={24} />
              </StyledActionsIconWrapper>
            </StyledActions>
          )
        );
      },
    }),
  },
];
