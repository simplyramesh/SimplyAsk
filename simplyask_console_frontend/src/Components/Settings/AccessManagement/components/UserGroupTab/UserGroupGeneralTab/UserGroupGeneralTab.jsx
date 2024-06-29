import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import routes from '../../../../../../config/routes';
import { useUser } from '../../../../../../contexts/UserContext';
import { useTableSortAndFilter } from '../../../../../../hooks/useTableSortAndFilter';
import { getUsersWithFilters } from '../../../../../../Services/axios/permissionsUsers';
import { DEFAULT_PAGINATION } from '../../../../../shared/constants/core';
import ContentLayout from '../../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageableTable from '../../../../../shared/REDISIGNED/table/PageableTable';
import { StyledCard, StyledFlex } from '../../../../../shared/styles/styled';
import { USER_GROUP_MANAGE_USERS_COLUMNS } from '../../../utils/columnsFormatters/usersColumnsFormatter';
import CardGroupsHeader from '../../CardGroupsHeader/CardGroupsHeader';
import EmptyTable from '../../EmptyTable/EmptyTable';
import PermissionSummary from '../../PermissionSummary/PermissionSummary';
import UserGroupTabSide from '../UserGroupTabSide/UserGroupTabSide';

export const UserGroupGeneralTab = ({ userGroupData, userGroupId, tabChangeHandler }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user: { timezone },
  } = useUser();

  const INITIAL_FILTERS = {
    timezone,
    userGroupIds: [userGroupId],
  };

  const { pagination, setPagination, sorting, setSorting, data, isFetching, isLoading, refetch } =
    useTableSortAndFilter({
      queryKey: ['getAssociatedUsers'],
      queryFn: getUsersWithFilters,
      initialSorting: [
        {
          id: 'modifiedDate',
          desc: false,
        },
      ],
      initialFilters: INITIAL_FILTERS,
      pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
      pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
    });

  useEffect(() => {
    if (location.search.includes('tab=general')) refetch();
  }, [location.search]);

  return (
    <>
      {userGroupData && (
        <ContentLayout
          side={<UserGroupTabSide userGroupData={userGroupData} isSuperAdmin={userGroupData?.isSuperAdmin} />}
        >
          <StyledFlex mr="36px" gap="36px">
            <PermissionSummary groupType="userGroup" onPermissions={() => tabChangeHandler(null, 1)} />
            <StyledFlex>
              <StyledCard>
                <CardGroupsHeader association="GROUPS_USERS" onManage={() => tabChangeHandler(null, 2)} />
                <PageableTable
                  data={data}
                  columns={USER_GROUP_MANAGE_USERS_COLUMNS}
                  pagination={pagination}
                  setPagination={setPagination}
                  sorting={sorting}
                  setSorting={setSorting}
                  isFetching={isFetching}
                  isLoading={isFetching}
                  muiTableBodyProps={EmptyTable}
                  meta={{
                    onUserClick: (id) =>
                      navigate({
                        pathname: `${routes.SETTINGS_ACCESS_MANAGER_USERS}/${id}`,
                        search: 'tab=profile',
                      }),
                  }}
                />
              </StyledCard>
            </StyledFlex>
          </StyledFlex>
        </ContentLayout>
      )}
    </>
  );
};

export default UserGroupGeneralTab;

UserGroupGeneralTab.propTypes = {
  userGroupId: PropTypes.string,
  tabChangeHandler: PropTypes.func,
};
