import Box from '@mui/material/Box';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useRef, useState } from 'react';
import { useLocation, useNavigate, generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';

import routes from '../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import { getUsersWithFilters, patchEditUser } from '../../../../../Services/axios/permissionsUsers';
import { getAllPermissionRoles } from '../../../../../Services/axios/requestManagerAxios';
import { DEFAULT_PAGINATION } from '../../../../shared/constants/core';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import TableHeader from '../../../../shared/REDISIGNED/table/components/TableHeader/TableHeader';
import { IS_LOCKED_VALUES } from '../../../../shared/REDISIGNED/table/constants/tableConstants';
import PageableTable from '../../../../shared/REDISIGNED/table/PageableTable';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import { StyledCard } from '../../../../shared/styles/styled';
import ViewFiltersButton from '../../../../shared/ViewFiltersButton/ViewFiltersButton';
import EmptyTable from '../../components/EmptyTable/EmptyTable';
import UsersFilters from '../../components/filters/UsersFilters/UsersFilters';
//
import AddUserModalForm from '../../components/modals/formModals/AddUserModal/AddUserModalForm';
import SideModalFilterContent from '../../components/modals/sideModals/SideModalFilterContent/SideModalFilterContent';
import { USERS_COLUMNS } from '../../utils/columnsFormatters/usersColumnsFormatter';
import { filterListArr } from '../../utils/formatters';
import { calendarFilter } from '../../utils/helpers';

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

const UsersView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    currentUser,
  } = useGetCurrentUser();

  const USERS_FILTERS_INIT_STATE = {
    // API filters
    editedAfter: '',
    editedBefore: '',
    createdAfter: '',
    createdBefore: '',
    // isAscending: true,
    timezone: currentUser?.timezone,
    role: [], // List<string> UUID's of UserGroups
    isLocked: '', // LOCKED, UNLOCKED, BOTH
  };

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [usersFilters, setUsersFilters] = useState({ table: {}, api: {} });
  const [usersFiltersValues, setUsersFiltersValues] = useState({ date: null, isLocked: [], roles: [] });
  const [showUserFilters, setShowUserFilters] = useState(false);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const lastModifiedRef = useRef(null);
  const roleRef = useRef(null);
  const statusRef = useRef(null);

  const tableRef = useRef(null);

  const { data: roles } = useQuery({
    queryKey: ['getAllPermissionRoles'],
    queryFn: getAllPermissionRoles,
    enabled: isViewFiltersOpen,
  });

  const {
    setColumnFilters, setSearchText, pagination, setPagination, sorting, setSorting, data, isFetching,
  } = useTableSortAndFilter({
    queryKey: 'getFilteredUsers',
    queryFn: getUsersWithFilters,
    initialSorting: [
      {
        id: '',
        desc: false,
      },
    ],
    initialFilters: USERS_FILTERS_INIT_STATE,
    pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
    pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
  });

  const handleFilterChange = (value, action) => {
    setUsersFiltersValues((prev) => ({ ...prev, [action ? action.name : 'date']: value }));
    setUsersFilters((prev) => onUsersFiltersState(prev, value, action));
  };

  const handleClearFilters = () => {
    setUsersFiltersValues({ date: null, isLocked: [], roles: [] });

    setUsersFilters({
      table: {},
      api: USERS_FILTERS_INIT_STATE,
    });

    setColumnFilters(USERS_FILTERS_INIT_STATE);
    setPagination({ ...pagination, pageIndex: 0 });
    setShowUserFilters(false);
  };
  const handleConfirmFilters = () => {
    setColumnFilters({ ...usersFilters.api, timezone: currentUser?.timezone });
    setPagination({ ...pagination, pageIndex: 0 });
    setShowUserFilters(true);
  };

  const onChangeUserStatus = useCallback(async (id, payload) => {
    try {
      await patchEditUser(id, payload);

      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Unable to update user status');
    } finally {
      queryClient.invalidateQueries({ queryKey: ['getFilteredUsers'] });
    }
  }, []);

  const onUserClick = useCallback((id) => {
    navigate({
      pathname: generatePath(routes.SETTINGS_ACCESS_MANAGER_USER_DETAILS, { id }),
      search: 'tab=profile',
    });
  }, []);

  const headerComponents = [
    <Box key="users-view-header-component-1" display="flex" gap="16px">
      <SearchBar placeholder="Search Users..." onChange={(e) => setSearchText(e.target.value)} />
      <ViewFiltersButton onClick={() => setIsViewFiltersOpen(true)} />
    </Box>,
    <Box key="users-view-header-component-2" display="flex">
      <StyledButton
        variant="contained"
        secondary
        startIcon={<CustomTableIcons icon="ADD" width={24} color="white" />}
        onClick={() => setIsAddUserOpen(true)}
      >
        Add User
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
        <UsersFilters
          usersFilters={usersFiltersValues}
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
      <AddUserModalForm
        open={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        maxWidth="584px"
        title="Add a New User"
        onOpenChange={setIsAddUserOpen}
      />
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
        />
        <PageableTable
          data={data}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          isFetching={isFetching}
          isLoading={isFetching}
          enableStickyHeader={false}
          columns={USERS_COLUMNS}
          tableRef={tableRef}
          tableName="Users"
          meta={{
            onChangeUserStatus,
            onUserClick: (id) => onUserClick(id),
          }}
          muiTableBodyProps={EmptyTable}
        />
      </StyledCard>
    </>
  );
};

export default UsersView;
