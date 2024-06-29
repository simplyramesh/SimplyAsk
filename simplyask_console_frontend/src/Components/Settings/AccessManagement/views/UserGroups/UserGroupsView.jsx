import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import { createUserGroup, deleteUserGroup, getUserGroups } from '../../../../../Services/axios/permissionsUserGroups';
import { patchEditUser } from '../../../../../Services/axios/permissionsUsers';
import { getAllPermissionRoles } from '../../../../../Services/axios/requestManagerAxios';
import { DEFAULT_PAGINATION } from '../../../../shared/constants/core';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import TableHeader from '../../../../shared/REDISIGNED/table/components/TableHeader/TableHeader';
import PageableTable from '../../../../shared/REDISIGNED/table/PageableTable';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import { StyledCard } from '../../../../shared/styles/styled';
import ViewFiltersButton from '../../../../shared/ViewFiltersButton/ViewFiltersButton';
import EmptyTable from '../../components/EmptyTable/EmptyTable';
import UserGroupsFilters from '../../components/filters/UserGroupsFilters/UserGroupsFilters';
import UserGroupsModalContent from '../../components/modals/formModals/UserGroups/UserGroupsModalForm';
import SideModalFilterContent from '../../components/modals/sideModals/SideModalFilterContent/SideModalFilterContent';
import { useEntityCreateDelete } from '../../hooks/useGroupsCreateDelete';
import { USER_GROUPS_COLUMNS } from '../../utils/columnsFormatters/userGroupsColumnsFormatter';
import { filterListArr } from '../../utils/formatters';
import { calendarFilter } from '../../utils/helpers';

const onUserGroupsFiltersState = (previous, value, action) => {
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

  return { ...previous };
};

