import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getPermissionGroup, patchPermissionGroup } from '../../../../../Services/axios/permissions';
import {
  getUserGroupPermissionsById,
  getUsersWithFilters,
  patchUserGroupsById,
} from '../../../../../Services/axios/permissionsUsers';
import { getAllPermissionRoles } from '../../../../../Services/axios/requestManagerAxios';
import { getUsers } from '../../../../../Services/axios/userAxios';
import routes from '../../../../../config/routes';
import { useUser } from '../../../../../contexts/UserContext';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import { StyledLoadingButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import PageableTable from '../../../../shared/REDISIGNED/table/PageableTable';
import TableHeader from '../../../../shared/REDISIGNED/table/components/TableHeader/TableHeader';
import { IS_LOCKED_VALUES } from '../../../../shared/REDISIGNED/table/constants/tableConstants';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import ViewFiltersButton from '../../../../shared/ViewFiltersButton/ViewFiltersButton';
import { DEFAULT_PAGINATION } from '../../../../shared/constants/core';
import { StyledCard, StyledFlex } from '../../../../shared/styles/styled';
import { MANAGE_USERS_COLUMNS } from '../../utils/columnsFormatters/manageUsersColumnsFormatter';
import { filterListArr } from '../../utils/formatters';
import { calendarFilter } from '../../utils/helpers';
import EmptyTable from '../EmptyTable/EmptyTable';
import { requestSelector } from '../ManagePermissionsTab/ManagePermissionsTab';
import PrimarySelect from '../dropdowns/PrimarySelect/PrimarySelect';
import UsersFilters from '../filters/UsersFilters/UsersFilters';
import SideModalFilterContent from '../modals/sideModals/SideModalFilterContent/SideModalFilterContent';

const getRequestSelector = (groupType, param) => {
  switch (groupType) {
    case 'userGroup':
      return getUserGroupPermissionsById(param);
    case 'permissionGroup':
      return getPermissionGroup(param);
    default:
      return null;
  }
};

const patchRequestSelector = (groupType, groupId, data) => {
  switch (groupType) {
    case 'userGroup':
      return patchUserGroupsById(groupId, data);
    case 'permissionGroup':
      return patchPermissionGroup(groupId, data);
    default:
      return null;
  }
};

const onUsersFiltersState = (previous, value, action) => {
  const name = action ? action.name : value.name;

  if (!action) {
    return calendarFilter(previous, value, action);
  }

  if (name === 'roles') {
    return {
      ...previous,
      table: {
        ...previous.table,
        role: value.map((role) => role.role),
      },
      api: {
        ...previous.api,
        roles: value.map((role) => role.id),
      },
    };
  }

  if (name === 'isLocked') {
    const isBoth = value.length === 2;
    const isEmpty = value.length === 0;
    const emptyOrBoth = isEmpty ? IS_LOCKED_VALUES.EMPTY : IS_LOCKED_VALUES.BOTH;
    const locked = value.length === 1 && value[0].value ? IS_LOCKED_VALUES.LOCKED : IS_LOCKED_VALUES.UNLOCKED;

    return {
      ...previous,
      table: {
        ...previous.table,
        status: value.map((status) => status.label),
      },
      api: {
        ...previous.api,
        isLocked: isBoth || isEmpty ? emptyOrBoth : locked,
      },
    };
  }

  return { ...previous };
};
const ManageUsersTab = ({ groupType }) => {
  const navigate = useNavigate();
  const { id: groupId } = useParams();

  const queryClient = useQueryClient();

  const {
    user: { timezone },
  } = useUser();

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [usersFilters, setUsersFilters] = useState({ table: {}, api: {} });
  const [usersFiltersValue, setUsersFiltersValue] = useState({ isLocked: [], roles: [], date: null });
  const [showUserFilters, setShowUserFilters] = useState(false);

  const [userToAdd, setUserToAdd] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUserAddLoading, setIsUserAddLoading] = useState(false);
  const [isUserDeleteLoading, setIsUserDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const tableRef = useRef(null);

  const lastModifiedRef = useRef(null);
  const roleRef = useRef(null);
  const statusRef = useRef(null);

  const { data: isGroupEditable } = useQuery({
    queryKey: ['getPermissionsById', groupType, groupId],
    queryFn: () => requestSelector(groupType, groupId),
    enabled: !!groupId,
    select: (data) => {
      const hasIsEditable = Object.keys(data)?.includes('isEditable');

      return hasIsEditable ? data?.isEditable : true;
    },
  });

  const { data: usersList } = useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers,
    enabled: !!groupId,
  });

  const { data: groupUsersList, isFetching: isUserGroupsFetching } = useQuery({
    queryKey: ['getGroupUsers', groupId],
    queryFn: () => getRequestSelector(groupType, groupId),
    enabled: !!groupId,
  });

  const { data: roles } = useQuery({
    queryKey: ['getAllPermissionRoles'],
    queryFn: getAllPermissionRoles,
    enabled: isViewFiltersOpen,
  });

  useEffect(() => {
    if (groupUsersList?.userIds) {
      setColumnFilters((prev) => ({ ...prev, userIds: groupUsersList?.userIds }));
    }
  }, [groupUsersList?.userIds]);

  const USERS_FILTERS_INIT_STATE = {
    editedAfter: '',
    editedBefore: '',
    createdAfter: '',
    createdBefore: '',
    timezone,
    role: [],
    isLocked: 'BOTH',
    userIds: groupUsersList?.userIds,
  };

  const { setColumnFilters, setSearchText, pagination, setPagination, sorting, setSorting, data, isFetching } =
    useTableSortAndFilter({
      queryKey: 'getManageUsersWithFilters',
      queryFn: getUsersWithFilters,
      initialSorting: [
        {
          id: 'modifiedDate',
          desc: false,
        },
      ],
      initialFilters: USERS_FILTERS_INIT_STATE,
      pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
      pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
      options: {
        enabled: !!groupUsersList?.userIds?.length,
        select: (data) => ({
          ...data,
          content: data?.content?.map((user) => ({ ...user, isEditable: isGroupEditable })),
        }),
      },
    });

  const handleFilterChange = (value, action) => {
    setUsersFiltersValue((prev) => ({ ...prev, [action ? action.name : value.name]: value }));
    setUsersFilters((prev) => onUsersFiltersState(prev, value, action));
  };

  const handleClearFilters = () => {
    setUsersFiltersValue({ isLocked: [], roles: [], date: null });
    setUsersFilters({
      table: {},
      api: USERS_FILTERS_INIT_STATE,
    });

    setColumnFilters(USERS_FILTERS_INIT_STATE);
    setPagination({ ...pagination, pageIndex: 0 });
    setShowUserFilters(false);
  };

  const handleConfirmFilters = () => {
    setColumnFilters((prev) => ({ ...prev, ...usersFilters.api }));
    setPagination({ ...pagination, pageIndex: 0 });
    setShowUserFilters(true);
  };

  const onUserClick = useCallback((id) => {
    navigate({
      pathname: `${routes.SETTINGS_ACCESS_MANAGER_USERS}/${id}`,
      search: 'tab=profile',
    });
  }, []);

  const handleAddUser = async () => {
    const userIds = userToAdd?.map(({ id }) => id);

    try {
      setIsUserAddLoading(true);

      const addedUsersResponse = await patchRequestSelector(groupType, groupId, {
        userIds: [...groupUsersList?.userIds, ...userIds],
      });

      setColumnFilters((prev) => ({ ...prev, userIds: addedUsersResponse?.userIds }));

      setUserToAdd([]);

      toast.success('Users added to group');
    } catch {
      toast.error('Error adding users to group');
    } finally {
      queryClient.invalidateQueries({ queryKey: ['getGroupUsers'] });
      setIsUserAddLoading(false);
    }
  };

  const handleOpenDeleteConfirm = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsUserDeleteLoading(true);

      const removeUserFromGroup = groupUsersList?.userIds?.filter((id) => id !== itemToDelete.original.id);

      const patchUserGroupsSuccess = await patchRequestSelector(groupType, groupId, { userIds: removeUserFromGroup });

      const groupUserIds = patchUserGroupsSuccess?.userIds.length > 0 ? patchUserGroupsSuccess?.userIds : null;

      setColumnFilters((prev) => ({ ...prev, userIds: groupUserIds }));

      setItemToDelete([]);
      setIsDeleteModalOpen(false);

      toast.success('User removed from group');
    } catch {
      toast.error('Error removing user from group');
    } finally {
      setIsUserDeleteLoading(false);
      queryClient.invalidateQueries({ queryKey: ['getGroupUsers'] });
    }
  };

  const headerComponents = [
    <StyledFlex direction="row" key="users-view-header-component-1" gap="16px" mt="4px">
      <SearchBar placeholder="Search Users..." onChange={(e) => setSearchText(e.target.value)} />
      <ViewFiltersButton onClick={() => setIsViewFiltersOpen(true)} />
    </StyledFlex>,
  ];

  const enhancedHeaderComponentsBeforeDivider = [
    <PrimarySelect
      key="users-view-header-component-3"
      placeholder="Add Users"
      onChange={(value) => setUserToAdd(value)}
      value={userToAdd}
      options={usersList || []}
      getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}`}
      getOptionValue={(option) => option?.id}
      closeMenuOnSelect={false}
      withSeparator
      isMulti
      withMultiSelect
      isClearable={false}
    />,
    <StyledLoadingButton
      secondary
      variant="contained"
      key="users-view-header-component-5"
      onClick={handleAddUser}
      disabled={!userToAdd?.length}
      loading={isUserAddLoading}
    >
      Add
    </StyledLoadingButton>,
  ];

  return (
    <>
      {/* modals */}
      <SideModalFilterContent
        isModalOpen={isViewFiltersOpen}
        onModalClose={() => setIsViewFiltersOpen(false)}
        onConfirm={handleConfirmFilters}
      >
        <UsersFilters
          usersFilters={usersFiltersValue}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          roles={roles}
          dropdownRefs={{
            lastModifiedRef,
            roleRef,
            statusRef,
          }}
        />
      </SideModalFilterContent>
      {/* toolbar and table */}
      <StyledCard>
        <TableHeader
          enhancedHeaderTitle="Assigned users to, or remove them from, this user groups"
          filterList={filterListArr(usersFilters.table)}
          secondarySelectPlaceholder
          onRemove={(z, y) => console.log(z, y)}
          onClearFilters={handleClearFilters}
          showFilters={showUserFilters}
          enhancedHeader
          headerComponents={headerComponents}
          enhancedHeaderComponentsBeforeDivider={enhancedHeaderComponentsBeforeDivider}
        />
        <PageableTable
          data={data}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          isFetching={isFetching || isUserGroupsFetching}
          isLoading={isFetching || isUserGroupsFetching}
          enableStickyHeader={false}
          columns={MANAGE_USERS_COLUMNS({ onDelete: handleOpenDeleteConfirm })}
          tableRef={tableRef}
          tableName="Users"
          meta={{
            onChangeUserStatus: () => {},
            onUserClick: (id) => onUserClick(id),
          }}
          muiTableBodyProps={EmptyTable}
        />
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onCloseModal={() => setIsDeleteModalOpen(false)}
          onSuccessClick={handleConfirmDelete}
          successBtnText="Delete"
          alertType="DANGER"
          title="Are You Sure?"
          text={`You are about to remove ${itemToDelete?.original?.firstName} ${itemToDelete?.original?.lastName}.  The user will loose all permissions associated with this ${groupType === 'permissionGroup' ? 'permission group' : 'user group'}.`}
          isLoading={isUserDeleteLoading}
        />
      </StyledCard>
    </>
  );
};

export default ManageUsersTab;
