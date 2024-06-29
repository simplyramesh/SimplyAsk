import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import routes from '../../../../../../config/routes';
import { useUser } from '../../../../../../contexts/UserContext';
import { useTableSortAndFilter } from '../../../../../../hooks/useTableSortAndFilter';
import { getUserGroupsWithFilters } from '../../../../../../Services/axios/permissionsUserGroups';
import { getUsersWithFilters } from '../../../../../../Services/axios/permissionsUsers';
import PageableTable from '../../../../../shared/REDISIGNED/table/PageableTable';
import { StyledCard, StyledFlex } from '../../../../../shared/styles/styled';
import { USER_GROUPS_COLUMNS_CONDENSED } from '../../../utils/columnsFormatters/userGroupsColumnsFormatter';
import { SHORT_USER_COLUMNS } from '../../../utils/columnsFormatters/usersColumnsFormatter';
import CardGroupsHeader from '../../CardGroupsHeader/CardGroupsHeader';
import EmptyTable from '../../EmptyTable/EmptyTable';
import { DEFAULT_PAGINATION } from '../../../../../shared/constants/core';

export const PermissionGroupGeneralTab = ({ onTabChange, userGroupIds, userIds }) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars

  const {
    user: { timezone },
  } = useUser();

  // const groupIdsStr = userGroupIds?.join(',');
  // const userIdsStr = userIds?.join(',');

  const INITIAL_USERS_FILTERS = {
    timezone,
    userIds,
  };

  const INITIAL_GROUPS_FILTERS = {
    timezone,
    userGroupIds,
  };

  const { pagination, setPagination, sorting, setSorting, data, isFetching, isLoading } = useTableSortAndFilter({
    queryKey: ['getPermissionGroupFilteredUsers'],
    queryFn: getUsersWithFilters,
    initialSorting: [
      {
        id: 'modifiedDate',
        desc: false,
      },
    ],
    initialFilters: INITIAL_USERS_FILTERS,
    pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
    pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
    options: {
      enabled: userIds?.length > 0,
    },
  });

  const {
    pagination: paginationGroups,
    setPagination: setPaginationGroups,
    sorting: sortingGroups,
    setSorting: setSortingGroups,
    data: dataGroups,
    isFetching: isFetchingGroups,
    isLoading: isLoadingGroups,
  } = useTableSortAndFilter({
    queryKey: ['getPermissionGroupUserGroups'],
    queryFn: getUserGroupsWithFilters,
    initialSorting: [
      {
        id: 'modifiedDate',
        desc: false,
      },
    ],
    initialFilters: INITIAL_GROUPS_FILTERS,
    pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
    pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
    options: {
      enabled: userGroupIds?.length > 0,
    },
  });

  useEffect(() => {
    if (location.search.includes('tab=general')) {
      queryClient.invalidateQueries({ queryKey: ['getPermissionGroupUserGroups', 'getPermissionGroupFilteredUsers'] });
    }
  }, [location.search]);

  return (
    <StyledFlex mr="36px" gap="36px">
      <StyledFlex>
        <StyledCard>
          <CardGroupsHeader association="GROUPS_USERS" onManage={(e) => onTabChange(e, 2)} />
          <PageableTable
            data={data}
            columns={SHORT_USER_COLUMNS}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            isFetching={isFetching}
            isLoading={isLoading}
            meta={{
              onUserClick: (id) =>
                navigate({
                  pathname: `${routes.SETTINGS_ACCESS_MANAGER_USERS}/${id}`,
                  search: 'tab=profile',
                }),
            }}
            muiTableBodyProps={EmptyTable}
          />
        </StyledCard>
      </StyledFlex>
      <StyledFlex>
        <StyledCard>
          <CardGroupsHeader association="PROFILE_GROUPS" onManage={(e) => onTabChange(e, 3)} />
          <PageableTable
            data={dataGroups}
            columns={USER_GROUPS_COLUMNS_CONDENSED}
            pagination={paginationGroups}
            setPagination={setPaginationGroups}
            sorting={sortingGroups}
            setSorting={setSortingGroups}
            isFetching={isFetchingGroups}
            isLoading={isLoadingGroups}
            muiTableBodyProps={EmptyTable}
            meta={{
              onUserGroupNameClick: (id) =>
                navigate({
                  pathname: `${routes.SETTINGS_USER_GROUPS}/${id}`,
                  search: 'tab=general',
                }),
            }}
          />
        </StyledCard>
      </StyledFlex>
    </StyledFlex>
  );
};

PermissionGroupGeneralTab.propTypes = {
  onTabChange: PropTypes.func,
  userGroupIds: PropTypes.array,
  userIds: PropTypes.array,
};