const UserGroupsView = () => {
  const navigate = useNavigate();

  const {
    currentUser,
  } = useGetCurrentUser();

  const USER_GROUPS_FILTERS_INIT_STATE = {
    // API filters
    editedAfter: '',
    editedBefore: '',
    createdAfter: '',
    createdBefore: '',
    timezone: currentUser?.timezone,
    role: [], // List<string> UUID's of UserGroups
    isLocked: '', // LOCKED, UNLOCKED, BOTH
  };

  const [itemToDelete, setItemToDelete] = useState(null);

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [usersGroupsFiltersValues, setUsersGroupsFiltersValues] = useState({ date: null, isLocked: [], roles: [] });
  const [userGroupsFilters, setUserGroupsFilters] = useState({ table: {}, api: {} });
  const [showFilters, setShowFilters] = useState(false);

  const [isAddUserGroupOpen, setIsAddUserGroupOpen] = useState(false);

  const tableRef = useRef(null);

  const { data: roles } = useQuery({
    queryKey: ['getAllPermissionRoles'],
    queryFn: getAllPermissionRoles,
    enabled: isViewFiltersOpen,
  });

  const { createEntity, deleteEntity, isCreateLoading } = useEntityCreateDelete({
    createFn: createUserGroup,
    deleteFn: deleteUserGroup,
    invalidateQueryKey: 'getUserGroups',
    successCreateMessage: ({ variables }) => `User group "${variables.name}" was successfully created!`,
    successDeleteMessage: ({ variables }) => `User group "${variables.name}" was successfully removed!`,
    onCreateSuccess: () => setIsAddUserGroupOpen(false),
    onDeleteSuccess: () => setIsAddUserGroupOpen(false),
  });

  const handleCreatePermGroup = async (formik) => {
    await createEntity(formik.values);

    formik.resetForm();
  };

  const handleOpenDeleteConfirm = (item) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    await deleteEntity(itemToDelete.original);
    setItemToDelete(null);
  };

  const handleUserGroupClick = useCallback((id) => {
    navigate({
      pathname: `${routes.SETTINGS_USER_GROUPS}/${id}`,
      search: 'tab=general',
    });
  }, []);

  const {
    setColumnFilters, setSearchText, pagination, setPagination, sorting, setSorting, data, isFetching, refetch,
  } = useTableSortAndFilter({
    queryKey: 'getUserGroups',
    queryFn: getUserGroups,
    initialSorting: [
      {
        id: '',
        desc: false,
      },
    ],
    initialFilters: USER_GROUPS_FILTERS_INIT_STATE,
    pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
    pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
  });

  // TODO: refactor to remove repeated code
  const handleFilterChange = (value, action) => {
    setUsersGroupsFiltersValues((prev) => ({ ...prev, [action ? action.name : 'date']: value }));
    setUserGroupsFilters((prev) => onUserGroupsFiltersState(prev, value, action));
  };

  const handleClearFilters = () => {
    setUsersGroupsFiltersValues({ date: null, roles: [] });

    setUserGroupsFilters({
      table: {},
      api: USER_GROUPS_FILTERS_INIT_STATE,
    });

    setColumnFilters(USER_GROUPS_FILTERS_INIT_STATE);
    setPagination({ ...pagination, pageIndex: 0 });
    setShowFilters(false);
  };

  const handleConfirmFilters = () => {
    setColumnFilters({ ...userGroupsFilters.api, timezone: currentUser?.timezone });
    setPagination({ ...pagination, pageIndex: 0 });
    setShowFilters(true);
  };

  // TODO: add toast confirmation of success or failure
  const onChangeUserStatus = useCallback(async (id, payload) => {
    try {
      return await patchEditUser(id, payload);
    } catch (error) {
      throw new Error(error);
    } finally {
      refetch();
    }
  }, []);

  const headerComponents = [
    <Box display="flex" gap="16px" key="user-groups-view-header-1">
      <SearchBar placeholder="Search User Groups..." onChange={(e) => setSearchText(e.target.value)} />
      <ViewFiltersButton onClick={() => setIsViewFiltersOpen(true)} />
    </Box>,
    <Box display="flex" key="user-groups-view-header-2">
      <StyledButton
        variant="contained"
        secondary
        startIcon={<CustomTableIcons icon="ADD" width={24} color="white" />}
        onClick={() => setIsAddUserGroupOpen(true)}
      >
        Create User Group
      </StyledButton>
    </Box>,
  ];

  return (
    <>
      {/* modals */}
      <SideModalFilterContent
        isModalOpen={isViewFiltersOpen}
        onModalClose={() => setIsViewFiltersOpen(false)}
        onConfirm={handleConfirmFilters}
      >
        <UserGroupsFilters
          userGroupsFilters={usersGroupsFiltersValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          roles={roles}
        />
      </SideModalFilterContent>
      <UserGroupsModalContent
        open={isAddUserGroupOpen}
        onClose={() => setIsAddUserGroupOpen(false)}
        title="Create User Group"
        onSubmit={handleCreatePermGroup}
        isLoading={isCreateLoading}
      />
      <ConfirmationModal
        isOpen={!!itemToDelete}
        onCloseModal={() => setItemToDelete(null)}
        onSuccessClick={handleConfirmDelete}
        successBtnText="Delete"
        alertType="DANGER"
        title="Are You Sure?"
        text={`You are about to remove the "${itemToDelete?.original.name}" group. All associated users and permissions will be permanently lost.`}
      />
      {/* toolbar and table */}
      <StyledCard>
        <TableHeader
          enhancedHeaderTitle="Assigned users to, or remove them from, this user groups"
          filterList={filterListArr(userGroupsFilters.table)}
          secondarySelectPlaceholder
          onRemove={(z, y) => console.log(z, y)}
          onClearFilters={handleClearFilters}
          showFilters={showFilters}
          enhancedHeader
          headerComponents={headerComponents}
        />
        <PageableTable
          data={data}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          isLoading={isFetching}
          enableStickyHeader={false}
          columns={USER_GROUPS_COLUMNS({ onDelete: handleOpenDeleteConfirm, onUserGroupClick: handleUserGroupClick })}
          tableRef={tableRef}
          tableName="User Groups"
          meta={{
            onChangeUserStatus,
            onUserGroupNameClick: (id) => handleUserGroupClick(id),
          }}
          muiTableBodyProps={EmptyTable}
        />
      </StyledCard>
    </>
  );
};

export default UserGroupsView;
